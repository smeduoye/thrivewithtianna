# Thrive with Tianna — MVP Application Specification

**Status:** Draft for build  
**Last updated:** June 2026  
**Owner:** Thrive with Tianna  
**Hosting assumption:** **Oracle Cloud Always Free** VM + **Docker Compose** + **PostgreSQL in container**

**Related:**

| Document | Role |
|----------|------|
| [`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) | Full product & agent specification (post-MVP phases) |
| [`CLIENT_PORTAL_BUSINESS.md`](./CLIENT_PORTAL_BUSINESS.md) | Operating model, coach playbook |
| [`PLATFORM_SPEC.md`](./PLATFORM_SPEC.md) | Business scope, offerings |
| [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md) | Unresolved business decisions |
| Family CFO (`c:\dev\familycfo`) | Reference implementation for stack, CI/CD, `docker-compose.prod.yml` |

This document defines **what to build for MVP** and **how to run it** on Oracle Always Free. Requirement IDs (e.g. `MEAL-1`) refer to [`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) unless noted here.

---

## 1. MVP intent

Ship a **production-capable pilot** of the client portal at `https://app.thrivewithtianna.com` that lets clients:

1. Self-register, start a **5-day trial**, and subscribe at **£29.99/mo** (Stripe)
2. Log meals, weight, sleep, and optional symptoms
3. See **daily GL**, trends, and streaks on a **mobile-first** UI (desktop ships at same launch)
4. Message Tianna via **portal chat** (human replies only — no AI agent in MVP)
5. Allow Tianna to **onboard, coach, and offboard** clients from an admin UI

**Infrastructure cost target:** **$0/month** compute on Oracle Always Free (you operate backups, TLS, and monitoring).

**Not in MVP:** WhatsApp agent integration, Spring AI, Nutritics API, PWA, native app, workshop bulk automation, email digests (beyond transactional).

---

## 2. Scope summary

### 2.1 In scope (MVP)

| Area | MVP delivery |
|------|----------------|
| **Auth** | Google OAuth, Microsoft Entra (multi-tenant recommended), email magic link; JWT sessions |
| **Onboarding** | Wizard: identity, consent, goals, contact preferences — fields per [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) once Tianna selects mandatory set |
| **Billing** | Stripe: card at signup, 5-day trial, £29.99/mo subscription, webhooks, read-only → lock after grace days |
| **Logging** | Meals + GL, weight, sleep; symptoms **optional** |
| **Food DB** | Thrive-curated PostgreSQL seed + admin seed path; free-text fallback |
| **Dashboard** | Today GL, weight chart, logging streaks, empty-state never blank |
| **Coach admin** | User list, detail, onboard/offboard, edit goals & GL band, portal messaging |
| **Rules** | Java rules service: dashboard alerts only (no LLM, no auto-send) |
| **Marketing link** | `index.html` Client Login → portal URL |
| **Deploy** | `portal/` monorepo, ghcr.io images, GitHub Actions → Oracle VM via SSH |

### 2.2 Out of scope (post-MVP)

| Deferred | Target phase |
|----------|----------------|
| WhatsApp Cloud API, unified threads | Phase 2 |
| Spring AI / “Your Thrive Coach” drafts | Phase 2 |
| Email digests, cohort broadcasts | Phase 2 |
| Nutritics food API | Phase 2+ |
| PWA, push notifications | Phase 4 |
| Native iOS/Android app | Future |
| Menu plan PDF in-app viewer, exercise SKU flows | MVP+1 (can use admin + manual PDF email at pilot) |
| Bulk CSV cohort import | P1 — nice-to-have after first workshop |

### 2.3 Portal tiers at MVP

| Tier | MVP behaviour |
|------|----------------|
| **Full** | Subscription (post-trial), 1:1, workshop — all logging + chat |
| **Lite** | Menu plan SKU — meal log, GL, adherence; minimal symptom/sleep prompts |
| **None** | Lapsed / archived — read-only then lock per `grace_period_days` |

