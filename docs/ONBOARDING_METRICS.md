# Thrive with Tianna — Onboarding & Tracking Metrics Catalogue

**Status:** Draft — **Tianna to mark mandatory vs optional**  
**Last updated:** June 2026  
**Related:** [`OPEN_DECISIONS.md`](./OPEN_DECISIONS.md) (U-16)

---

## How to use this document

For each metric, mark: **M** = mandatory at onboarding or first week · **O** = optional · **—** = not collected.

**Already decided elsewhere:**

- Symptom daily log: **optional** (U-17)
- GL target: **per client from coach** (U-18), not self-set band at onboarding
- Identity fields (name, phone, email, contact preferences, goals): **mandatory** per build spec

---

## 1. Identity & programme

| Metric | Description | Suggested |
|--------|-------------|-----------|
| First name, last name | Legal/preferred name | M |
| Email | Login, comms | M |
| Phone (E.164) | WhatsApp, verification | M |
| Date of birth / age band | Demographics, rule safety | O |
| Gender | Optional self-describe or skip | O |
| Postcode (first half) | Region only, not full address | O |
| Programme / SKU enrolled | Subscription, workshop, menu, exercise | M (system) |
| Referral source | Instagram, friend, Google | O |

---

## 2. Goals & coaching context

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Primary goal: weight loss | Yes/no + motivation | M |
| Target weight (or range) | kg/lb | M |
| Target date / timeframe | Optional deadline | O |
| Wellbeing goals (multi-select) | Energy, sleep, digestion, cravings, mood, confidence | M (pick ≥1) |
| Starting weight | Baseline | M |
| Height | BMI context (optional calc) | O |
| Dietary exclusions | Allergies, vegetarian, halal, etc. | M |
| Foods to avoid / dislike | Free text | O |
| Meal timing habits | e.g. skips breakfast, late eater | O |
| Assigned coach | Tianna / system | M (system) |
| Coach-set GL target band | Set by coach after onboarding | M (coach, post-signup) |

---

## 3. Weight & body

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Current weight | Baseline | M |
| Weigh-day preference | e.g. Monday AM fasted | O |
| Weight unit preference | kg / lb | M |
| Body measurements | Waist, hips, chest | O |
| Progress photos | Private upload | O |

---

## 4. Sleep & energy

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Typical sleep hours | Average per night | O |
| Sleep quality (1–5) | Baseline | O |
| Bedtime / wake time | Or total hours only | O |
| Daily energy level (1–5) | Quick check-in | O |
| “Felt rested” yes/no | Morning | O |

---

## 5. Symptoms & wellbeing (watchlist)

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Symptom watchlist (multi-select) | Bloating, fatigue, cravings, headaches, reflux, mood, joint pain, etc. | O |
| Symptom severity when logged | 0–10 or mild/moderate/severe | O (if watchlist used) |
| Stress level (1–5) | Weekly or daily | O |
| Mood (1–5) | Optional daily | O |
| Hydration (glasses/day) | Simple count | O |
| Alcohol units (weekly) | Lifestyle context | O |
| Menstrual cycle note | Non-clinical; affects weight/symptoms | O |

---

## 6. Activity & lifestyle

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Activity level | Sedentary / light / moderate / active | O |
| Exercise plan assigned | If exercise SKU | M (if SKU) |
| Steps (manual or future wearable) | Daily average | O |
| Smoking status | Never / former / current | O |

---

## 7. Medical & safety (coaching scope)

| Metric | Description | Suggested |
|--------|-------------|-----------|
| Health disclaimer acknowledgement | Not medical treatment | M |
| GDPR / health data consent | Timestamped | M |
| WhatsApp marketing/coaching opt-in | Separate from GDPR | M |
| GP conditions (self-reported) | Diabetes, thyroid, PCOS, etc. — flag only | O |
| Medications affecting weight | e.g. GLP-1, steroids — awareness only | O |
| Pregnancy / breastfeeding | Safety gate | M (yes/no question) |
| Eating disorder history | Sensitive; human review if disclosed | O |
| Red-flag acknowledgement | When to seek GP | M |

---

## 8. Ongoing logging (post-onboarding)

| Metric | Frequency | Suggested tier |
|--------|-----------|----------------|
| Meal log + portions | Daily | Full: encouraged; Lite: optional |
| Daily GL total | Computed | Full |
| Adherence to menu plan | Computed | Full / Lite |
| Weight | Per weigh-day | Full; Lite: optional |
| Sleep | Nightly | Optional |
| Symptoms | Daily | Optional |
| Energy / mood | Daily | Optional |

---

## 9. Tianna’s selection worksheet

Copy and fill:

```text
MANDATORY AT ONBOARDING:
- 
- 

OPTIONAL (OFFERED, NOT REQUIRED):
- 
- 

NOT COLLECTED AT LAUNCH:
- 
```

---

*After selection, update `CLIENT_PORTAL_SPEC.md` onboarding wizard and `OPEN_DECISIONS.md` U-16.*
