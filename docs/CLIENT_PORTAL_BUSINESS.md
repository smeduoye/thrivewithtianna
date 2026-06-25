# Thrive with Tianna — Client Portal Business Operating Model

**Status:** Draft for review  
**Last updated:** June 2026  
**Owner:** Thrive with Tianna  

**Related documents:**

| Document | Role |
|----------|------|
| [`PLATFORM_SPEC.md`](./PLATFORM_SPEC.md) | Business scope, offerings, exclusions, go-to-market |
| [`CLIENT_PORTAL_SPEC.md`](./CLIENT_PORTAL_SPEC.md) | Functional requirements, agent architecture, technical build spec |
| *Plain business summary* | [`BUSINESS_PLAN_SUMMARY.md`](./BUSINESS_PLAN_SUMMARY.md) — stakeholder review doc |

This document is the **operating model**: who uses the portal, how they experience it day to day, how Tianna works with it, how the agent behaves, and what “good” looks like. Implementation details live in `CLIENT_PORTAL_SPEC.md`.

---

## 1. Purpose of the portal (business view)

Clients do not buy a dashboard. They buy **progress toward weight and wellbeing goals** with structured low-GL guidance and accountability between sessions.

The portal must continuously help clients answer:

1. **Am I on track?** — weight trend, GL, adherence, sleep
2. **What should I do next?** — today’s meal, portion, swap, habit
3. **Do I feel supported?** — timely, personal, non-judgmental contact

It must help Tianna answer:

1. **Who needs me today?** — alerts, missed logs, symptom spikes
2. **What happened since we last spoke?** — session prep in minutes
3. **What can the system handle so coaching can scale?** — nudges, summaries, routine Q&A

The portal **complements** WhatsApp peer community and live coaching. It is **coaching support**, not medical treatment.

---

## 2. Client personas

Three primary personas share the same underlying data model but differ in **onboarding depth**, **nudge frequency**, and **chat intensity**.

### 2.1 Persona A — Structured starter (30-day workshop)

| Attribute | Detail |
|-----------|--------|
| **Motivation** | Wants a clear daily rhythm and peer accountability |
| **Needs** | Simplicity, defaults, streaks, cohort milestones, weekly themes |
| **Primary channel** | Often WhatsApp (community + coach) |
| **Risk** | Drops off after week 2 if logging feels like homework |
| **Portal emphasis** | Daily accountability, “Day N of 30”, adherence %, group-safe announcements |

### 2.2 Persona B — Private coachee (1:1 coaching)

| Attribute | Detail |
|-----------|--------|
| **Motivation** | Deep personalisation tied to their body and goals |
| **Needs** | Continuity across portal and WhatsApp; symptom tracking; session-linked guidance |
| **Primary channel** | Client preference (portal, WhatsApp, or email) |
| **Risk** | Generic bot replies erode trust quickly |
| **Portal emphasis** | Rich logs, coach prep view, highly personalised 1:1 agent messages (Phase 2+) |

### 2.3 Persona C — Menu plan client (lighter touch)

| Attribute | Detail |
|-----------|--------|
| **Motivation** | Wants a structured plan without full coaching commitment |
| **Needs** | Adherence to assigned plan, GL visibility, optional upgrade path |
| **Primary channel** | Email or portal |
| **Risk** | Overwhelmed by symptom/sleep tracking they did not sign up for |
| **Portal emphasis** | **Lite experience** — meal log, adherence, GL; minimal symptom/sleep unless opted in |

### 2.4 Persona → programme mapping

| Programme | Default persona | Portal tier |
|-----------|-----------------|-------------|
| 30-day workshop | A | Full |
| Group coaching | A (with longer horizon) | Full |
| 1:1 coaching | B | Full |
| 1-week / 2-week menu plan | C | Lite (recommended) |
| **Subscription (post-trial)** | A, B, or men 35–50 (Track B) | Full |

**Audience & competitor context:** [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) §5–§6. **Messaging tracks:** same doc §6.6.

---

## 3. Programme-specific business rules

### 3.1 30-day workshop cohort