Workshop/1:1 clients may be **admin-invited** without Stripe subscription until P-08 is decided.

---

## 3. Architecture

### 3.1 Runtime topology (Oracle VM)

```text
Internet
   │
   ├─ thrivewithtianna.com          → GitHub Pages (static marketing — unchanged)
   │
   └─ app.thrivewithtianna.com      → Oracle VM public IP
         │
         ├─ Caddy OR Cloudflare proxy (TLS)
         │
         └─ Docker Compose (bridge network: thrive)
               ├─ web      nginx:80   → React SPA (static build)
               ├─ api      Spring Boot:8080
               └─ postgres postgres:16-alpine:5432  (volume: postgres_data)
```

All three application containers run on **one** Ampere A1 VM (**2 OCPU, 12 GB RAM** recommended allocation).

### 3.2 Oracle Always Free assumptions

| Item | Specification |
|------|----------------|
| **Shape** | `VM.Standard.A1.Flex` — **2 OCPU, 12 GB RAM** (full Always Free budget on one instance) |
| **OS** | Ubuntu 24.04 LTS **ARM64** |
| **Home region** | **UK South (London)** preferred for UK GDPR / client data |
| **Storage** | ~47 GB boot volume + Docker volume for Postgres data (within 200 GB Always Free block storage) |
| **Database** | **PostgreSQL 16 in Docker** — not Oracle Autonomous Database |
| **Egress** | Stripe, OAuth, optional email API — within 10 TB/month free egress |

**Capacity note:** A1 instances may show “out of host capacity” in busy regions; retry or try off-peak provisioning.

### 3.3 Container images

| Image | Base | Platform |
|-------|------|----------|
| `ghcr.io/<owner>/thrivewithtianna-api` | Eclipse Temurin 25 JRE **arm64** | `linux/arm64` (required) |
| `ghcr.io/<owner>/thrivewithtianna-web` | nginx alpine **arm64** | `linux/arm64` |
| `postgres:16-alpine` | Official | pulls arm64 on ARM VM |

CI must use **Docker buildx** to publish `linux/arm64` images (or multi-arch). See §8.

### 3.4 Application stack (unchanged from platform spec)

| Layer | Technology |
|-------|------------|
| Backend | Java 25, Spring Boot 3.5+, modular monolith (`com.thrivewithtianna`) |
| ORM / migrations | Hibernate (validate), **Flyway**, PostgreSQL 16 |
| Security | Spring Security, OAuth2 client, JWT |
| Frontend | React 18, TypeScript, Vite, MUI, TanStack Query, Recharts |
| Payments | Stripe Checkout / Customer Portal + webhooks |
| Registry / CI | GitHub Actions → **ghcr.io** |

---

## 4. Repository layout

```text
thrivewithtianna/
├── index.html, styles.css, main.js     # marketing (GitHub Pages)
├── docs/
│   └── MVP_APPLICATION_SPEC.md         # this file
├── infrastructure/
│   ├── docker-compose.prod.yml         # production pull-only compose
│   ├── Caddyfile.example               # optional TLS on VM
│   └── oracle-always-free-runbook.md   # ops checklist
├── portal/
│   ├── backend/                        # Spring Boot
│   ├── frontend/                       # React SPA
│   ├── e2e/                            # Playwright
│   ├── scripts/
│   │   ├── build.ps1 / build.sh
│   │   └── test-stack.ps1 / test-stack.sh
│   ├── docker-compose.yml              # local dev
│   └── .env.example
└── .github/workflows/
    ├── ci.yml
    ├── release.yml
    └── deploy.yml
```

Mirror Family CFO conventions; package root `com.thrivewithtianna`.

---

## 5. Docker Compose (production)

Production file lives at `infrastructure/docker-compose.prod.yml` (pull-only, no local build on server).

### 5.1 Services

