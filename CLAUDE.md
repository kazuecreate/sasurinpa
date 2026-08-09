# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

`PROMPT.md` is the source of truth for scope, roles, and design tokens — read it before feature work. Of its four setup tasks, **1–4 are done**: scaffold, design system, DB schema + mock data, and the student dashboard / curriculum screens.

Still unbuilt:

- **Auth** — Supabase packages are installed but nothing is wired: no client helper, no `.env`, no middleware. `lib/session.ts` is the seam; it currently hard-codes the logged-in student as 花山 美咲 (`DEMO_STUDENT_ID`, progress 75%).
- **Student screens beyond curriculum** — assignment upload, certificate page, support chat. The dashboard *displays* assignment status and announcements inline, but there are no dedicated routes.
- **All admin/instructor screens** — roster, curriculum CMS, grading, announcements.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build (also typechecks)
npm run start   # serve the production build
npm run lint    # eslint (flat config, next core-web-vitals + typescript)
npx tsc --noEmit  # typecheck; there is no `typecheck` script
```

No test runner is configured. If tests are needed, pick and set up a framework first rather than assuming one exists.

## Stack

- Next.js 16 App Router (Turbopack), React 19, TypeScript strict mode
- Tailwind CSS v4 — configured purely through PostCSS (`@tailwindcss/postcss`) and the `@theme inline` block in `app/globals.css`. There is **no `tailwind.config.js`**; add design tokens as CSS custom properties in `globals.css` and expose them via `@theme inline`, not via a JS config.
- shadcn/ui, `base-nova` style. **These components are built on `@base-ui/react`, not Radix** — so they take a `render` prop (not `asChild`) for polymorphism, e.g. `<Button render={<Link href="…">…</Link>} />`. Add components with `npx shadcn@latest add <name>`.
- Lucide icons.
- Dark mode is deliberately disabled: `globals.css` rebinds `@custom-variant dark` to a never-matching `.dark` ancestor so shadcn's leftover `dark:` utilities can't fire from the OS setting. Don't add a dark palette.
- Font is M PLUS Rounded 1c via `next/font/google`, loaded with `preload: false` and **no `subsets`** — passing `subsets` would drop the Japanese glyphs. Don't "fix" that.
- `@/*` path alias maps to the repo root (`@/app/...`, `@/lib/...`).
- `LayoutProps<"/">` / `PageProps<"/curriculum/[lessonId]">` are Next.js 16 globally-generated types (from `.next/types`), not local imports. Route-group segments like `(student)` do **not** appear in those path strings.

## Layout of the code

| Path | What's there |
| --- | --- |
| `supabase/migrations/` | The real DDL: schema, RLS policies, storage buckets |
| `types/database.ts` | Hand-written row types mirroring that DDL — update both together until `supabase gen types` replaces it |
| `lib/mock/` | Mock rows (`ids.ts` holds every fixed UUID) plus the read helpers in `index.ts`. Helpers return the same shapes a Supabase query would, so swapping in real queries should not change callers. |
| `lib/session.ts` | The auth seam described above |
| `lib/format.ts` | JST-fixed date / duration / playback-position formatting |
| `app/(student)/` | Student route group: shared header+footer layout, `dashboard`, `curriculum`, `curriculum/[lessonId]` |
| `components/student/` | Student-view pieces (header, lesson row, sidebar, media placeholders, completion button, badges) |
| `components/ui/` | shadcn primitives |

Pages are server components that call `lib/mock` helpers directly. Keep that shape — it's what makes the Supabase migration a change to the helpers rather than to the screens.

Two placeholders to be aware of when working on the lesson viewer:

- Lesson completion (`components/student/lesson-complete-button.tsx`) is client-local `useState` only; it doesn't persist. It should become a Server Action + `revalidatePath`.
- `video_url` / `pdf_url` in the mock data are dummy CDN URLs, so `components/student/lesson-media.tsx` draws a styled placeholder instead of a real `<video>` / download. Replace the inner surface once Storage signed URLs exist; the outer layout can stay.

## Design system

Warm, soft, hand-drawn feel — rounded cards (`rounded-2xl`), generous whitespace. The palette below is already defined in `globals.css` as `--brand-*` custom properties and exposed as `bg-brand-pink`, `text-brand-sage`, etc.; the shadcn semantic tokens (`--primary`, `--accent`, …) are mapped onto it.

| Role | Values | Utility |
| --- | --- | --- |
| Primary pink | `#E8A5B8` / `#FCE7F0` | `brand-pink` / `brand-pink-soft` |
| Accent sage | `#8DA399` / `#D8E2DC` | `brand-sage` / `brand-sage-soft` |
| Base off-white | `#FAF8F5` | `brand-cream` |

`--radius` is `0.875rem`, and the `radius-*` scale is derived from it — so `rounded-2xl` follows the brand radius rather than Tailwind's default. Pass `className="rounded-2xl"` on `Card` (its own default is `rounded-xl`).

UI text is Japanese throughout, including page metadata and the 404.
