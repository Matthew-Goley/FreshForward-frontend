# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

FreshForward — the **frontend** web app for a marketplace where restaurants within MAARA list food (aimed at reducing food waste) and customers browse, purchase, and track orders. See `productscope.md` for the product vision and open questions (payments, fulfillment, and much of scope are still `TODO`).

This is an early-stage scaffold: the app currently renders a single Landing page. Most product features are not yet built.

## Commands

```bash
npm install       # install deps
npm run dev       # start Vite dev server (HMR)
npm run build     # type-check (tsc -b) then production build to dist/
npm run lint      # ESLint over the repo
npm run preview   # serve the built dist/ locally
```

There is no test runner configured yet. `npm run build` is the gate that catches type errors — run it before committing non-trivial changes.

## Workflow (from README — enforced)

**Never push directly to `main`.** Every change goes through a branch + Pull Request:

```bash
git checkout main && git pull
git checkout -b yourname/description
# ...code...
git commit -m "clear description of change"
git push -u origin yourname/description
```

Then open a PR on GitHub and get it reviewed before merging.

## Architecture & conventions

- **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7.
- **Entry flow:** `src/main.tsx` (mounts `<App>` in `<StrictMode>`) → `src/App.tsx` (declares `<BrowserRouter>` + routes) → page components in `src/pages/`. Add new pages under `src/pages/` and register them as `<Route>`s in `App.tsx`.
- **Tailwind v4:** configured via the `@tailwindcss/vite` plugin (in `vite.config.ts`), not a `tailwind.config.js`. Global styles live in `src/index.css`, which is just `@import "tailwindcss";`. Style with utility classes in JSX.
- **TypeScript** is strict about unused code (`noUnusedLocals`, `noUnusedParameters`) and uses `verbatimModuleSyntax` — use `import type { ... }` for type-only imports or the build will fail.
- Project references split TS config: `tsconfig.app.json` (app under `src/`) and `tsconfig.node.json` (Vite config). `dist/` is git-ignored and ESLint-ignored.
