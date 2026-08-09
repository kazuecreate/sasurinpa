/**
 * セッション Cookie の名前・書式・オプション。
 *
 * proxy.ts からも読むため、このモジュールは `next/headers` や React に依存しない
 * 純粋な関数だけで構成する（proxy は独立して動く前提のため、共有の状態を持ち込まない）。
 *
 * 値は `<role>:<userId>` の形。ロールを値に含めているのは、proxy が
 * プロフィールを引かずにロールで振り分けられるようにするため。
 *
 * === Supabase Auth 差し替えポイント ===
 * このファイルごと不要になる。Cookie の管理は `@supabase/ssr` の
 * `createServerClient` が持ち、ロールは JWT のクレーム
 * （`app_metadata.role` もしくは `profiles.role` の参照）で判定する。
 */

import type { UserRole } from "@/types/database";

export const SESSION_COOKIE = "sasurinpa_session";

export type Session = {
  role: UserRole;
  userId: string;
};

/**
 * Cookie の付与オプション。
 * Supabase Auth では同等の設定を `createServerClient` の `cookies` オプションで渡す。
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  // 7日間。Supabase ではリフレッシュトークンの寿命がこれに相当する。
  maxAge: 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === "production",
} as const;

function isUserRole(value: string | undefined): value is UserRole {
  return value === "student" || value === "admin";
}

export function encodeSession(session: Session): string {
  return `${session.role}:${session.userId}`;
}

/** 壊れた値・知らないロールは「未ログイン」として扱う。 */
export function parseSession(value: string | undefined): Session | null {
  if (!value) return null;

  const separatorIndex = value.indexOf(":");
  if (separatorIndex === -1) return null;

  const role = value.slice(0, separatorIndex);
  const userId = value.slice(separatorIndex + 1);

  if (!isUserRole(role) || userId === "") return null;

  return { role, userId };
}
