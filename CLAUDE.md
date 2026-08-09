# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This repo is currently an unmodified `create-next-app` scaffold (`app/page.tsx` and `app/layout.tsx` are still the generated defaults). The real product is specified in `PROMPT.md` and has not been built yet — read `PROMPT.md` before doing feature work; it is the source of truth for scope, roles, and design tokens.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint (flat config, next core-web-vitals + typescript)
npx tsc --noEmit  # typecheck; there is no `typecheck` script
```

No test runner is configured. If tests are needed, pick and set up a framework first rather than assuming one exists.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict mode
- Tailwind CSS v4 — configured purely through PostCSS (`@tailwindcss/postcss`) and the `@theme inline` block in `app/globals.css`. There is **no `tailwind.config.js`**; add design tokens as CSS custom properties in `globals.css` and expose them via `@theme inline`, not via a JS config.
- `@/*` path alias maps to the repo root (`@/app/...`, `@/lib/...`).
- `LayoutProps<"/">` / `PageProps<...>` in `app/layout.tsx` are Next.js 16 globally-generated types (from `.next/types`), not local imports.

## Product spec (from PROMPT.md)

"さすりんぱ" — a Web/PWA instructor-certification course app. Two roles with distinct views:

- **Student**: dashboard with progress, chaptered video/text curriculum with completion flags, assignment upload + instructor feedback, digital certificate unlocked on completion, support chat.
- **Admin/Instructor**: student roster and progress, curriculum CMS (add/edit/reorder lessons), assignment grading, announcements.

Planned backend is Supabase (Auth, Postgres, Storage, Realtime); planned UI kit is shadcn/ui + Lucide. None of these are installed yet — installing them is part of the remaining setup, along with the schema (`users`, `courses`, `lessons`, `progress`, `assignments`, `submissions`, `messages`) and mock data.

UI is Japanese-facing. Note `app/layout.tsx` still has `lang="en"` and default create-next-app metadata; both need updating when real pages land.

## Design system

Warm, soft, hand-drawn feel — rounded cards (`rounded-2xl`), generous whitespace.

| Role | Values |
| --- | --- |
| Primary pink | `#FCE7F0` / `#E8A5B8` |
| Accent sage | `#D8E2DC` / `#8DA399` |
| Base off-white | `#FAF8F5` |

The scaffold's `globals.css` still carries the default black/white palette plus a `prefers-color-scheme: dark` block and an `Arial` body font — replace these with the palette above rather than layering on top of them.
