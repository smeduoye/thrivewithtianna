# Thrive with Tianna — Business & Platform Specification

**Status:** Active product direction (updated from planning session)  
**Last updated:** June 2026  
**Owner:** Thrive with Tianna

---

## 1. Vision & Strategic Decisions

### 1.1 Mission

Help adults lose weight sustainably through **low glycemic load (low-GL) nutrition**, personalised coaching, and community accountability — with measurable progress they can see on a digital dashboard.

### 1.2 Core positioning

| Decision | Detail |
|----------|--------|
| **Primary focus** | Weight-loss coaching via low-GI / low-GL foods |
| **Delivery model** | Services only — coaching, plans, workshops, community |
| **Evidence-based** | Show clients what to eat and why; use their own data as proof of progress |
| **Go-to-market** | Launch coaching services first; get to market quickly and meaningfully |

### 1.3 Explicit exclusions (out of scope)

These are **firm decisions** from the planning session. They must not appear in the launch site, offerings, or platform roadmap.

| Excluded | Rationale |
|----------|-----------|
| **Food ordering / commerce** | No meal delivery, hampers, bakes, or product checkout on this platform |
| **Cooking — by Tianna or anyone else** | No cooking classes, kitchen sessions, meal prep fulfilment, or outsourced cooking |
| **Children / family programmes** | Adults only |
| **Exercise as primary Instagram content** | Nutrition advice is the main social content; exercise may appear in plans but is not the brand lead |

### 1.4 Split: coaching site vs. food (back burner)

The **food opportunity** is parked separately from this project:

- This site and platform = **coaching services only**
- A future, separate concept may explore **recipes and meal ideas** (content/education) — still **without** Tianna or partners cooking or fulfilling orders
- Do not block launch waiting on the food concept

### 1.5 Existing assets to leverage

- PDF meal plans and programme materials from prior work — use to drive group sessions and 1:1 coaching
- Instagram content: low-GI meal inspiration and nutrition advice (marketing, not fulfilment)

---

## 2. Target Audience

| Attribute | Detail |
|-----------|--------|
| **Who** | Adults (18+); **core segment 30s–50s, men and women** |
| **Goal** | Sustainable weight loss, energy, digestion, and wellbeing via low-GL nutrition |
| **Approach fit** | Structure, accountability, evidence-informed low-GL guidance — not fad diets or slimming-club culture |
| **Geography** | UK-first (English at launch) |
| **Not targeting** | Children, families-as-a-unit programmes, GLP-1/medicated weight-loss primary buyers, NHS-free-only seekers |

**Demographics & positioning detail:** [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) §5–§6 · **Messaging tracks:** same doc §6.6 · **Operating model:** [`CLIENT_PORTAL_BUSINESS.md`](./CLIENT_PORTAL_BUSINESS.md) §2

---

## 3. Service Offerings

### 3.1 Launch offerings (MVP — get to market)

These are the **first services to sell and build the website around**.

| Offering | Description | Includes |
|----------|-------------|----------|
| **1:1 Coaching** | Private sessions with Tianna | Personalised action plan, progress reviews, messaging between sessions, flexible booking |
| **Group Coaching** | Shared sessions with peer support | Group calls/workshops, shared milestones, lower price point than 1:1 |
| **30-Day Workshop / Cohort** | Fixed-length group programme | Sign-up intake, structured curriculum (e.g. 30 days), WhatsApp community, weekly themes from existing meal-plan PDFs |
| **Menu Plans** | 1-week and 2-week low-GL meal plans | What to eat and portion guidance — **client cooks for themselves**; no food supplied |
| **Exercise Plans** | **Separate SKU** — sold independently, not bundled by default | Plans and guidance when relevant; not the primary brand hook |

**Pricing:** Subscription **£29.99/mo** (annual TBC). Workshop, group, 1:1 **TBC** — see [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md).

### 3.1b Portal access & programme matrix

