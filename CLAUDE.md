# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

`PROMPT.md` is the source of truth for scope, roles, and design tokens — read it before feature work. Of its four setup tasks, **1–4 are done**: scaffold, design system, DB schema + mock data, and the student dashboard / curriculum screens. On top of that, **every student screen PROMPT.md lists now exists** (dashboard, curriculum, assignments, support chat, certificate) and the four admin screens (roster, grading, curriculum CMS, announcements) exist as **read-only base UI**.

**Session routing is real; password auth is not.** `/login` lists the mock profiles and a Server Action writes `sasurinpa_session=<role>:<userId>` (HttpOnly, SameSite=lax, 7 days). `proxy.ts` sends anonymous visitors to `/login`, bounces students out of `/admin/*`, and keeps logged-in users off the auth pages; `getCurrentStudent()` / `getCurrentAdmin()` re-check on every render so a forged cookie can't get through by skipping the proxy. Log in as a different profile to exercise other data states — 小林 あゆみ is the graduate (certificate, all課題 approved, closed chat thread), 田中 ゆかり is at 50%.

Still unbuilt:

- **Password auth** — Supabase packages are installed but no client helper and no `.env`. The swap points are commented in `lib/session.ts`, `lib/auth-actions.ts`, `lib/session-cookie.ts`, `proxy.ts`, and both auth pages. The email/password fields on `/login` and the whole `/signup` form are appearance-only.
- **Every other write path.** Apart from login/logout, both views read from `lib/mock` and every form is appearance-only: inputs are uncontrolled, buttons are `type="button"`, and 提出 / 送信 / reorder / 編集 / 配信 do nothing. `components/mock-form.tsx` holds the shared field, select, and "not wired yet" notice.
- **Admin chat** — PROMPT.md also lists per-student chat for the admin side; the student half is built (`/support`) and the mock threads and `getMessageThreads()` / `getUnreadCount()` helpers exist, but the admin surface today is only an unread count on the roster.
- **Impersonation** — the admin header used to link to `/dashboard`; role routing made that a redirect loop, so it's gone. Previewing the student view needs real impersonation.

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
- `LayoutProps<"/">` / `PageProps<"/curriculum/[lessonId]">` are Next.js 16 globally-generated types (from `.next/types`), not local imports. Route-group segments like `(student)` do **not** appear in those path strings. After adding a route, run `npx next typegen` or `tsc` will fail on a `PageProps` path it hasn't generated yet.
- **`middleware.ts` is deprecated in Next 16 and renamed to `proxy.ts`** — same API, exported as `proxy`. Don't add a `middleware.ts` back; see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- `cookies()` is async and read-only during render. Writes (login/logout) have to happen in a Server Action or Route Handler — that's why `lib/auth-actions.ts` exists. Reading it makes a route dynamic, so every authenticated page is `ƒ` in the build output; only `/signup` and `/_not-found` stay static.
- Server Actions are CSRF-guarded by comparing the request's `Origin` against `x-forwarded-host`/`host`; a mismatch aborts with "Invalid Server Actions request." (E80). **Any port forwarding breaks this**, and which side looks wrong depends on how you opened the app — via the Codespaces URL the `Origin` is `<codespace>-3000.app.github.dev`, via VS Code's local forwarding it's `localhost:3000` while `x-forwarded-host` is the tunnel's. `next.config.ts` therefore allows both families in development only (`NODE_ENV === "development"`, so `next build` emits no `serverActions` config at all — a production build prints no `Experiments` line).
  - The check tests the **`Origin`** against `allowedOrigins`, not the host, so listing the origins you actually browse from is what fixes it.
  - **Ports must be enumerated.** `localhost:*` silently never matches: the matcher (`csrf-protection.js`) wildcards per dot-separated DNS label, and the compared value includes the port, so `localhost:*` only matches a host literally named that. Verified with `isCsrfOriginAllowed`. Don't use `*.app.github.dev` either — it would let any Codespace post actions here.
