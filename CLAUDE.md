# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

`PROMPT.md` is the source of truth for scope, roles, and design tokens — read it before feature work. Of its four setup tasks, **1–4 are done**: scaffold, design system, DB schema + mock data, and the student dashboard / curriculum screens. On top of that, **every student screen PROMPT.md lists now exists** (dashboard, curriculum, assignments, support chat, certificate) and the four admin screens (roster, grading, curriculum CMS, announcements) exist as **read-only base UI**.

Still unbuilt:

- **Auth** — Supabase packages are installed but nothing is wired: no client helper, no `.env`, no middleware. `lib/session.ts` is the seam; it hard-codes the logged-in student as 花山 美咲 (`DEMO_STUDENT_ID`, progress 75%) and the logged-in admin as RIKA (`DEMO_ADMIN_ID`). There is no role guard on `/admin/*` yet — anyone can open it.
- **Every write path.** Both views read from `lib/mock` and every form is appearance-only: inputs are uncontrolled, all buttons are `type="button"`, and 提出 / 送信 / reorder / 編集 / 配信 do nothing. `components/mock-form.tsx` holds the shared field, select, and "not wired yet" notice. Each of those forms is where a Server Action goes.
- **Admin chat** — PROMPT.md also lists per-student chat for the admin side; the student half is built (`/support`) and the mock threads and `getMessageThreads()` / `getUnreadCount()` helpers exist, but the admin surface today is only an unread count on the roster.

Because the demo student (花山 美咲) has no certificate, `/certificate` renders its locked state by default. The issued state is real, not dead code — point `CURRENT_STUDENT_ID` at `USER_IDS.ayumi` to see it. Same trick exercises the approved-assignment and closed-thread branches.

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
- shadcn/ui, `base-nova` style. **These components are built on `@base-ui/react`, not Radix** — so they take a `render` prop (not `asChild`) for polymorphism, e.g. `<Badge render={<span />} />`. Add components with `npx shadcn@latest add <name>`.
  - **Do not put a link inside `Button`'s `render`.** Base UI's Button enforces button semantics: an `<a>` there gets `role="button"` and logs a dev-console `nativeButton` error. Use `components/ui/button-link.tsx` (`<ButtonLink href="…">`), which is `next/link` styled with `buttonVariants`. `nativeButton={false}` is only for non-interactive tags like `<div>`.
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
| `lib/format.ts` | JST-fixed date / time / duration / playback-position formatting |
| `app/(student)/` | Student route group: shared header+footer layout, `dashboard`, `curriculum`, `curriculum/[lessonId]`, `assignments`, `assignments/[assignmentId]`, `support`, `certificate` |
| `app/(admin)/` | Admin route group. Pages live under `admin/` inside it (`/admin/students`, `/admin/submissions`, `/admin/curriculum`, `/admin/announcements`) because a bare `/curriculum` would collide with the student route; `/admin` itself redirects to the roster. |
| `components/student/` | Student-view pieces (header, lesson row, sidebar, media placeholders, completion button, badges, submission form/feedback/file, chat bubbles, certificate card) |
| `components/admin/` | Admin-view pieces (its own header nav, page header, stat tiles, status badges, lesson editor row). Reuses `SubmissionStatusBadge`, `LESSON_TYPE_META` and `SUBMISSION_KIND_META` from `components/student/` rather than duplicating them — those modules are presentational and role-neutral. |
| `components/mock-form.tsx` | The appearance-only field / select / "not wired yet" notice, shared by both views' forms |
| `components/ui/` | shadcn primitives |

Pages are server components that call `lib/mock` helpers directly. Keep that shape — it's what makes the Supabase migration a change to the helpers rather than to the screens.

Placeholders to be aware of:

- Lesson completion (`components/student/lesson-complete-button.tsx`) is client-local `useState` only; it doesn't persist. It should become a Server Action + `revalidatePath`.
- `video_url` / `pdf_url` / `file_url` in the mock data are dummy CDN or Storage paths, so `components/student/lesson-media.tsx` and `submission-file.tsx` draw styled placeholders instead of a real `<video>` / download. Replace the inner surface once Storage signed URLs exist; the outer layout can stay.
- Every student page is a server component, so the chat and submission forms are plain `<form>`s with no `"use client"` anywhere. Keep it that way until a Server Action actually needs client state.

## Design system

Warm, soft, hand-drawn feel — rounded cards (`rounded-2xl`), generous whitespace. The palette below is already defined in `globals.css` as `--brand-*` custom properties and exposed as `bg-brand-pink`, `text-brand-sage`, etc.; the shadcn semantic tokens (`--primary`, `--accent`, …) are mapped onto it.

| Role | Values | Utility |
| --- | --- | --- |
| Primary pink | `#E8A5B8` / `#FCE7F0` | `brand-pink` / `brand-pink-soft` |
| Accent sage | `#8DA399` / `#D8E2DC` | `brand-sage` / `brand-sage-soft` |
| Base off-white | `#FAF8F5` | `brand-cream` |

`--radius` is `0.875rem`, and the `radius-*` scale is derived from it — so `rounded-2xl` follows the brand radius rather than Tailwind's default. Pass `className="rounded-2xl"` on `Card` (its own default is `rounded-xl`).

The two views share this palette but lean on different halves of it, so a screenshot is unambiguous: the student view leads with pink (`bg-brand-pink-soft` header nav and highlights), the admin view with sage (white header bar over a `bg-brand-sage` rule, `bg-brand-sage-soft` active nav) and a wider `max-w-6xl` shell against the student `max-w-5xl`.

Within the student view the same pink/sage split marks *who is speaking*: the student's own chat bubbles and submissions are pink, the instructor's replies and feedback panels are sage or white. `components/student/chat-message.tsx` is where that lives.

The student header nav carries five items, so it reflows: below `sm` the nav wraps onto its own row with visible labels; from `sm` to `lg` it sits inline and the labels go `sr-only`; at `lg` they come back. Adding a sixth item means re-checking those three states.

UI text is Japanese throughout, including page metadata and the 404.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
