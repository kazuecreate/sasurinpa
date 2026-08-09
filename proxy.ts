/**
 * ルーティングの入口でセッションを見て振り分ける。
 *
 * Next.js 16 で `middleware.ts` は `proxy.ts` に改名された（機能は同じ）。
 * 参照: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * 振り分けは3つだけ:
 *   1. 未ログイン           → /login（開こうとしていたパスは next に持たせる）
 *   2. ログイン済みで /login, /signup → ロールごとのホーム
 *   3. 受講生が /admin 配下  → /dashboard
 *
 * ここは入口の交通整理であって、認可の最終防衛線ではない。
 * 実際の確認は `lib/session.ts` の getCurrentStudent / getCurrentAdmin が行う。
 *
 * === Supabase Auth 差し替えポイント ===
 * `@supabase/ssr` の `createServerClient` を request/response の Cookie に繋いで
 * `await supabase.auth.getUser()` を呼び、セッションの更新も同時に行う。
 * その戻り値でロールを判定すれば、以下の分岐はそのまま使える。
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, parseSession } from "@/lib/session-cookie";

const AUTH_PATHS = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (!session) {
    if (isAuthPath) return NextResponse.next();

    const loginUrl = new URL("/login", request.url);
    // ログイン後に元のページへ戻せるよう、パスだけを持ち回る。
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  const home = session.role === "admin" ? "/admin" : "/dashboard";

  if (isAuthPath) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (session.role === "student" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 静的アセットまで巻き込むと CSS / 画像が落ちるので除外する。
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