| Offering | Portal access | Notes |
|----------|---------------|-------|
| **Subscription** (post-trial, £29.99/mo) | **Full** | No WhatsApp peer cohort (workshop only) |
| **1:1 Coaching** | **Full** | Included; **price TBC** |
| **30-Day Workshop / Group** | **Full** | Included; WhatsApp tiered by programme; **price TBC** |
| **Menu Plans** | **Lite** | Reduced logging/agent |
| **Exercise Plans** | **Included** | Separate SKU; portal bundled |

### 3.1c Self-serve signup & trial (decided)

| Element | Decision |
|---------|----------|
| **Registration** | **Self-registration** — public signup, no invite required |
| **Trial** | **5 days** of portal access and coaching/agent support |
| **Payment capture** | Credit card collected at signup (Stripe) |
| **After trial** | User must **subscribe** to continue advice and full portal access |
| **Non-payment** | Access downgrades or ends; data retained per privacy policy |

Admin invite flow remains for clients Tianna onboards manually (e.g. pre-Stripe workshop intake).

### 3.2 Community layer (launch-critical)

| Channel | Role |
|---------|------|
| **WhatsApp groups** | Every paying client joins a cohort/community group — encouragement, tips, daily check-ins, Q&A |
| **Platform dashboard** | Structured logging, insights, and progress (see §5) — complements WhatsApp, does not replace human community |

WhatsApp is the **primary community tool at launch**; in-platform messaging is a later enhancement.

### 3.3 Additional offerings (post-launch / growth)

Introduce after core coaching is live and validated.

| Offering | When | Notes |
|----------|------|-------|
| **Subscription packages** | Phase 1–2 | Monthly coaching + plan bundles (e.g. 3-month weight-loss programme) |
| **Detox / reset programmes** | Phase 2 | Short structured programmes using existing detox content |
| **Self-serve digital products** | Phase 2–3 | Downloadable meal plans, guides — no live coaching required |
| **Referral programme** | Phase 3 | Clients refer friends; track via platform or manual codes |
| **Certified partner referrals** | Phase 3+ | e.g. local fitness trainers — referral only, not marketplace cooking |

### 3.4 Future / back-burner offerings (do not build now)

| Offering | Status | Notes |
|----------|--------|-------|
| **Recipe library / meal inspiration product** | Back burner | Tianna's recipes as content; separate brand or subdomain later |
| **Brand partnerships & sponsorship** | Later | Brands pay for promotion; needs audience size first |
| **Merchandising** | Later | Physical products, affiliate links — after traction |
| **Peer marketplace** | Deprioritised | Clients or partners selling services on-platform — not aligned with current focus |
| **Food fulfilment of any kind** | Excluded | No cooking, no third-party kitchen, no meal delivery |

---

## 4. Content & Marketing

### 4.1 Instagram

- **Primary content:** Nutrition advice, low-GI meal ideas, transformation stories
- **Purpose:** Drive awareness → free consultation → paid coaching
- **Not required:** Exercise-focused posts as main feed (optional in stories or plans)

### 4.2 Website role

- Explain philosophy and low-GL approach
- Showcase coaching offerings with clear CTAs (book consultation, join workshop)
- Preview client hub / dashboard (roadmap credibility)
- Capture leads (contact form, consultation booking)
- **No** food shop, order flow, or cooking class listings

---

## 5. Client Platform & Dashboard

The **agentic / data-driven dashboard** helps clients see how well they are doing and gives Tianna evidence for coaching conversations.

### 5.1 Meal logging

| Capability | Detail |
|------------|--------|
| **Daily meal log** | Breakfast, lunch, dinner, snacks — what they ate |
| **Portion amounts** | Quantity per item (grams, servings, or simple units) |
| **Low-GL alignment** | Tag or score meals against programme guidance |

### 5.2 Statistics & insights (initial)

