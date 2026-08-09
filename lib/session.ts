/**
 * ログイン中のユーザーを Cookie から読むセッション層。
 *
 * いまは Cookie に `<role>:<userId>` を入れているだけのモックで、パスワードの
 * 検証は行っていない（ログイン画面でモックのプロフィールを選ぶ方式）。
 *
 * === Supabase Auth 差し替えポイント ===
 * `getSessionProfile()` の中身を次に置き換えるだけでよい。呼び出し側
 * （レイアウト・各ページ）はすでに非同期で待っているので変更不要。
 *
 *   const supabase = await createServerSupabaseClient();   // @supabase/ssr
 *   const { data: { user } } = await supabase.auth.getUser();
 *   if (!user) return null;
 *   const { data: profile } = await supabase
 *     .from("profiles")
 *     .select("*")
 *     .eq("id", user.id)
 *     .single();
 *   return profile;
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/mock";
import { SESSION_COOKIE, parseSession } from "@/lib/session-cookie";
import type { ProfileRow } from "@/types/database";

/** ログイン中のプロフィール。未ログイン、または Cookie が壊れていれば null。 */
export async function getSessionProfile(): Promise<ProfileRow | null> {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) return null;

  const profile = getProfile(session.userId);

  // Cookie のロールと実際のプロフィールが食い違うものは信用しない
  // （Supabase では JWT の署名検証がこの役目を果たす）。
  if (!profile || profile.role !== session.role) return null;

  return profile;
}

/**
 * ログイン中の受講生。
 *
 * proxy.ts でも振り分けているが、Server Component 側でも必ず確かめる。
 * Server Function は UI を経由せず直接叩けるため、入口の防御だけに頼らない。
 */
export async function getCurrentStudent(): Promise<ProfileRow> {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "student") redirect("/admin");

  return profile;
}

/** ログイン中の管理者（講師）。 */
export async function getCurrentAdmin(): Promise<ProfileRow> {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  return profile;
}

/** 「花山 美咲」→「花山」。アバターのフォールバックや挨拶文に使う。 */
export function getFamilyName(profile: ProfileRow): string {
  return profile.full_name.split(/\s+/)[0] ?? profile.full_name;
}
