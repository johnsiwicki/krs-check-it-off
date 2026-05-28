
# Pure HTML/CSS/JS Version

## Goal
Ship a self-contained build with **no React, no Tailwind, no build step** — just files you can paste into your CMS or drop on any static host.

## What you'll get

Two options, your pick:

1. **Single-file embed** — one `comparison.html` containing inlined CSS + JS. Paste into a CMS HTML block and you're done.
2. **Split files** — `comparison.html` + `styles.css` + `app.js` (cleaner to edit; works if your CMS lets you upload assets).

Either way: zero dependencies, works offline, loads instantly.

## Pages

- **Comparison view** (`/` or default) — the Good / Better / Best chart with checkboxes, info popups on the tier-label rows (Shingles, Warranty), and the Klaus logo.
- **Admin view** (`#admin` hash, or a separate `admin.html`) — same feature editor you have today: add/remove/reorder rows, edit tier labels + popup text, toggle defaults. Saves to `localStorage` exactly like now.

Hash routing (`#admin`) keeps it a single file if you prefer.

## Feature parity checklist

- Good / Better / Best columns in that order
- Checkbox rows with per-tier defaults
- Tier-label rows (Shingles, Warranty) with click-to-open info popups
- Klaus SVG logo from the CDN URL
- localStorage persistence under the same `klaus-roofing-features-v4` key (so your current saved config carries over if hosted on the same domain)
- Default-features migration that backfills missing `info` fields
- Reset to defaults
- Drag-to-reorder in admin (HTML5 drag API, no library)
- Mobile-responsive layout

## Technical notes

- **CSS**: hand-written, ~150 lines. Re-uses your current red/dark brand colors as CSS custom properties (`--brand-red`, `--brand-dark`). No Tailwind, no preprocessor.
- **JS**: ~300 lines of vanilla ES2020. One `render()` function per view, event delegation for checkboxes/clicks. No framework, no bundler.
- **Popups**: native `<dialog>` element (supported everywhere now) for the info modals — no library needed.
- **Icons**: inline SVGs for the few icons (trash, grip, plus, arrow) — copy the Lucide paths directly.
- **No build**: open the `.html` file in a browser, it works. No `npm`, no Vite.

## What I'd produce

A new folder `vanilla/` in this project containing:

```
vanilla/
  comparison.html      ← single-file embed (everything inlined)
  comparison.split/    ← optional split version
    index.html
    styles.css
    app.js
```

The existing React app stays untouched so you can keep iterating on either.

## Open questions before I build

1. **Single file or split files?** Single is easiest for a CMS paste; split is easier to edit later.
2. **Admin: same page (`#admin` hash) or separate `admin.html` file?** Hash is simpler; separate file is cleaner if you want to gate it behind a different CMS page.
3. **Anything to drop?** The drag-to-reorder in admin adds ~50 lines — keep it, or replace with up/down arrow buttons (simpler code)?