| Insight | Description |
|---------|-------------|
| **Daily / weekly projected glycemic load** | Calculated from logged meals and portion data |
| **Weight trend** | Time-series chart with goal line |
| **Adherence score** | % of days on-plan vs. menu plan |
| **Streaks** | Logging consistency, on-plan days |
| **Energy & wellbeing** | Optional 1–10 energy, sleep hours, mood |
| **Weekly digest** | Plain-language summary: "This week your average daily GL was X; weight trend Y" |
| **Projections** | Statistical only: "If you maintain current adherence, trend toward goal by [date]" |

### 5.3 Achievement scoreboard

Gamified view of the same underlying data:

- Tiers (e.g. Starter → Consistent → Thriving → Champion)
- Badges: first 7-day log streak, completed 30-day workshop, 10 sessions attended
- Progress to next level; encouragement-first UX (no shaming)

### 5.4 Coach view

- Client roster with dashboard snapshots
- Review meal logs and GL trends before sessions
- Set programme benchmarks and manual badges
- Optional: approve AI-generated insight text before client sees it

### 5.5 AI-assisted insights (phased)

| Phase | Capability |
|-------|------------|
| **1 — Rules** | Threshold alerts, streak nudges, GL summaries |
| **2 — Patterns** | Correlations (sleep vs. energy, adherence vs. weight) |
| **3 — Narrative** | Weekly AI digest constrained by Thrive low-GL knowledge base |

**Guardrails:** Assistive only, not medical advice; UK GDPR consent for health data; explainable recommendations.

---

## 6. Users & Roles

| Role | Responsibilities |
|------|------------------|
| **Client** | Purchases coaching, logs meals/metrics, uses dashboard, joins WhatsApp cohort, books sessions |
| **Coach (Tianna)** | Delivers sessions, manages cohorts, sets plans, reviews client data |
| **Admin** | Billing, platform config, compliance |

---

## 7. Current State (POC)

The static site in this repository demonstrates:

- Brand, story, and service marketing
- Coaching catalogue with booking request flow
- Contact and consultation forms
- Client hub preview (non-functional) with meal logging and glycemic load mock-up
- Community section describing WhatsApp cohort support

**Still to build:**

- Auth, payments, live dashboard, WhatsApp integration, and cohort management

---

## 8. Website Development Steps

Ordered path from static POC to launch-ready marketing site, then platform.

### Phase A — Align marketing site (weeks 1–2) ✅ POC updated

1. ~~**Remove out-of-scope content** — cooking classes, food ordering, hampers, any commerce copy~~
2. ~~**Rewrite service catalogue** — 1:1, group, 30-day workshop, menu plans, optional exercise plans~~
3. ~~**Update audience copy** — adults, sustainable weight loss, low-GL~~
4. ~~**Add WhatsApp / community mention** — set expectations for cohort groups~~
5. ~~**Client hub section** — describe dashboard features (meal log, GL projection, progress)~~
6. **CTAs** — free consultation, workshop sign-up, contact form *(in place; connect to real booking next)*
7. **Mobile, accessibility, SEO** — portal mobile-first; marketing site desktop-first then mobile; WCAG 2.1 AA basics *(viewport + responsive CSS in place; full mobile audit before launch — see §12.1)*

### Phase B — Booking & payments (weeks 3–6)

1. Choose stack: e.g. Stripe Checkout + Cal.com (or Calendly) for 1:1; manual or simple form for workshop intake
2. Service pages with pricing and what's included
3. Confirmation emails with WhatsApp group invite link
4. Privacy policy and health-data disclaimer

### Phase C — Client portal MVP (weeks 6–12)

**Build spec:** [`MVP_APPLICATION_SPEC.md`](./MVP_APPLICATION_SPEC.md) — Oracle Always Free VM, Docker Compose, PostgreSQL container, ghcr.io deploy.

1. Authentication (email magic link or OAuth)
2. Meal log + portion entry
3. Basic GL calculation (food database or curated low-GL food list)
4. Weight and adherence charts
5. Simple scoreboard (streaks, badges)
6. Coach admin: view client logs

