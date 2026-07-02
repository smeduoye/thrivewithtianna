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

| Record | Target |
|--------|--------|
| `app.thrivewithtianna.com` | EC2 Elastic IP |

- **Cloudflare proxy** (recommended): free TLS, no cert on the box. SSL mode Full.
- **Caddy alternative:** see [`Caddyfile.example`](./Caddyfile.example) for automatic Let's Encrypt.

OAuth redirect URIs and Stripe webhooks must use the **HTTPS** production URL.

## 7. Backups

Daily `pg_dump` cron (`crontab -e`):

```bash
0 3 * * * docker exec thrivewithtianna-postgres pg_dump -U thrive thrive | gzip > /home/ec2-user/backups/thrive-$(date +\%F).sql.gz
```

Create `~/backups`, rotate after 14 days, optionally sync to S3. Test one restore before pilot.

## 8. Troubleshooting

| Issue | Check |
|-------|-------|
| `exec format error` on container start | Image arch vs instance arch — images must include `linux/amd64` (they now do) |
| API OOM / restart loop | Instance RAM; lower `JAVA_TOOL_OPTIONS=-Xmx768m`; limit Postgres memory |
| Can't pull from ghcr.io | `docker login ghcr.io` with PAT, or make the packages public |
| 80/443 unreachable | Security group inbound rules; Elastic IP associated |