- Assign **cohort** + **start date** at onboarding; dashboard shows “Day N of 30”.
- **Weekly theme** from existing PDF curriculum drives agent broadcasts (group-safe content only).
- **WhatsApp group** = peer support; agent never posts personal metrics to the group.
- **Milestones:** day 7, 14, 21, 30 — celebration + next-step CTA (renew, 1:1, next cohort).
- **End of programme:** completion badge, summary stats, upsell to 1:1 or next cohort.

### 3.2 1:1 coaching

- Full onboarding: symptom watchlist, detailed goals, assigned coach.
- Agent messages highly personalised; may reference last session if notes captured in admin.
- **Primary channel** from contact preferences; quiet hours always respected.
- Optional: **session prep pack** auto-generated 24 hours before booked session (Phase 2+).
- Tianna adjusts goals, GL target band, and menu plan from coach admin.

### 3.3 Menu plan only (Lite tier)

- Lighter onboarding: plan assignment mandatory; goals optional.
- Features: meal log, adherence %, daily GL — no mandatory symptom/sleep.
- Agent: adherence nudges and GL summaries only; no deep symptom coaching.
- **Upgrade CTA** when adherence high but weight stalled (if weight logging enabled): book consultation.

### 3.5 Monetisation: trial, subscription, and portal inclusion

#### Self-serve signup (decided)

| Step | Client experience |
|------|-------------------|
| 1 | Self-register on portal (Google, Microsoft, or email) |
| 2 | Complete onboarding (identity, goals, consent) |
| 3 | **Enter credit card** (Stripe — no charge during trial) |
| 4 | **5-day trial** — full portal logging + coaching/agent support |
| 5 | Before day 5 ends | Prompt to subscribe |
| 6 | Subscribe | Continued advice, agent, and portal access |
| 7 | Decline / card fails | Access ends or read-only; no ongoing agent messages |

**Business intent:** Low-friction try-before-you-buy; card on file reduces drop-off at conversion.

