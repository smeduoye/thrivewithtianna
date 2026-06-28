# Thrive with Tianna — Decisions Log

**Status:** Active  
**Last updated:** June 2026  

Consolidated **resolved** and **remaining open** decisions. Detail lives in linked specs; this file is the checklist.

**Related:** [`CLIENT_PORTAL_BUSINESS.md`](./CLIENT_PORTAL_BUSINESS.md) · [`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) · [`PLATFORM_SPEC.md`](./PLATFORM_SPEC.md) · [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md)

---

## Resolved decisions (June 2026)

### Pricing & packaging

| ID | Decision |
|----|----------|
| P-01 | Subscription **£29.99/mo** |
| P-02 | Billing: **monthly + annual** (annual at discount — exact % TBC, propose 20–30% off) |
| P-05 | **Menu plan** → **Lite portal** |
| P-06 | **Exercise plan** → includes **portal access** (separate SKU; portal bundled) |
| P-07 | Workshop/cohort fees **include portal** — no double charge (**agreed**) |
| P-09 | After trial/non-payment: **read-only period** (not immediate hard delete of access to history) |
| P-10 | **5 days grace** after trial/subscription lapse before lock; **admin-configurable** (`grace_period_days`) |

### Business & positioning

| ID | Decision |
|----|----------|
| B-12 | Market positioning **confirmed** — low-GL, founder-led, agent-assisted |
| B-13 | Marketing mix **confirmed** — ~60–65% women / ~25–35% men / ~10% shared |
| B-14 | Agent persona **confirmed** — **“Your Thrive Coach”** |
| B-17 | Position statement — see [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) §6.3 (pending explicit sign-off after review) |

### Product & UX

| ID | Decision |
|----|----------|
| U-15 | Active client logging bar: **≥4 days/week** meal log (Full tier) |
| U-17 | Daily **symptom log optional** |
| U-18 | Daily **GL target set per client by coach** (not global fixed band) |
| U-19 | Default agent nudge channel: **WhatsApp** (when opted in) |
| U-20 | WhatsApp **peer cohort** on subscription: **workshop only** (not subscription tier) |
| U-22 | Agent draft approval: **all drafts approved first 90 days** of Phase 2 |
| U-23 | Workshop broadcasts: **parallel individual WhatsApp** (not group email for personal content) |

### WhatsApp & messaging

| ID | Decision |
|----|----------|
| W-24 | **Thrive-owned** WhatsApp Business number |
| W-25 | WhatsApp groups **tiered by programme** |
| W-26 | Phone verification: **WhatsApp handshake** (not SMS OTP primary) |

### Technical & infrastructure

| ID | Decision |
|----|----------|
| T-27 | Portal URL: **`https://app.thrivewithtianna.com`** (standard SaaS subdomain) |
| T-28 | Food DB: **full database curated by Thrive**; future optional **[Nutritics Food Data API](https://www.nutritics.com/en/product/food-data-api/)** enrichment |
| T-30 | LLM: **support both OpenAI and Anthropic**; provider choice deferred |
| T-31 | **Plan for localisation** (i18n-ready copy and architecture; UK English at launch) |
| T-32 | Live sessions: **Zoom** (external link) |
| T-36 | **Portal: mobile-first** (desktop at launch); **marketing site: desktop-first** then mobile; native app deferred; PWA optional Phase 4 |
| T-37 | **MVP hosting:** Oracle Always Free A1 VM + Docker Compose + PostgreSQL container — see [`MVP_APPLICATION_SPEC.md`](./MVP_APPLICATION_SPEC.md) |

### Compliance

| ID | Decision |
|----|----------|
| C-33 | **DPIA required** before scale processing of health data |
| C-34 | **Data retention policy** — legal review **required** before launch |
| C-35 | WhatsApp Business compliance path **approved** (verification, templates, opt-in) |

---

## Remaining open (TBC)

| ID | Question | Owner |
|----|----------|-------|
| P-03 | Workshop, group, 1:1 **prices** | Tianna / business |
| P-04 | Full **portal inclusion matrix** (confirm 1:1 + workshop rows) | Business |
| P-08 | Coaching SKUs: subscription required separately or portal bundled only? | Business |
| P-02b | **Annual discount %** (e.g. £299/yr vs £359.88 monthly) | Business |
| U-16 | Which **onboarding metrics** are mandatory — see [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) | Tianna |
| U-21 | Phase 2 **auto-send rule IDs** always human-reviewed | Tianna |
| T-29 | Microsoft Entra: **single- vs multi-tenant** — see explanation in `CLIENT_PORTAL_SPEC.md` §6.2 notes |
| T-30b | Default LLM provider when both configured | Admin |
| B-17 | Position statement **explicit approval** after review | Tianna |

---

## Document history

| Version | Date | Change |
|---------|------|--------|
| 0.1 | June 2026 | Consolidated log from stakeholder decisions session |
