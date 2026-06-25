---
name: sync-business-plan-html
description: Keeps business-plan.html in sync with docs/BUSINESS_PLAN_SUMMARY.md. Use when editing or updating the business plan summary, founder review content, pricing tables, open decisions, or business-plan.html — always update both files together.
---

# Sync business plan → HTML review page

## Source of truth

| Role | Path |
|------|------|
| **Canonical content** | `docs/BUSINESS_PLAN_SUMMARY.md` |
| **Founder-facing web page** | `business-plan.html` |
| **Styles (rarely change)** | `business-plan.css`, `business-plan.js` |

When **either** file changes, treat them as a **paired update**. Markdown leads; HTML follows.

## When to apply

- User edits `docs/BUSINESS_PLAN_SUMMARY.md`
- User asks to update business plan, founder review, or stakeholder summary
- User edits `business-plan.html` without touching markdown → align markdown first, or revert HTML-only drift
- Committing business-plan changes → both files must be in the commit

## Workflow

1. **Read** `docs/BUSINESS_PLAN_SUMMARY.md` (full file if small; changed sections if large).
2. **Mirror content** into `business-plan.html`:
   - Same section order and numbering (§1–§14)
   - Same tables, bullets, pricing, decisions, TBC badges
   - Preserve Thrive HTML patterns (see [reference.md](reference.md))
3. **Update navigation** if sections added/removed:
   - Sidebar TOC (`.bp-toc ol`)
   - Header nav links if major section added
   - Matching `id` on `<section>` elements
4. **Do not** change unrelated marketing site files unless the business plan references them.
5. **Run validation** before finishing:

```bash
python scripts/validate-business-plan-sync.py
```

6. Fix any reported missing sections or TOC mismatches.
7. If `Last updated` changes in markdown, no separate HTML date field required (hero uses static “Founder review · June 2026” unless user asks to bump it).

## HTML conventions

- Use existing classes: `bp-table`, `bp-callout`, `bp-callout position`, `bp-status decided|tbc|required`, `bp-card`, `bp-grid-2`, `bp-grid-3`
- Status badges: **Decided** → `bp-status decided`; **TBC** → `bp-status tbc`
- Position statement → `bp-callout position` + `<blockquote>`
- Review checklist → `#review` section with `bp-checklist` table
- External links: `target="_blank" rel="noopener"` where appropriate
- Keep `noindex` meta — page is for founder review, not public SEO

## Section ID map

Quick reference — full map in [reference.md](reference.md):

| Markdown § | HTML `section id` |
|------------|-------------------|
| 1 Executive summary | `summary` |
| 2 Mission & position | `position` |
| 3 Target market | `market` |
| 4 Service offerings | `offerings` |
| 5 Pricing | `pricing` |
| 6 Client experience | `experience` |
| 7 Coach operating model | `coach` |
| 8 Technology | `technology` |
| 9 Go-to-market | `gtm` |
| 10 Compliance | `compliance` |
| 11 Roadmap | `roadmap` |
| 12 Success metrics | `metrics` |
| 13 Risks | `risks` |
| 14 Open decisions / review checklist | `review` |

Note: HTML places **review checklist early** (§2 in page TOC) for founder UX; content must still match markdown §14.

## Commit checklist

```
- [ ] docs/BUSINESS_PLAN_SUMMARY.md updated
- [ ] business-plan.html reflects same facts
- [ ] python scripts/validate-business-plan-sync.py passes
- [ ] Commit message mentions both files if business plan changed
```

## Examples

**User:** “Set workshop price to £199”  
→ Update markdown §5 table → update HTML `#pricing` table → run validator

**User:** “Add a new open decision P-09”  
→ Update markdown §14 + `docs/OPEN_DECISIONS.md` if needed → update HTML `#review` checklist → run validator

**User:** “Refresh business plan from competitive analysis”  
→ Edit markdown → sync full HTML sections affected → run validator