**Open for pricing work:** Trial length fixed at 5 days; subscription price, billing interval (monthly?), and what is included vs live coaching packages. **Market benchmarks:** [`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md) §4–§6 and §3.5.1 below (summary).

#### 3.5.1 Market benchmark research (summary)

Full competitor profiles, demographics, and positioning: **[`COMPETITIVE_ANALYSIS.md`](./COMPETITIVE_ANALYSIS.md)**.

**Subscription price bands (decided unless noted):**

| Item | Decision |
|------|----------|
| Monthly subscription | **£29.99/mo** |
| Annual subscription | **Yes** — discount % **TBC** (propose 20–30% off, e.g. ~£299/yr) |
| Trial | 5 days free + card |
| Post-trial / lapse | **Read-only period**, then lock after **grace days** (default **5**, admin-configurable) |

#### Portal included in some programmes (partially decided)

Portal access is **not** automatically bundled in every SKU.

| SKU | Portal | Agent / advice | WhatsApp cohort | Status |
|-----|--------|----------------|-----------------|--------|
| **Subscription** (post-trial) | **Full** | Yes | **No** (workshop only) | Decided |
| **1:1 coaching** | Full | Yes + Tianna | Optional | Portal included; **price TBC** |
| **30-day workshop / group** | Full | Yes | **Yes** (tiered by programme) | Portal included; **price TBC** |
| **Menu plan** | **Lite** | Minimal | No | Decided |
| **Exercise plan** | **Included** (portal access) | Minimal | No | Decided (separate SKU) |

**Still TBC:** Workshop, group, and 1:1 **prices**; whether coaching clients need a separate subscription or portal-only bundle (P-08).

### 3.6 Channel policy (all programmes)

| Content type | Portal | WhatsApp 1:1 | Email 1:1 | Group email / phone |
|--------------|--------|--------------|-----------|---------------------|
| Personal coaching (uses client logs) | ✓ | ✓ | ✓ | ✗ |
| Reminders / nudges | ✓ | ✓ | ✓ | Optional |
| Workshop themes / announcements | ✓ | ✓ | ✓ | ✓ |
| Red-flag escalation | ✓ | ✓ (hold auto) | ✓ | ✗ |

---

## 4. Client journeys

### 4.1 First 24 hours after purchase

| Step | Client experience | Business outcome |
|------|-------------------|------------------|
| Welcome email | Login link + WhatsApp group invite (if applicable) + what to expect | Sets dual-channel expectation |
| Account activation | Google, Microsoft, or email magic link | Low friction |
| Onboarding (10–15 min) | Name, phone, email, channel preference, goals, consent | Complete user record; WhatsApp opt-in captured |
| Baseline | Weight, sleep, symptom watchlist (Full tier) | Starting point for trends |
| First win | Log one meal or weight; see first GL or adherence snapshot | Time-to-first-log **< 24 hours** |
| Welcome message | From Tianna (Phase 1) or approved template (Phase 2+) | Human warmth at relationship start |

**Empty-dashboard rule:** No client lands on a blank screen. Always show: stated goal, today’s GL target band (if set), one suggested action (“Log breakfast”), and assigned plan link.

### 4.2 Typical day (3–5 minutes total)

Designed for **mobile use after a meal** (one-handed, ≤ 2 minutes per log). **Portal: mobile-first** — phone is the primary interaction point; desktop ships alongside. **Marketing site: desktop-first**, mobile responsive pass afterwards.

```text
Morning (optional, ~60 sec)
  → Weight (if weigh day)
  → Last night’s sleep + quality
  → Energy 1–5 (optional)

After each meal (~60–90 sec)
  → Add items + portions/weights
  → See meal GL + running daily total

Evening (~60 sec)
  → Symptom check-in on watchlist (Full tier)
  → Review day summary

Anytime
  → Ask coach a question OR receive proactive nudge on preferred channel
```

### 4.3 Typical week (system cadence)

| Day | System behaviour |
|-----|------------------|
| **Monday** | Weekly focus message — theme from programme or cohort |
| **Tue–Thu** | Nudges only if logging gap, GL drift, or rule trigger |
| **Friday** | “Week so far” mini-summary (adherence, avg GL, weight delta if logged) |
| **Sunday** | Weekly digest: avg GL, weight change, sleep pattern, 1–2 actions for next week |

Quiet hours (from contact preferences) apply to all non-urgent outbound messages.

### 4.4 Programme lifecycle — end and renewal

At programme end, surface:

- Total weight change (if logged)
- Adherence trend and best logging streak
- Plain-language “what improved” (energy, sleep — non-clinical)
- Clear CTA: renew 1:1, join next cohort, or purchase standalone plan

Offboarded or expired clients: read-only access to their history for **30 days** (proposal — align with retention policy in `CLIENT_PORTAL_SPEC.md` §14.2), then archived per GDPR.

---

## 5. Coach operating model

### 5.1 Tianna’s daily routine (~15 minutes)

| Order | Action | Where |
|-------|--------|-------|
| 1 | Open **priority queue** — P0 first, then P1 | Coach admin |
| 2 | Respond to P0/P1 clients (portal, WhatsApp, or email) | Preferred channel |
| 3 | Scan **new logs** since yesterday for active roster | Client list filter |
| 4 | Approve or edit **agent drafts** in review queue (Phase 2+) | Review queue |
| 5 | Note clients to flag in upcoming live sessions | Session prep |

This is a target operating rhythm, not a hard SLA. P0 always same day.

### 5.2 Session prep view (5-minute scan)

Before each 1:1 or group check-in, coach admin shows:

**Header**

- Client name, programme, week N of M, primary goal
- Last contact: channel + date
- Alert badge: red / amber / none

**Since last session**

- Weight: start → now (7-day moving average)
- GL: daily chart + weekly average vs target band
- Adherence: % meals on plan
- Sleep: average hours + quality trend
- Symptoms: watchlist severity over time
- Chat highlights: last 5 messages, open questions

**Suggested talking points** (rules-generated; Tianna may edit)

- Examples: GL spike on specific days, plateau with strong adherence, sleep–craving cluster

**Actions available**

- Adjust goal or GL target band
- Assign or swap menu plan
- Flag for GP discussion (red symptom)
- Send follow-up on preferred channel

### 5.3 Priority queue

| Priority | Trigger | Required action | Auto-agent allowed? |
|----------|---------|-----------------|---------------------|
| **P0** | Red-flag symptom or crisis language | No automated advice; medical disclaimer; notify Tianna immediately; human contact same day | ✗ |
| **P1** | No log 3+ days (active programme) | Personal nudge; Tianna if no response in 48h | Draft only (Phase 2); Tianna send (Phase 1) |
| **P2** | Daily GL above target 3 consecutive days | Coaching message + swap suggestions from plan | Draft → approve (Phase 2); auto low-risk (Phase 3) |
| **P3** | Positive milestone (7-day streak, workshop day 30) | Celebration + next step | Auto-send (Phase 3) |

### 5.4 Coach actions after sessions

- Update goals or GL band if agreed in session
- Assign new menu plan
- Add session note (free text) for future agent context (Phase 2+)
- Schedule follow-up message or flag for priority queue

---

## 6. Agent voice, boundaries, and examples

### 6.1 Positioning

- **Name:** “Your Thrive Coach” (working title)
- **Not:** a medical professional, not impersonating Tianna without disclosure
- **Disclosure (Phase 2+):** Messages are personalised using your logs and Thrive’s low-GL guidelines; Tianna oversees your programme

### 6.2 Voice principles

| Do | Don’t |
|----|-------|
| Warm, encouraging, specific | Shame, guilt, “cheat day” language |
| Reference *their* logged meals and goals | Generic diet tips unrelated to their data |
| Explain *why* (GL, portions, pairing) | Diagnose conditions or advise on medication |
| One or two practical next steps | Long lectures or information overload |
| Normalise plateaus and setbacks | Guarantee weight loss by a fixed date |

Tone aligns with marketing site philosophy: science-based, low-GL, sustainable, care-led.

### 6.3 Human vs agent boundary

| Always human (Tianna) | Agent may handle (rules + validation) |
|-----------------------|----------------------------------------|
| Red-flag or crisis symptoms | Streak celebrations (P3) |
| Client explicitly asks for Tianna | Logging reminders (P1 draft) |
| Goal, plan, or GL target changes | GL summaries and swap suggestions (P2) |
| First welcome message of relationship (Phase 1) | Weekly digest draft (Phase 2 → approve) |
| Emotional distress beyond coaching scope | FAQ from approved knowledge base |
| Any message Tianna marks “always review” | Workshop theme broadcasts (group-safe) |

**Phase 1:** 100% human outbound coaching messages.  
**Phase 2:** Agent drafts; Tianna approves before send (default).  
**Phase 3:** Auto-send for configured low-risk rule IDs only; P0 always human.

### 6.4 Example messages (templates for KB / rules)

**High-GL lunch (WhatsApp 1:1)**

> You logged [item] at [portion] — that meal was around GL [X], which brought today’s total to [Y] (your target is [band]).  
> For dinner, [specific swap from their menu plan] would help bring today back on track.  
> Want a portion guide for tomorrow’s lunch?

**Three days no logging**

> Hi [first name] — I haven’t seen a log since [day]. No judgment — busy weeks happen.  
> If you’re still working toward [goal], even one meal log today helps us see what’s working.  
> Reply here or open your dashboard — whichever is easier.

**Symptom concern (escalation)**

> [Symptom] that’s worrying you is worth taking seriously. I’m not able to assess medical causes here — please contact your GP if it’s persistent or severe.  
> I’ve flagged this for Tianna to follow up with you directly.

**Workshop week theme (group-safe broadcast)**

> Week [N] focus: [theme from curriculum]. This week, aim for [one practical action].  
> Share wins in your WhatsApp group — your coach sees your private logs separately.

---

## 7. Data → insight → action loops

Each loop must close with a **measurable outcome**. Rules in `CLIENT_PORTAL_SPEC.md` §7.3 implement these technically.

### Loop 1 — Meal → GL → swap

```text
Log meal → daily GL computed → over target?
  → suggest lower-GL swap from assigned menu plan
  → client logs next meal → adherence improves
```

**Success signal:** Client back in GL band within 24 hours.

### Loop 2 — Sleep → cravings → evening meal

```text
Poor sleep logged → correlated with cravings symptom
  → agent suggests lower-GL evening meal + earlier cutoff
  → track over 2 weeks
```

**Success signal:** Sleep quality stable or improved; craving severity down.

### Loop 3 — Weight plateau → adherence check

```text
Weight flat 14+ days → check adherence
  → if high: normalise plateau + review portions/hidden GL
  → if low: simplify targets + encouragement
  → Tianna notified if no change in 7 days
```

**Success signal:** Client re-engaged or plateau explained in next session.

### Loop 4 — Engagement → intervention

```text
No log 48h → nudge on preferred channel
  → no response 72h → Tianna priority queue (P1)
  → optional personal WhatsApp from Tianna
```

**Success signal:** Return to logging within 24 hours of nudge.

---

## 8. Engagement and retention

### 8.1 Gamification (encouragement-first)

**Use**

- Logging streaks (days logged, not “perfect diet” days)
- On-plan day streaks
- Tiers: Starter → Consistent → Thriving → Champion
- Badges: first 7-day log streak, completed 30-day workshop, progress toward personal goal

**Do not use**

- Weight competitions within cohorts
- Public leaderboards with weight or body metrics
- Shaming for high-GL days
- Negative messaging for missed logs (use curious, supportive tone)

### 8.2 Retention hooks

- Weekly digest delivers value even if client did not log every day
- Weight chart with goal line and 7-day moving average (smooths noise)
- Evidence narrative: “Your average daily GL moved from [X] to [Y] over 4 weeks”
- End-of-programme summary and clear renewal path

### 8.3 Target engagement metrics

| Metric | Target (indicative) |
|--------|---------------------|
| Weekly active loggers | ≥ 70% of active clients log ≥ 4 days/week |
| Time-to-first-log | < 24 hours after onboarding |
| Workshop completion | Track; benchmark after first cohort |
| Message helpfulness rating | ≥ 4/5 (Phase 2+) |
| Renewal rate post-workshop | Track from cohort 1 |

---

## 9. Trust, safety, and client communication

### 9.1 What clients must understand at onboarding

- This is **coaching**, not medical treatment
- **Who sees their data:** Tianna, authorised admin — not other clients
- **AI disclosure** when agent sends messages (Phase 2+)
- How to **opt out** of WhatsApp or email nudges
- How to **export or delete** their data (GDPR)

### 9.2 Product-enforced trust rules

- Personal health data never sent to group addresses
- Offboarded clients stop receiving all messages immediately
- Red-flag path bypasses automation entirely
- Audit trail for admin actions and agent sends
- Health data not logged in application server logs

### 9.3 WhatsApp: portal vs peer group

Onboarding must clarify:

- **WhatsApp group** = peers, encouragement, community (existing model)
- **Coach / agent WhatsApp** = private 1:1 support tied to their logs
- **Portal** = full dashboard, history, and optional chat

---

## 10. Success and failure modes

### 10.1 Success looks like

- Clients log 4+ days/week within the first month
- Clients can state their GL target and today’s number without help docs
- Tianna uses session prep view and spends less time reconstructing “what did you eat this week?”
- Clients report feeling supported (qualitative feedback + optional 1–5 rating)
- Workshop completion and renewal improve vs manual WhatsApp-only tracking

### 10.2 Failure modes and mitigations

| Failure mode | Mitigation |
|--------------|------------|
| Logging feels like chore | Quick log, favourites, copy yesterday, ≤2 min per meal |
| Bot feels generic | Always cite client data; Tianna approval phase; founder-validated KB |
| WhatsApp feels spammy | Quiet hours, opt-in, channel preference, P3 only for celebrations |
| Confusion: portal vs WhatsApp group | Onboarding copy + in-app reminder |
| Over-medicalising symptoms | Escalation rules, disclaimers, human P0 path |
| Tianna overwhelmed by review queue | Phase 1 human-only; narrow auto-send rules in Phase 3; start with small pilot cohort |
| Low menu-plan engagement | Lite tier UX; fewer required fields; clear upgrade path |
| Client drops off week 2 of workshop | Monday theme message, P1 nudge, peer group + private coach distinction |

---

## 11. Business decisions log

Track decisions here as they are resolved. Open items feed `CLIENT_PORTAL_SPEC.md` §15 where technical impact exists.

| # | Decision | Status | Resolution / notes |
|---|----------|--------|-------------------|
| B1 | Invite-only vs open self-registration at launch | **Decided** | **Self-registration** with 5-day trial; credit card at signup; subscription to continue |
| B2 | Minimum logging bar for “active” client | **Decided** | ≥4 days/week meal log (Full tier) |
| B3 | Default agent channel | **Decided** | **WhatsApp** when opted in |
| B4 | Tianna approval duration for agent | **Decided** | All drafts approved first **90 days** of Phase 2 |
| B5 | Workshop group messaging | **Decided** | **Parallel individual WhatsApp** |
| B6 | Menu plan portal tier | **Decided** | **Lite portal** |
| B7 | Portal included in all paid programmes | **Partial** | Some only — see §3.5 matrix; workshop/1:1 **prices TBC** |
| B8 | Personal health in group channels | **Decided** | Never — see §3.4 |
| B9 | Agent persona name | **Decided** | **“Your Thrive Coach”** |
| B10 | Empty dashboard on first login | **Decided** | Never empty — see §4.1 |
| B11 | Phase 1 coaching messages | **Decided** | 100% human (Tianna) |
| B12 | P0 symptom handling | **Decided** | No automation; same-day human follow-up |
| B13 | Brand partnerships / sponsorship disclosure | **Deferred** | Future Instagram sponsorship; ASA labelling |
| B14 | Exercise plans packaging | **Decided** | **Separate SKU**; portal **included** with SKU |
| B15 | Target demographic | **Decided** | **Core 30s–50s, men and women** |
| B16 | Market positioning | **Decided** | Low-GL + founder-led agent-assisted |
| B17 | Position statement | **Pending sign-off** | See `COMPETITIVE_ANALYSIS.md` §6.3 |
| B18 | Subscription price | **Decided** | **£29.99/mo** + annual (discount % TBC) |
| B19 | Marketing mix (gender) | **Decided** | ~60–65% women / ~25–35% men / ~10% shared |
| B20 | Primary competitor to watch | **Decided** | **Health360** |
| B21 | Exercise plan portal | **Decided** | **Portal included** with exercise SKU |
| B22 | Post-trial access | **Decided** | Read-only; **5-day grace** before lock (admin-configurable) |
| B23 | Symptom logging | **Decided** | **Optional** |
| B24 | GL target | **Decided** | **Per client from coach** |
| B25 | WhatsApp cohort on subscription | **Decided** | **Workshop only** |
| B26 | Onboarding metrics (mandatory set) | **Open** | Tianna to select from `ONBOARDING_METRICS.md` |
| B27 | Coaching SKU vs subscription overlap | **Open** | Portal bundled with 1:1/workshop — separate sub required? |

**Full checklist:** [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md)

---

## 12. Relationship to build spec

| Business concept | Build spec reference |
|----------------|---------------------|
| Onboarding fields | `CLIENT_PORTAL_SPEC.md` §5.1, §6.1 |
| Auth & admin lifecycle | `CLIENT_PORTAL_SPEC.md` §6.2, §6.3 |
| Logging & dashboard | `CLIENT_PORTAL_SPEC.md` §6.5–§6.9 |
| Multi-channel agent | `CLIENT_PORTAL_SPEC.md` §6.10 |
| Rules catalogue | `CLIENT_PORTAL_SPEC.md` §7.3 |
| Priority / escalation | This doc §5.3; rules SYM-04, validation §7.6 |
| Persona Lite tier | This doc §2.3, §3.3 — **needs UX/API tier flag in build spec** |
| Session prep view | This doc §5.2 — **needs coach UI story in build spec Phase 1+** |
| Positioning & messaging | `COMPETITIVE_ANALYSIS.md` §6 |
| Demographics & pilot KPIs | `COMPETITIVE_ANALYSIS.md` §5.3, §9 P7 |

When this document and the build spec conflict, **business exclusions** in `PLATFORM_SPEC.md` always win; then this document for operating behaviour; then `CLIENT_PORTAL_SPEC.md` for implementation detail.

---

## 13. Document history

| Version | Date | Change |
|---------|------|--------|
| 0.1 | June 2026 | Initial business operating model (personas, journeys, coach playbook, agent voice, loops, decisions) |
| 0.2 | June 2026 | Trial/subscription signup model; portal inclusion matrix; exercise separate SKU |
| 0.3 | June 2026 | §3.5.1 market benchmark research for subscription pricing |
| 0.4 | June 2026 | Positioning decisions B15–B20; links to competitive analysis |

---

*Plain-language business summary to be added as a separate short document for stakeholders.*