- Testing a Server Action outside a browser needs a matching `Origin` header too. The no-JS path works: multipart POST to the page URL with the `$ACTION_ID_…` field from the rendered form (URL-encoded bodies are rejected).

## Layout of the code

| Path | What's there |
| --- | --- |
| `supabase/migrations/` | The real DDL: schema, RLS policies, storage buckets |
| `types/database.ts` | Hand-written row types mirroring that DDL — update both together until `supabase gen types` replaces it |
| `lib/mock/` | Mock rows (`ids.ts` holds every fixed UUID) plus the read helpers in `index.ts`. Helpers return the same shapes a Supabase query would, so swapping in real queries should not change callers. |
| `proxy.ts` | Route-level session routing (Next 16's `middleware.ts`) |
| `lib/session.ts` | Reads the session cookie → `ProfileRow`; `getCurrentStudent` / `getCurrentAdmin` redirect when the role doesn't match |
| `lib/session-cookie.ts` | Cookie name, options, and `<role>:<userId>` encode/parse. Deliberately free of `next/headers` and React so `proxy.ts` can import it |
| `lib/auth-actions.ts` | `login` / `logout` Server Actions (the only wired-up writes in the app) |
| `lib/format.ts` | JST-fixed date / time / duration / playback-position formatting |
| `app/(student)/` | Student route group: shared header+footer layout, `dashboard`, `curriculum`, `curriculum/[lessonId]`, `assignments`, `assignments/[assignmentId]`, `support`, `certificate` |
| `app/(auth)/` | `login` and `signup`, on a centered card layout with no header nav |
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

**The student view runs a softer variant of that scale.** `app/(student)/layout.tsx` sets `data-view="student"` on its root, and `globals.css` re-declares three things inside that scope only (admin and the auth pages are untouched): `--radius` drops to `0.7rem` so `rounded-2xl` ≈ 20px and `rounded-xl` ≈ 16px, matching `docs/design-reference.png`; `--card-spacing` goes to `1.5rem` so card padding and header→content gaps are wider; and `--text-{xs,sm,base}--line-height` go to `1.9` to open up body copy. The convention that follows from it: **surfaces (cards, panels, media frames, chat bubbles) keep `rounded-2xl`, controls (buttons, inputs, nav items, small icon squares) take `rounded-xl`**, and student buttons carry `h-11 … px-5` for a 44px tap target. Because `@theme inline` compiles `rounded-*` to `calc(var(--radius) * n)`, and because `leading-*` sets `--tw-leading` (which wins over the `--text-*--line-height` default), both overrides work by cascade — an explicit `leading-7` or `rounded-full` in JSX still does what it says. The `--card-spacing` rule has to sit **outside `@layer`** to beat the utility `Card` puts on itself.

Colours and component structure are deliberately identical between the two views; only radius, spacing and type weight differ. Headings in the student view are `font-medium`, not `font-bold` — the font loads 400/500/700 only, so `font-semibold` would jump straight to 700.

The two views share this palette but lean on different halves of it, so a screenshot is unambiguous: the student view leads with pink (`bg-brand-pink-soft` header nav and highlights), the admin view with sage (white header bar over a `bg-brand-sage` rule, `bg-brand-sage-soft` active nav) and a wider `max-w-6xl` shell against the student `max-w-5xl`.

Within the student view the same pink/sage split marks *who is speaking*: the student's own chat bubbles and submissions are pink, the instructor's replies and feedback panels are sage or white. `components/student/chat-message.tsx` is where that lives.

The student header nav carries five items, so it reflows: below `sm` the nav wraps onto its own row with visible labels; from `sm` to `lg` it sits inline and the labels go `sr-only`; at `lg` they come back. Adding a sixth item means re-checking those three states.

UI text is Japanese throughout, including page metadata and the 404.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
