# AWS EC2 — deployment runbook

**Related:** [`../docs/MVP_APPLICATION_SPEC.md`](../docs/MVP_APPLICATION_SPEC.md) · [`docker-compose.prod.yml`](./docker-compose.prod.yml)

Deploy the Thrive portal to a single EC2 instance with Docker Compose and **PostgreSQL in a container**. Same pull-only image model as the Oracle path; images are **multi-arch** so they run on x86 (Intel/AMD) or Graviton.

Target here: **Amazon Linux 2023, x86_64** (`ec2-user`).

---

## 1. Instance & networking (one-time)

1. Launch **Amazon Linux 2023** (x86_64), e.g. `t3.small`/`t3.medium` (Java + Postgres want ≥ 2 GB RAM; 4 GB comfortable).
2. Allocate and associate an **Elastic IP** (stable address for DNS + SSH).
3. **Security group** inbound rules:
   - `22` (SSH) — restrict to your IP
   - `80` (HTTP)
   - `443` (HTTPS)
4. Keep the key pair `.pem` — its private key goes into the `DEPLOY_SSH_KEY` GitHub secret.

## 2. Install Docker (optional — the deploy pipeline auto-installs)

`deploy.yml` has an **"Ensure Docker & Compose are installed"** step that installs Docker
and the Compose plugin on first deploy if they're missing (`dnf`/`yum`/`apt-get` aware),
starts the service, and adds the deploy user to the `docker` group. Deploy commands run
via `sudo` so they work on the very first run.

You only need to install manually if you want to run `docker compose` yourself before the
first automated deploy:

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
# install compose plugin
DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/libexec/docker}
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
# log out and back in so the docker group applies
mkdir -p ~/thrivewithtianna
```

Verify: `docker compose version`.

## 3. Secrets — managed via GitHub (recommended)

`deploy.yml` writes `~/thrivewithtianna/.env` on the server from GitHub Actions secrets on
every deploy, so secrets live in GitHub's encrypted store — **not** in the repo and not
hand-edited on the box. Generate strong random values for the password and JWT
(`openssl rand -base64 48`).

### Required secrets

| Secret | Value |
|--------|-------|
| `DEPLOY_HOST` | EC2 Elastic IP |
| `DEPLOY_USER` | `ec2-user` |
| `DEPLOY_SSH_KEY` | Contents of the instance key pair private key (PEM) |
| `DEPLOY_PATH` | `/home/ec2-user/thrivewithtianna` |
| `POSTGRES_PASSWORD` | strong random |
| `JWT_SECRET` | strong random |

### Optional secrets (defaults applied if unset)

| Secret | Default |
|--------|---------|
| `DEPLOY_PORT` | `22` |
| `POSTGRES_DB` | `thrive` |
| `POSTGRES_USER` | `thrive` |
| `FRONTEND_ORIGIN` | `https://app.thrivewithtianna.com` |
| `API_IMAGE` | `ghcr.io/smeduoye/thrivewithtianna-api:latest` |
| `WEB_IMAGE` | `ghcr.io/smeduoye/thrivewithtianna-web:latest` |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` | omitted from `.env` when empty |

Add OAuth / Stripe / email secrets here as M1/M3 land, and extend the "Write server .env"
step in `deploy.yml` to include them.

Until `DEPLOY_HOST` is set, the deploy workflow **skips safely**. If `POSTGRES_PASSWORD` or
`JWT_SECRET` are missing, the deploy fails fast with a clear message.

### Manual alternative

To manage `.env` by hand instead, create `~/thrivewithtianna/.env` on the server (see the
key list above) and remove the "Write server .env from GitHub secrets" step from
`deploy.yml` so it doesn't overwrite your file.

## 5. Deploy

**Automated:** push to `main` → `Release` builds/pushes multi-arch images → `Deploy` SSHes in, pulls, restarts.

**Manual (first run / smoke test):**

```bash
cd ~/thrivewithtianna
docker login ghcr.io       # PAT if packages are private
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

Portal answers on `http://<elastic-ip>` (port 80).

## 6. DNS & TLS

DNS for `thrivewithtianna.com` is at **Name.com** (nameservers `ns*.name.com`). The marketing
site (`thrivewithtianna.com`) stays on GitHub Pages — only add a record for the portal subdomain.

### 6.1 Add the portal DNS record (Name.com)

1. Sign in at [name.com](https://www.name.com) → **My Domains** → **thrivewithtianna.com** → **DNS Records**.
2. Add an **A record**:
   - **Host:** `app`
   - **Answer / Value:** your EC2 Elastic IP (e.g. `13.48.108.246`)
   - **TTL:** `300` (or default)
3. Save. Propagation is usually a few minutes; verify with `nslookup app.thrivewithtianna.com`.

Do **not** change the apex (`@`) A records — those point at GitHub Pages for the marketing site.

### 6.2 HTTPS (automatic — Caddy in Docker)

`docker-compose.prod.yml` includes a **Caddy** container that:

- Listens on ports **80** and **443** (security group must allow both).
- Obtains a **Let's Encrypt** certificate for `APP_DOMAIN` (default `app.thrivewithtianna.com`) once DNS resolves to this host.
- Reverse-proxies to the `web` (nginx) container.

After DNS propagates, open `https://app.thrivewithtianna.com`. First cert issuance can take 1–2 minutes;
check Caddy logs if needed: `sudo docker logs thrivewithtianna-caddy`.

Optional GitHub secret `APP_DOMAIN` overrides the default hostname written to `.env`.

### 6.3 Cloudflare alternative

If you later move DNS to Cloudflare, you can proxy `app` through Cloudflare instead (SSL mode **Full**)
and remove the Caddy service — but Name.com + Caddy works without migrating DNS.

OAuth redirect URIs and Stripe webhooks must use the **HTTPS** production URL.

## 7. Backups

Daily logical backups run automatically via the deploy workflow.

| Item | Location |
|------|----------|
| Backup script | `~/thrive/scripts/pg-backup.sh` (or `$DEPLOY_PATH/scripts/`) |
| Backup files | `~/thrive/backups/thrive-YYYY-MM-DD.sql.gz` |
| Logs | `~/thrive/backups/backup.log`, `cron.log` |
| Schedule | **03:00 UTC** daily (cron) |
| Retention | **14 days** (older `.sql.gz` files deleted automatically) |

### Manual backup (any time)

```bash
cd ~/thrive   # your DEPLOY_PATH
./scripts/pg-backup.sh
ls -lh backups/
```

### Restore (test before pilot)

Stop the API to avoid writes during restore:

```bash
cd ~/thrive
sudo docker compose -f docker-compose.prod.yml stop api
./scripts/pg-restore.sh backups/thrive-2026-07-04.sql.gz
sudo docker compose -f docker-compose.prod.yml start api
```

### Optional: off-site copy

Sync `backups/` to S3 periodically (e.g. `aws s3 sync backups/ s3://your-bucket/thrive-backups/`) for disaster recovery if the EC2 volume is lost.

## 8. Troubleshooting

| Issue | Check |
|-------|-------|
| `exec format error` on container start | Image arch vs instance arch — images must include `linux/amd64` (they now do) |
| API OOM / restart loop | Instance RAM; lower `JAVA_TOOL_OPTIONS=-Xmx768m`; limit Postgres memory |
| Can't pull from ghcr.io | `docker login ghcr.io` with PAT, or make the packages public |
| 80/443 unreachable | Security group inbound rules; Elastic IP associated |
