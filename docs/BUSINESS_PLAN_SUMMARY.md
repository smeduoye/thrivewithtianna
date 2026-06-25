# Thrive with Tianna — Business Plan Summary

**Status:** Draft for review with Tianna  
**Last updated:** June 2026  
**Audience:** Founders and stakeholders — plain language, not a build spec  

**Related (detail):** [`business-plan.html`](../business-plan.html) (web review) · [`PLATFORM_SPEC.md`](./PLATFORM_SPEC.md) · [`CLIENT_PORTAL_BUSINESS.md`](./CLIENT_PORTAL_BUSINESS.md) · [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) · [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md)

---

## 1. Executive summary

**Thrive with Tianna** is a UK-first coaching business built around **low glycemic load (low-GL) nutrition** for adults who want sustainable weight loss — not fad diets, not a slimming club, and not a medical clinic.

The business combines what Tianna already does well — structured meal guidance, WhatsApp community, and personal coaching — with a **client portal** at `https://app.thrivewithtianna.com` where clients log meals, see glycemic load and progress, and receive personalised support from **“Your Thrive Coach”** (an AI assistant governed by Thrive’s rules and Tianna’s oversight).

**Revenue model:**

| Layer | What it is | Status |
|-------|------------|--------|
| **Subscription** | Self-serve signup, 5-day trial, then **£29.99/mo** (annual option TBC) | Price decided |
| **Workshop / group** | 30-day cohort + WhatsApp peer group + full portal | **Price TBC** |
| **1:1 coaching** | Private relationship with Tianna + full portal | **Price TBC** |
| **Menu plans** | 1–2 week low-GL plans — **Lite portal** | Product decided |
| **Exercise plans** | Separate SKU — portal **included** | Product decided |

**Core audience:** Adults **30s–50s, men and women**, UK-first. Marketing mix target: ~60–65% women / ~25–35% men / ~10% shared or couples.

