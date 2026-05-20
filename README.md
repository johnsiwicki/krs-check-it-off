# Klaus Roofing Comparison

Static SPA built with Vite + React + TanStack Router (hash history). All data is stored locally in the browser, so no backend is required.

## Develop

```
bun install
bun run dev
```

Open http://localhost:8080.

Admin panel: http://localhost:8080/#/admin

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically.
4. Your site will be live at `https://<your-username>.github.io/<repo>/`.
   - Home: `…/#/`
   - Admin: `…/#/admin`

Hash-based routes (`#/admin`) are used so refreshes and deep links work without server-side routing.
