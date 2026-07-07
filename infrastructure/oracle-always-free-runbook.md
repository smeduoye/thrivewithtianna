# Oracle Cloud Always Free — MVP runbook

**Related:** [`../docs/MVP_APPLICATION_SPEC.md`](../docs/MVP_APPLICATION_SPEC.md)

Operational checklist for the Thrive portal on a single Oracle A1 VM with Docker Compose and **PostgreSQL in a container**.

---

## 1. Account & VM (one-time)

1. Create [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) account — **home region: UK South (London)** if available.
2. Create **VM.Standard.A1.Flex**: 2 OCPU, 12 GB RAM, Ubuntu 24.04 ARM64.
3. Add SSH public key; note **public IP**.
4. Security list: allow **22** (your IP), **80**, **443**.
5. Install Docker:

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
# log out and back in
```

6. Create app directory:

```bash
mkdir -p ~/thrivewithtianna
```

---

## 2. Server `.env` (one-time, never commit)

Copy from `portal/.env.example` and set at minimum:

- `POSTGRES_PASSWORD`, `JWT_SECRET`
- `FRONTEND_ORIGIN=https://app.thrivewithtianna.com`
- OAuth, Stripe keys
- `API_IMAGE`, `WEB_IMAGE` from ghcr.io

---

## 3. Deploy

Automated via GitHub Actions `deploy.yml` after secrets are set:

| Secret | Example |
|--------|---------|
| `DEPLOY_HOST` | VM public IP |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | private key |
| `DEPLOY_PATH` | `/home/ubuntu/thrivewithtianna` |

Manual:

```bash
cd ~/thrivewithtianna
docker login ghcr.io
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
curl -s http://localhost:8080/actuator/health   # via api container network if needed
```

---

## 4. TLS & DNS

**Cloudflare (recommended):**

1. `app` CNAME or A → VM IP, proxy enabled (orange cloud).
2. SSL mode: Full (strict) if origin has cert, or Full with HTTP origin on port 80.

**Caddy alternative:** see `Caddyfile.example` in this folder.

---

## 5. Backups

Same scripts as AWS: `infrastructure/scripts/pg-backup.sh` and `pg-restore.sh`. The deploy workflow installs a daily **03:00 UTC** cron and keeps **14 days** of dumps in `$DEPLOY_PATH/backups/`.

Manual backup:

```bash
cd ~/thrive
./scripts/pg-backup.sh
```

Restore test (stop API first):

```bash
sudo docker compose -f docker-compose.prod.yml stop api
./scripts/pg-restore.sh backups/thrive-YYYY-MM-DD.sql.gz
sudo docker compose -f docker-compose.prod.yml start api
```

Optionally upload `backups/` to OCI Object Storage with `oci cli`.

Run one restore test before pilot launch.

---

## 6. Monitoring

- External ping: `https://app.thrivewithtianna.com/api/actuator/health` (or `/actuator/health` via proxy rules)
- `docker compose ps` / `docker compose logs api --tail 50`

---

## 7. Troubleshooting

| Issue | Check |
|-------|--------|
| A1 “out of capacity” | Retry later; different AD; smaller shape then resize |
| API OOM | Lower `-Xmx`; limit postgres memory in compose |
| ARM image pull error | CI must build `linux/arm64` — amd64 images fail on A1 |
| Stripe webhooks 4xx | Webhook secret, HTTPS URL, raw body signature |
| DB disk full | `docker system df`; expand volume or prune logs |

---

## 8. Migration off Oracle

1. `pg_dump` from running postgres container.
2. Provision Azure/AWS managed Postgres + container host.
3. Restore dump; update `DATABASE_URL`; deploy same ghcr.io images.
4. Switch DNS for `app.`; keep backup of Oracle volume until verified.