**Primary competitor to watch:** [Health360](https://www.healthyandelegant.com/health360-nutritional-coach) (~£38/mo, low-GL + AI coach). Thrive wins on **founder trust, method specificity, dual-gender fit, and a clear path to real Tianna** — not on being the cheapest app.

**What we are not building:** food ordering, cooking fulfilment, children’s programmes, GLP-1/medicated weight loss, or competing with NHS free programmes on price.

---

## 2. Mission and position

### Mission

Help adults lose weight sustainably through **low-GL nutrition**, personalised coaching, and community accountability — with measurable progress on a digital dashboard.

### Position statement (draft — pending Tianna sign-off)

> **Thrive with Tianna** helps busy men and women in their 30s–50s lose weight sustainably through **low glycemic load nutrition** — with a personal dashboard, an AI coach trained on your logs and Tianna’s method, and a clear path to live coaching when you want deeper support. Not a fad diet app. Not a clinic. **Structured, science-based, and human.**

### Positioning pillars

1. **The low-GL method** — own glycemic load and metabolic sustainability, not generic calorie counting or Noom-style psychology.
2. **Founder-led, agent-assisted** — Tianna’s brand and oversight; not anonymous AI (Health360) or rotating dietitians (Second Nature).
3. **Built for busy adults 30s–50s — women and men** — men are underserved in the category; avoid “diet club” imagery.
4. **Try it properly** — 5-day trial with card on file, then subscribe; serious enough to commit, short enough to convert.
5. **Human community + private coach channel** — WhatsApp peer cohort (workshop) + private 1:1 agent/WhatsApp; personal health never in group channels.
6. **Escalation to real Tianna** — subscription = portal + agent; workshop and 1:1 = premium human tiers.

---

## 3. Target market

| Dimension | Thrive target | Why it matters |
|-----------|---------------|----------------|
| **Age** | Core **30s–50s** | Peak UK weight-management engagement is 40–69; 30s need strong trial hook |
| **Gender** | **Men and women** explicit | Category is ~75–90% female; men 35–50 are under-served |
| **Geography** | UK-first, English at launch | i18n planned for future localisation |
| **Mindset** | Structure, accountability, evidence | Not fad diets, not NHS-free-only seekers |
| **Not targeting** | Children, GLP-1 primary buyers, CGM/biohacker buyers | Out of scope or wrong buyer |

### Competitive landscape (simplified)

```text
                    HIGH TOUCH (human coach)
                              │
         Premium 1:1          │    Thrive workshop / 1:1
         (£75+/session)      │    (Tianna-led)
                              │
    ──────────────────────────┼────────────────────────── HIGH PRICE
                              │
         Second Nature        │    Health360 (~£38)
         (£33–40/mo)          │    ← closest product shape
                              │
         Noom (£12–45/mo)     │
                              │
                    LOW TOUCH (app / content)
```

**Thrive subscription** sits in the **middle**: more personal than Noom, less clinical than Second Nature, less premium than live 1:1 — with a **clear upgrade path** to Tianna.

### Fights to avoid

- Race to £10/mo app-only (Noom annual)
- Out-clinicing Second Nature (NHS scale, daily RDs)
- GLP-1 / medicated weight loss
- CGM-first product (Vively £129/mo)
- Competing with NHS free on features
- Generic “AI coach” without Tianna governance

---

## 4. Service offerings

### Launch catalogue

| Offering | Client gets | Portal tier | WhatsApp peer group |
|----------|-------------|-------------|---------------------|
| **Subscription** (post-trial) | Dashboard, agent, logging, insights | **Full** | No (workshop only) |
| **30-day workshop / group** | Cohort curriculum, themes, community | **Full** | **Yes** (tiered by programme) |
| **1:1 coaching** | Sessions with Tianna + between-session support | **Full** | Optional |
| **Menu plans** (1–2 week) | Assigned plan, adherence, GL visibility | **Lite** | No |
| **Exercise plans** | Plan + portal access (separate SKU) | **Included** | No |

### Client personas (simplified)

| Persona | Programme | Needs |
|---------|-----------|-------|
| **A — Structured starter** | 30-day workshop | Daily rhythm, streaks, peer accountability |
| **B — Private coachee** | 1:1 | Deep personalisation, symptom context, session continuity |
| **C — Menu plan client** | Menu plan only | Plan adherence, minimal extra tracking |

### Explicit exclusions (firm)

- Food ordering, meal delivery, hampers, commerce
- Cooking classes or kitchen fulfilment (by Tianna or anyone else)
- Children / family programmes
- Exercise as primary brand lead (may appear in plans, not Instagram focus)

---

## 5. Pricing and monetisation

### Decided

| Item | Decision |
|------|----------|
| Monthly subscription | **£29.99/mo** |
| Annual billing | **Yes** — discount **% TBC** (propose 20–30% off, e.g. ~£299/yr) |
| Trial | **5 days** free; credit card at signup (Stripe) |
| After trial | Must subscribe to continue advice and full portal |
| Non-payment / lapse | **Read-only** access first, then lock after **5-day grace** (admin-configurable) |
| Workshop / group price | **TBC** |
| 1:1 coaching price | **TBC** |
| Portal in workshop & 1:1 | **Included** — no double charge |
| Menu plan | **Lite portal** |
| Exercise plan | Separate SKU; **portal included** |

### Self-serve signup flow

1. Self-register (Google, Microsoft, or email)
2. Onboarding — identity, goals, consent (mandatory fields: see [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) — **Tianna to select**)
3. Enter card — no charge during trial
4. 5-day trial — full portal + agent/coaching support
5. Subscribe or lapse → read-only → lock after grace period

Admin invite flow remains for manually onboarded workshop clients.

### Open pricing questions (for Tianna session)

| # | Question |
|---|----------|
| P-03 | Workshop, group, and 1:1 **prices** |
| P-02b | **Annual discount %** |
| P-08 | Active coaching clients: also pay £29.99 subscription, or portal bundled in coaching SKU only? |

---

## 6. Client experience (what “good” looks like)

### First 24 hours

- Welcome email + WhatsApp group invite (if workshop)
- Account activation (OAuth or magic link)
- Onboarding 10–15 min — never a blank dashboard
- First win: log one meal or weight; see first GL snapshot
- Welcome message from Tianna (Phase 1) or approved template (Phase 2+)

**Target:** time-to-first-log **< 24 hours**.

### Typical day (~3–5 minutes)

- Optional morning: weight, sleep, energy
- After meals: log items + portions → see meal GL + daily total (~2 min per meal)
- Evening: optional symptom check-in (Full tier)
- Proactive nudge on preferred channel if rules trigger

**Active client bar (Full tier):** log meals **≥ 4 days/week**.

### Weekly cadence (system)

| Day | Behaviour |
|-----|-----------|
| Monday | Weekly focus / cohort theme |
| Tue–Thu | Nudges only if logging gap or GL drift |
| Friday | “Week so far” mini-summary |
| Sunday | Weekly digest — GL, weight, sleep, 1–2 actions |

### Channels

| Channel | Role |
|---------|------|
| **Portal** | Dashboard, history, logging, optional chat |
| **WhatsApp 1:1** | Private coach/agent (default when opted in) |
| **WhatsApp group** | Peer community — **workshop programmes only** |
| **Email** | Digests, reminders, parallel individual messages for workshop broadcasts |
| **Zoom** | Live 1:1 and group sessions |

**Rules:** Personal health data **never** sent to group addresses. Quiet hours respected.

---

## 7. Coach operating model (Tianna)

### Daily rhythm (~15 minutes target)

1. Open **priority queue** — P0 first
2. Respond to P0/P1 clients
3. Scan new logs for active roster
4. Approve agent drafts (Phase 2+)
5. Note clients for upcoming sessions

### Priority queue

| Priority | Trigger | Human required? |
|----------|---------|-----------------|
| **P0** | Red-flag symptom or crisis language | **Always** — same day |
| **P1** | No log 3+ days | Nudge; Tianna if no response 48h |
| **P2** | GL above target 3 days | Coaching message + swaps |
| **P3** | Milestone (streak, day 30) | Celebration + next step |

### Agent rollout

| Phase | Coaching messages |
|-------|-------------------|
| **Phase 1** | 100% human (Tianna) |
| **Phase 2** | Agent drafts; **all approved first 90 days** |
| **Phase 3** | Auto-send low-risk rules only; P0 always human |

**Agent name:** “Your Thrive Coach” — warm, specific, never medical; cites client’s own logs.

### Session prep (5-minute scan)

Weight trend, GL vs target band, adherence %, sleep, symptoms, chat highlights, suggested talking points — so Tianna spends less time reconstructing “what did you eat this week?”

---

## 8. Technology overview (non-technical)

| Area | Approach |
|------|----------|
| **Stack** | Java 25, Spring Boot, React/TS, PostgreSQL — aligned with Family CFO patterns |
| **Portal URL** | `https://app.thrivewithtianna.com` |
| **Auth** | Google, Microsoft (Entra — **multi-tenant recommended**), email magic link |
| **Payments** | Stripe — trial, subscription, annual |
| **WhatsApp** | Thrive-owned Business number; phone verify via **WhatsApp handshake**; groups tiered by programme |
| **Food database** | Full Thrive-curated DB at launch; future optional [Nutritics Food Data API](https://www.nutritics.com/en/product/food-data-api/) enrichment |
| **AI** | Rules engine first; then Spring AI agent — **both OpenAI and Anthropic supported**; default provider TBC |
| **Live sessions** | Zoom (external link) |
| **Localisation** | Plan for i18n; UK English at launch |

**Current state:** Marketing site POC live (`index.html`). Portal not yet built — specs complete.

---

## 9. Go-to-market

### Instagram (primary awareness)

- Nutrition advice, low-GL meal ideas, transformation stories
- Drive → free consultation → paid coaching / trial signup
- Exercise not required as main feed content

### Website role

- Philosophy and low-GL approach
- Service catalogue with CTAs (consultation, workshop, trial)
- Client hub preview (credibility)
- Lead capture — **no** food shop or cooking classes

### Messaging tracks (same product, different entry points)

| Track | Audience | Hook |
|-------|----------|------|
| **A — Women 30s–50s** | Primary volume | Sustainable weight loss, energy, digestion, control without deprivation |
| **B — Men 35–50** | Differentiated | Metabolic health, fat loss, blood sugar, structure — not “slimming club” |
| **C — Shared** | Both | Low-GL explained, trial path, portal + coach, coaching not medical |

Sample headlines in [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) §6.6.

### Brand guardrails

**Should feel like:** Thrive marketing site — calm, science-based, premium coaching.  
**Avoid resembling:** Slimming World, Noom upsell aesthetic, clinical NHS app, biohacker CGM dashboard, generic femtech AI clone.

---

## 10. Compliance and trust

| Item | Status |
|------|--------|
| Coaching not medical treatment | Stated at onboarding |
| GDPR / health data consent | Required at onboarding |
| WhatsApp opt-in separate from GDPR | Required |
| DPIA before scale health processing | **Required** |
| Data retention policy | **Legal review required** before launch |
| WhatsApp Business compliance | **Approved** path (verification, templates, opt-in) |
| Red-flag symptoms | No automation; human P0 same day |
| Audit trail | Admin actions and agent sends logged |

---

## 11. Roadmap (high level)

### Phase A — Marketing site ✅ (POC done)

Align copy, services, community mention, client hub preview.

### Phase B — Booking & payments (weeks 3–6)

Stripe, workshop intake, pricing pages, privacy policy.

### Phase C — Client portal MVP (weeks 6–12)

Auth, meal log, GL calculation, weight/adherence charts, coach admin view.

### Phase D — Cohort & intelligence (months 3–6)

Workshop enrolment, weekly digest, rules engine, agent Phase 1 (human-only outbound).

### Phase E — Agent scale (months 6+)

Draft → approve queue, WhatsApp integration, Nutritics evaluation if needed.

---

## 12. Success metrics (90-day pilot targets)

| Metric | Target (indicative) |
|--------|---------------------|
| Signups aged 30–59 | ≥ 70% of cohort |
| Male signups | ≥ 25% (vs ~15–20% category norm) |
| Time-to-first-log | < 24 hours |
| Weekly active loggers | ≥ 70% log ≥ 4 days/week |
| Trial → subscribe conversion | Track; benchmark after first 100 trials |
| Workshop completion / renewal | Track from cohort 1 |
| Message helpfulness (Phase 2+) | ≥ 4/5 |

---

## 13. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Logging feels like homework | ≤2 min per meal; favourites; copy yesterday |
| Bot feels generic | Cite client data; Tianna approval phase; validated KB |
| WhatsApp spam | Quiet hours, opt-in, channel preference |
| Portal vs group confusion | Onboarding copy + in-app reminder |
| Tianna overwhelmed by review queue | Phase 1 human-only; small pilot cohort |
| Under-40 low enrollment | Strong 5-day trial — first GL insight within 48h |
| Competing on price with Health360 | Compete on trust, method, founder, dual-gender fit |

---

## 14. Open decisions — review checklist for Tianna

Use this list in your review meeting. Full log: [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md).

| # | Topic | Action needed |
|---|-------|---------------|
| **B-17** | Position statement (§2 above) | Approve or edit |
| **P-03** | Workshop, group, 1:1 prices | Set prices |
| **P-02b** | Annual discount % | Confirm (e.g. 20–30%) |
| **P-08** | Coaching clients + subscription overlap | Bundle or separate? |
| **U-16** | Mandatory onboarding fields | Mark M/O in [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) |
| **U-21** | Auto-send rules always human-reviewed | List rule IDs |
| **T-29** | Microsoft Entra single vs multi-tenant | Confirm multi-tenant for clients |
| **T-30b** | Default LLM when both configured | Choose default |
| **B-17** | Position statement sign-off | Explicit approval |

---

## 15. Document map

| If you need… | Read… |
|--------------|-------|
| Full business scope & exclusions | [`PLATFORM_SPEC.md`](./PLATFORM_SPEC.md) |
| Day-to-day operating model & coach playbook | [`CLIENT_PORTAL_BUSINESS.md`](./CLIENT_PORTAL_BUSINESS.md) |
| Competitors, demographics, messaging | [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) |
| Build requirements & architecture | [`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) |
| Onboarding field selection | [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) |
| Decisions checklist | [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md) |

---

*This summary is the stakeholder-facing narrative. Update it when pricing, positioning, or programme rules change.*