| Service | Image | Ports (internal) | Notes |
|---------|-------|------------------|-------|
| `postgres` | `postgres:16-alpine` | 5432 | Healthcheck `pg_isready`; volume `postgres_data` |
| `api` | `ghcr.io/.../thrivewithtianna-api` | 8080 | Depends on healthy postgres; `/actuator/health` |
| `web` | `ghcr.io/.../thrivewithtianna-web` | 80 | Proxies `/api` to `api:8080` or separate API subdomain TBD |

**MVP recommendation:** Single host `app.thrivewithtianna.com` — nginx serves SPA and reverse-proxies `/api/**` to Spring Boot (same pattern as Family CFO `web` container).

### 5.2 Resource limits (optional but recommended)

```yaml
# api deploy.resources.limits.memory: 1536m
# postgres deploy.resources.limits.memory: 1024m
```

Tune JVM: `-Xmx1024m` for api on 12 GB VM.

### 5.3 Required environment variables (`.env` on server — never commit)

| Variable | Purpose |
|----------|---------|
| `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` | Postgres container |
| `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Spring datasource |
| `JWT_SECRET` | Session signing |
| `FRONTEND_ORIGIN` | `https://app.thrivewithtianna.com` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth |
| `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID` | Entra (multi-tenant: `common` or tenants) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Billing |
| `STRIPE_PRICE_MONTHLY_ID`, `STRIPE_PRICE_ANNUAL_ID` | Products (annual when defined) |
| `MAGIC_LINK_SECRET` or reuse JWT | Email login tokens |
| `API_IMAGE`, `WEB_IMAGE` | ghcr.io tags pinned by deploy workflow |

Email (Postmark/SendGrid) for invites/magic links: **required for MVP** if not using OAuth-only.

---

## 6. Networking, DNS, TLS

### 6.1 Oracle Cloud networking (once)

1. **VCN** with public subnet + Internet Gateway  
2. **Security list / NSG** ingress: `22` (SSH, restrict to admin IP), `80`, `443`  
3. **Reserved public IPv4** on the VM (note IP for DNS)

### 6.2 DNS

| Record | Target |
|--------|--------|
| `app.thrivewithtianna.com` | VM public IP (or Cloudflare proxy) |
| `thrivewithtianna.com` | GitHub Pages (existing) |

### 6.3 TLS options

| Option | Pros |
|--------|------|
| **Cloudflare proxy** (recommended) | Free TLS, DDoS, no cert management on VM |
| **Caddy on VM** | Let's Encrypt automatic; see `infrastructure/Caddyfile.example` |

Stripe webhooks and OAuth redirect URIs must use **HTTPS** production URLs.

### 6.4 Stripe webhook

`POST https://app.thrivewithtianna.com/api/webhooks/stripe` — must be reachable from Stripe (no cold start; VM always on).

---

## 7. Backend modules (MVP)

| Module | Responsibility |
|--------|----------------|
| `auth` | OAuth, magic link, JWT, roles |
| `users` | Profile, onboarding, statuses (`trialing`, `active`, `past_due`, `suspended`, `archived`) |
| `billing` | Stripe customer, subscription, entitlements, grace period |
| `meals` | Meal logs, food search, GL calculation |
| `metrics` | Weight, sleep, symptoms |
| `dashboard` | Aggregates for client home |
| `coach` | Admin APIs, client roster, messaging |
| `rules` | Threshold alerts (in-app only) |
| `audit` | Admin action log |

**Flyway:** all DDL in `src/main/resources/db/migration/V*.sql` — never Hibernate `ddl-auto=update`.

### 7.1 Core API surface (indicative)

| Method | Path | Role |
|--------|------|------|
| `GET` | `/actuator/health` | Public (liveness) |
| `POST` | `/api/auth/magic-link` | Public |
| `GET` | `/api/auth/oauth2/*` | Public |
| `GET` | `/api/me` | Client |
| `POST` | `/api/onboarding` | Client |
| `CRUD` | `/api/meals`, `/api/weight`, `/api/sleep`, `/api/symptoms` | Client |
| `GET` | `/api/dashboard` | Client |
| `GET/POST` | `/api/conversations` | Client + Coach |
| `GET/POST/PATCH` | `/api/admin/users` | Coach, Admin |
| `POST` | `/api/webhooks/stripe` | Stripe signature |

