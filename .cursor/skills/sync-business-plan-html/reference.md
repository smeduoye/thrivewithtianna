# Business plan HTML reference

## File pairing

```
docs/BUSINESS_PLAN_SUMMARY.md  ──sync──►  business-plan.html
                                              business-plan.css  (layout only)
                                              business-plan.js   (nav scroll only)
```

## Section structure in HTML

Each major block:

```html
<section id="market">
  <h2>4. Target market</h2>
  <!-- content -->
</section>
```

## Table pattern

```html
<div class="bp-table-wrap">
  <table class="bp-table">
    <thead>
      <tr><th>Column</th></tr>
    </thead>
    <tbody>
      <tr><td>Cell</td></tr>
    </tbody>
  </table>
</div>
```

## Status badges

| Markdown | HTML |
|----------|------|
| Price decided | `<span class="bp-status decided">Decided</span>` |
| **TBC** | `<span class="bp-status tbc">TBC</span>` or `Price TBC` |
| Legal review required | `<span class="bp-status required">Required</span>` |

## Position statement callout

```html
<div class="bp-callout position">
  <p class="bp-callout-label">Position statement — pending sign-off</p>
  <blockquote>...</blockquote>
</div>
```

## Pillars / cards grid

Six positioning pillars → `bp-grid-2` with `bp-card` + `bp-pillar` + `bp-pillar-num`.

## Competitive landscape pre block

Use `<pre class="bp-pre">` for ASCII landscape diagram (preserve monospace).

## Roadmap phases

```html
<div class="bp-phase">
  <span class="bp-phase-label">Phase B</span>
  <div class="bp-phase-body">
    <h4>Title</h4>
    <p>Description</p>
  </div>
</div>
```

## TOC entry

When adding section `foo`:

1. `<section id="foo">`
2. Add to `.bp-toc ol`: `<li><a href="#foo">Title</a></li>`
3. Optionally add to header `.nav-links` if founder-critical

## Brand assets

- Fonts: Cormorant Garamond + Outfit (same as `index.html`)
- CSS: `styles.css` + `business-plan.css`
- Logo block: `.logo` with `.logo-mark` T
- Footer links to `docs/BUSINESS_PLAN_SUMMARY.md` and `docs/OPEN_DECISIONS.md`

## Related docs (not auto-synced)

Updating the business plan may **reference** but does not require mirroring:

- `docs/OPEN_DECISIONS.md` — update separately when decisions change
- `docs/PLATFORM_SPEC.md`, `docs/CLIENT_PORTAL_SPEC.md` — deep specs; link only

If a decision in those specs changes business-plan facts, update **both** markdown summary and HTML.