### Phase D — Cohort & intelligence (months 3–6)

1. Workshop/cohort enrolment and intake dates on site
2. Cohort progress aggregates (privacy-safe)
3. Weekly insight emails or in-app digest
4. AI pattern summaries (rules engine first)

---

## 9. Business Development Steps

Parallel track to website build — not all blocked on tech.

### Phase 1 — Offer definition & launch prep

| Step | Action |
|------|--------|
| 1 | Finalise 1:1, group, and 30-day workshop packages (price, duration, deliverables) |
| 2 | Package existing PDF meal plans into 1-week / 2-week products |
| 3 | Write workshop curriculum (30 daily themes, check-in prompts) |
| 4 | Create WhatsApp group rules and welcome message template |
| 5 | Set consultation script and onboarding questionnaire |
| 6 | Define cancellation, refund, and no-show policy |

### Phase 2 — Go to market

| Step | Action |
|------|--------|
| 1 | Soft launch to existing Instagram audience |
| 2 | Free consultation funnel → paid 1:1 or workshop |
| 3 | Run first 30-day cohort (manual tracking if portal not ready) |
| 4 | Collect testimonials and before/after stories (with consent) |
| 5 | Refine pricing from first cohort feedback |

### Phase 3 — Scale & systemise

| Step | Action |
|------|--------|
| 1 | Launch client dashboard for new enrolments |
| 2 | Introduce subscription / multi-month packages |
| 3 | Document SOPs: onboarding, WhatsApp moderation, session notes |
| 4 | Consider VA or junior coach only if volume demands — not for cooking |

### Phase 4 — Growth (later)

| Step | Action |
|------|--------|
| 1 | Brand partnership outreach (supplements, kitchen tools, low-GI brands) |
| 2 | Digital product line (standalone meal plans) |
| 3 | Revisit **separate** recipe/content product if demand exists — still no cooking fulfilment |
| 4 | Referral and affiliate programmes |

---

## 10. Technical Phasing Summary

| Phase | Focus | Deliverables |
|-------|--------|--------------|
| **0 — POC cleanup** | Marketing alignment | ~~Remove food/cooking; update offerings copy~~ ✅ |
| **1 — Foundation** | Sell services | Auth, Stripe, booking, consultation flow, WhatsApp onboarding |
| **2 — Metrics & scoreboard** | Client dashboard | Meal log, portions, GL projection, weight charts, badges |
| **3 — Cohorts** | Group programmes | Workshop enrolment, cohort views, coach tools |
| **4 — Intelligence** | Insights | Weekly digests, pattern engine, coach review queue |
| **5 — Growth** | Monetisation extras | Subscriptions, digital downloads, referrals |
| **— Back burner** | Separate initiative | Recipe/content product; brand deals |

---

## 11. Core User Journeys

### New client

1. Discover via Instagram or site → book free consultation
2. Purchase 1:1, group, or 30-day workshop
3. Receive welcome pack + WhatsApp group invite + menu plan
4. Create portal account → log meals and weight
5. View dashboard (GL, adherence, scoreboard) → attend sessions → engage in WhatsApp

### Returning client

1. Log daily meals and metrics
2. Check dashboard insights and streaks
3. Attend scheduled sessions; message in WhatsApp
4. Renew package or join next cohort

### Coach

1. Run consultations and convert to paid programmes
2. Manage calendar and cohort intakes
3. Review client dashboards before sessions
4. Moderate WhatsApp; nudge low-engagement members
5. Iterate menu plans and workshop content from cohort data

---

## 12. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Security** | Authentication, RBAC, encrypted data in transit and at rest |
| **Privacy** | UK GDPR; explicit consent for health and meal data |
| **Accessibility** | WCAG 2.1 AA for forms and dashboard |
| **Mobile** | **Split strategy** — portal **mobile-first**; marketing site **desktop-first** (see §12.1) |
| **Payments** | PCI-compliant provider (e.g. Stripe); no card data on own servers |
| **Medical** | Clear disclaimers — coaching, not clinical treatment |