OpenAPI document generated at `/v3/api-docs` for frontend client generation.

---

## 8. CI/CD pipeline

Copy pattern from Family CFO `.github/workflows/`.

### 8.1 Workflows

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | PR, non-main push | `mvn verify`, `npm ci && npm test && npm run build`, Docker build **arm64** |
| `release.yml` | Push to `main`, tag `v*` | Tests + **push** images to ghcr.io (`latest`, SHA, semver) |
| `deploy.yml` | After release or manual | SSH to Oracle VM, copy `docker-compose.prod.yml`, `pull`, `up -d` |

### 8.2 ARM64 build (required)

```yaml
# release.yml excerpt — buildx for Oracle A1
platforms: linux/arm64
```

GitHub-hosted runners are `amd64`; use `docker/build-push-action` with QEMU binfmt or build on `ubuntu-arm` runner if available.

### 8.3 GitHub repository secrets (deploy)

| Secret | Purpose |
|--------|---------|
| `DEPLOY_HOST` | Oracle VM public IP |
| `DEPLOY_USER` | e.g. `ubuntu` |
| `DEPLOY_SSH_KEY` | Private key |
| `DEPLOY_PATH` | e.g. `/home/ubuntu/thrivewithtianna` |
| `GHCR_TOKEN` | Pull private images on server (or deploy uses SSH key + login step) |

Until `DEPLOY_HOST` is set, deploy workflow **skips** safely.

---

## 9. Frontend (MVP screens)

