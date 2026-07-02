# Thrive with Tianna — brand assets

| File | Use | LinkedIn spec |
|------|-----|----------------|
| `thrive-linkedin-banner.png` | Company / personal banner | **1584 × 396 px** (upload as-is) |
| `linkedin-banner.html` | Source template (matches homepage hero) | Edit and re-export |
| `export-linkedin-banner.mjs` | Renders PNG from HTML | `node brand/export-linkedin-banner.mjs` from `marketing/` |
| `thrive-logo-square.png` | Company logo or profile image | **1024 × 1024 px** — upload as-is (LinkedIn min 300 × 300) |
| `linkedin-logo.html` | Logo source template | Edit and re-export |
| `export-linkedin-logo.mjs` | Renders logo PNG | `node brand/export-linkedin-logo.mjs` from `marketing/` |

## Brand colours

| Name | Hex |
|------|-----|
| Cream | `#F7F5F0` |
| Sage | `#4A6741` |
| Forest | `#2C3E2D` |
| Gold accent | `#C4A574` |

## Regenerate assets

From `marketing/` (requires Playwright — `npx playwright install chromium` once):

```bash
node brand/export-linkedin-banner.mjs
node brand/export-linkedin-logo.mjs
```

- **Banner** — same hero photo, overlay, fonts, and copy as `index.html`
- **Logo** — site colours, serif wordmark, sage **T** mark; sized for glance readability at 300px

## LinkedIn upload

1. **Company page:** Settings → Edit page → Upload logo + banner  
2. **Personal profile:** Me → View profile → pencil icon on background / photo  

Keep important text and logo in the **left ~60%** of the banner — LinkedIn overlays the profile photo on the bottom-left on personal profiles.
