"use server";

/**
 * ログイン・ログアウトの Server Action。
 *
 * Cookie の書き込みは Server Function か Route Handler でしか行えないため、
 * ここに集約している。いまはパスワードを一切見ておらず、渡された userId の
 * プロフィールをそのままセッションに入れるだけのモック。
 *
 * === Supabase Auth 差し替えポイント ===
 * - login   → `supabase.auth.signInWithPassword({ email, password })`
 * - logout  → `supabase.auth.signOut()`
 * - signup  → `supabase.auth.signUp()` ＋ `profiles` への行追加
 *   （いずれも Cookie の管理は @supabase/ssr の createServerClient に任せる）
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/mock";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  encodeSession,
} from "@/lib/session-cookie";
import type { UserRole } from "@/types/database";

function homeFor(role: UserRole): string {
  return role === "admin" ? "/admin" : "/dashboard";
}

/**
 * ログイン後の遷移先を決める。
 *
 * `next` は proxy が付けた「元々開こうとしていたページ」。外部 URL への
 * オープンリダイレクトを防ぐため、アプリ内の絶対パスで、かつロールが
 * 立ち入れる範囲のものだけを許可する。
 */
function resolveDestination(next: string, role: UserRole): string {
  const isInternal = next.startsWith("/") && !next.startsWith("//");
  if (!isInternal) return homeFor(role);

  const isAdminPath = next.startsWith("/admin");
  if (isAdminPath !== (role === "admin")) return homeFor(role);

  return next;
}

/**
 * 選ばれたプロフィールとしてログインする。
 *
 * Supabase 接続後は formData の email / password を
 * `signInWithPassword` に渡す形になり、userId を受け取るのはやめる。
 */
export async function login(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const profile = getProfile(userId);

  if (!profile) {
    redirect("/login?error=unknown-user");
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    encodeSession({ role: profile.role, userId: profile.id }),
    SESSION_COOKIE_OPTIONS,
  );

  redirect(resolveDestination(String(formData.get("next") ?? ""), profile.role));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  redirect("/login");
}