### 12.1 Mobile & client devices (decided)

Design strategy **differs by surface**:

| Surface | Design approach | Rationale |
|---------|-----------------|-----------|
| **Client portal** (`app.thrivewithtianna.com`) | **Mobile-first** | Primary interaction point — clients log meals on phones after eating; desktop layouts **ship alongside** mobile at launch, not as a later phase |
| **Marketing site** (`index.html`) | **Desktop-first** | Brand and service storytelling; mobile responsive layout **after** desktop is solid |

Clients log meals **on their phones after eating** — often one-handed, in under two minutes. The portal must excel on mobile. The marketing site must remain usable on phones but may prioritise desktop design first. A **native mobile app** is a future option, not required for MVP.

| Phase | Delivery | Scope |
|-------|----------|--------|
| **Launch (MVP)** | **Responsive web** | Portal: mobile-first UX + desktop at same time; site: desktop-first with mobile pass before public launch |
| **Phase 2–3** | **PWA (optional)** | Add to home screen, offline-tolerant meal log queue, web push for nudges (where permitted) |
| **Future** | **Native app (iOS/Android)** | Evaluate when subscription base and retention justify app-store investment; likely React Native or Capacitor wrapper sharing portal API — **not in initial build** |

**Portal:** design **mobile-first** in Figma/build; scale up to desktop with the same flows and data. Primary flows (log meal, check GL, read coach message) optimised for phone; desktop adds width, side nav, and richer charts.

**Marketing site:** design desktop layout first; add/refine mobile breakpoints and nav in Phase A polish (§8). Tap targets ≥ 44px; no horizontal scroll on 320px+.

**WhatsApp complement:** Many clients will use WhatsApp for nudges; the portal remains the **system of record**.

**Native app trigger (future):** Consider when ≥ 200 active subscribers **or** repeated feedback requests app-store presence **or** PWA limits block a key feature (e.g. reliable background sync).

---

## 13. Open Questions

- Exact pricing for **30-day workshop, group, and 1:1** (subscription **£29.99/mo** decided)
- **Annual subscription discount** percentage
- **Coaching clients:** separate subscription required or portal-only access bundled?
- Which **onboarding metrics** mandatory — [`ONBOARDING_METRICS.md`](./ONBOARDING_METRICS.md) (Tianna to select)
- Phase 2 **auto-send rule IDs** always human-reviewed
- Microsoft Entra **single- vs multi-tenant** (see `CLIENT_PORTAL_SPEC.md` §6.2)
- Default **LLM provider** when both OpenAI and Anthropic configured

**Decided:** separate exercise SKU with portal included; menu plan = Lite portal; GL per coach; Zoom; Nutritics future API; `app.thrivewithtianna.com`; localisation planned; DPIA + retention legal review required; **portal mobile-first** (desktop ships with it); **marketing site desktop-first**; native app deferred.

See [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md) for full list.

---

## 14. Relationship to Repository

| Asset | Purpose |
|-------|---------|
| `index.html`, `styles.css`, `main.js` | Marketing POC — update per §8 Phase A |
| `docs/PLATFORM_SPEC.md` | **Source of truth** for product and business scope |
| `docs/MVP_APPLICATION_SPEC.md` | **MVP application & Oracle hosting** |
| `docs/CLIENT_PORTAL_SPEC.md` | Client portal & agent build specification |
| `docs/CLIENT_PORTAL_BUSINESS.md` | Client portal operating model (personas, coach playbook, agent voice) |
| `docs/COMPETITIVE_ANALYSIS.md` | Competitor profiles, demographics, positioning |
| `download_instagram.py` | Instagram asset pipeline for site imagery |

Implementation of the full platform requires backend API, database, auth, payments, booking, and analytics services as phased above.

---

*This document supersedes prior versions that included food ordering, cooking services, and marketplace meal prep. Those are explicitly out of scope unless a separate future spec is written.*