**Design:** **Mobile-first** portal; desktop layouts at same launch ([`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) §10.1).

| # | Screen | MVP |
|---|--------|-----|
| 1 | Login (OAuth + email) | ✓ |
| 2 | Onboarding wizard | ✓ |
| 3 | Home dashboard | ✓ |
| 4 | Log (meals / weight / sleep / symptoms) | ✓ |
| 5 | Progress (charts, streaks) | ✓ |
| 6 | Coach chat (async) | ✓ |
| 7 | Settings (preferences, export request) | ✓ |
| 8 | Stripe checkout / billing portal redirect | ✓ |
| **Admin** | User list, user detail, send message | ✓ |
| **Admin** | Review queue, agent drafts | ✗ (Phase 2) |

**E2E:** Playwright with **mobile viewport** (iPhone 14 profile) for login, onboarding, meal log.

---

## 10. Data & backups

### 10.1 PostgreSQL in Docker

- Data path: named volume `postgres_data` on VM boot disk  
- **No managed RDS** — you own backup/restore

### 10.2 Backup MVP standard

| Task | Schedule | Method |
|------|----------|--------|
| **Logical backup** | Daily 03:00 UTC | `pg_dump` → gzip → OCI Object Storage (Always Free 10 GB) or external |
| **Retention** | 14 daily, 4 weekly | Lifecycle policy or manual rotation |
| **Restore test** | Before pilot go-live | Restore to local `docker compose` and verify |

Document restore steps in `infrastructure/oracle-always-free-runbook.md`.

### 10.3 Monitoring

| Check | Tool |
|-------|------|
| API up | UptimeRobot or OCI Monitoring → `GET /actuator/health` |
| Disk | Alert > 80% on boot volume |
| Docker | `restart: unless-stopped` on all services |

---

## 11. Security & compliance (MVP bar)

| Item | MVP requirement |
|------|-----------------|
| HTTPS | Required on `app.` |
| Secrets | `.env` on server only; GitHub Secrets in CI |
| Health data | Consent at onboarding; disclaimer in app |
| GDPR | Export/delete request path (admin-triggered minimum) |
| Logging | No health payloads in application logs |
| SSH | Key-only; disable password auth |
| Stripe | PCI via Stripe hosted checkout — no card data on VM |
| DPIA | Required before marketing to cold audience at scale — start draft during pilot |
| Oracle DPA | Accept OCI data processing terms (London region) |

---

## 12. Implementation milestones

### M0 — Scaffold (week 1–2)

- [ ] `portal/` directory; local `docker compose up` (postgres + api + web)
- [ ] Flyway `V1` users/auth schema; Actuator health
- [ ] React shell + Thrive MUI theme; calls `/actuator/health`
- [ ] CI workflow green

**Exit:** Developer laptop runs full stack.

### M1 — Identity & onboarding (week 3–4)

- [ ] Google + Microsoft OAuth + magic link
- [ ] Onboarding wizard + consent
- [ ] Admin: create user, invite, list users

**Exit:** Test user completes onboarding end-to-end.

### M2 — Logging & GL (week 5–7)

- [ ] Curated food seed (≥ 200 Thrive foods)
- [ ] Meal log + daily GL
- [ ] Weight + sleep; optional symptoms
- [ ] Client dashboard (never empty)

**Exit:** Meal log ≤ 2 min on mobile; GL visible same day.

### M3 — Billing (week 7–8)

- [ ] Stripe trial + £29.99/mo subscription
- [ ] Webhooks → status + entitlements
- [ ] Read-only + grace lock job

**Exit:** Test mode subscription lifecycle works.

### M4 — Coach & messaging (week 9–10)

- [ ] Coach roster + client detail
- [ ] Portal async messaging (human only)
- [ ] Rules: dashboard alerts (no outbound auto)

**Exit:** Tianna reviews client logs and replies in portal.

### M5 — Oracle production (week 10–11)

- [ ] Oracle A1 VM provisioned (London)
- [ ] ARM64 images in ghcr.io
- [ ] Deploy workflow; `app.` DNS + TLS
- [ ] Daily `pg_dump` backup cron
- [ ] Marketing site login → portal URL

**Exit:** Pilot client on production URL.

### M6 — Pilot hardening (week 12)

- [ ] Playwright mobile E2E in CI
- [ ] Privacy policy + health disclaimer live
- [ ] 5–10 pilot clients onboarded
- [ ] Tianna session prep using admin UI

**Exit:** MVP launch criteria met (§13).

---

## 13. MVP launch criteria

| # | Criterion |
|---|-----------|
| 1 | `https://app.thrivewithtianna.com` serves SPA over HTTPS |
| 2 | Self-serve signup → trial → subscribe (Stripe test → live) |
| 3 | OAuth login works on mobile Safari and Chrome Android |
| 4 | Meal + weight log persists; GL computes for curated foods |
| 5 | Coach can onboard, view logs, and message client |
| 6 | Lapsed subscription → read-only → lock after grace days |
| 7 | Daily DB backup running; one restore tested |
| 8 | No P0 security issues (secrets not in repo, SSH hardened) |
| 9 | 5 pilot clients actively logging |

---

## 14. Post-MVP migration path

Oracle Always Free is the **MVP host**, not the long-term enterprise ceiling.

| Trigger | Action |
|---------|--------|
| > 100 active subscribers | Plan migration to managed Postgres (Azure UK / AWS London) |
| DPIA / insurer requires SLA | Move API to Container Apps / Fargate |
| A1 capacity or account risk | Export `pg_dump` → restore on Hetzner/Azure |

Application remains **container-portable** — same ghcr.io images and compose pattern.

---

## 15. Open items affecting MVP build

From [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md):

| ID | Impact |
|----|--------|
| U-16 | Onboarding mandatory fields |
| P-08 | Coaching clients: Stripe subscription required? |
| P-02b | Annual Stripe price ID |
| T-29 | Entra multi-tenant registration |

**Defaults if unset at build time:** Entra multi-tenant; onboarding uses spec “suggested” mandatory set; coaching clients admin-invited with `active` entitlement without separate subscription until P-08 decided.

---

## 16. Document history

| Version | Date | Change |
|---------|------|--------|
| 0.1 | June 2026 | Initial MVP spec — Oracle Always Free + Docker + PostgreSQL pathway |
