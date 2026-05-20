## Goal

Make this app deployable as static files on GitHub Pages (a static-only host), while keeping development in Lovable.

## Approach

Replace the TanStack Start (SSR/Cloudflare Worker) setup with a plain Vite + React SPA build using TanStack Router with **hash history**. All routes (`/`, `/admin`) will work via `/#/` URLs, no server needed. Data already lives in `localStorage`, so no backend is required.

## Changes

1. **Switch router to SPA + hash history**
   - Replace file-based routing config to use `createHashHistory()` in `src/router.tsx`.
   - Keep current route files (`index.tsx`, `admin.tsx`) — only the entry/bootstrap changes.

2. **New client entry**
   - Add `index.html` at project root and `src/main.tsx` that mounts `<RouterProvider />` into `#root`.
   - Move `<head>` metadata into `index.html` (title, description, viewport).

3. **Replace Vite config**
   - New `vite.config.ts` using `@vitejs/plugin-react` + `@tanstack/router-plugin` (no `@lovable.dev/vite-tanstack-config`, no Cloudflare plugin, no SSR).
   - Set `base: './'` so assets resolve under any GitHub Pages subpath (e.g., `username.github.io/repo/`).

4. **Remove SSR/Worker pieces**
   - Delete `src/server.ts`, `src/start.ts`, `wrangler.jsonc`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`.
   - Remove `@cloudflare/vite-plugin`, `@tanstack/react-start`, `@lovable.dev/vite-tanstack-config` from `package.json`.

5. **GitHub Pages deployment**
   - Add `.github/workflows/deploy.yml` that runs `bun install` + `bun run build` and publishes `dist/` to the `gh-pages` branch via `actions/deploy-pages`.
   - Add `public/.nojekyll` to prevent Jekyll processing.
   - Hash routing means no `404.html` redirect hack is needed.

6. **Docs**
   - Add a short `README.md` section: push to GitHub → enable Pages (Source: GitHub Actions) → site lives at `https://<user>.github.io/<repo>/`.

## Notes

- Lovable preview will continue to work because it's still a Vite app.
- URLs become `https://yoursite/#/admin` instead of `/admin`. Bookmarks/links keep working.
- No data loss: features are stored in the browser's localStorage per visitor.
- This is a one-way migration away from SSR. If you later want server features (auth, shared DB), you'd need to move off GitHub Pages.
