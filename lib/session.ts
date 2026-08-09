/**
 * 認証を実装するまでの暫定セッション。
 *
 * 現時点ではログイン中の受講生を「花山 美咲」、
 * ログイン中の管理者（講師）を「RIKA」に固定している。
 * Supabase Auth を繋いだあとは、この関数の中身を
 * `supabase.auth.getUser()` + `profiles` の取得に差し替えるだけでよい。
 */

import { DEMO_ADMIN_ID, DEMO_STUDENT_ID, getProfile } from "@/lib/mock";
import type { ProfileRow } from "@/types/database";

export const CURRENT_STUDENT_ID = DEMO_STUDENT_ID;
export const CURRENT_ADMIN_ID = DEMO_ADMIN_ID;

function requireProfile(userId: string, label: string): ProfileRow {
  const profile = getProfile(userId);

  if (!profile) {
    throw new Error(`${label}プロフィールが見つかりません: ${userId}`);
  }

  return profile;
}

/** ログイン中の受講生。認証接続後は非同期になる想定。 */
export function getCurrentStudent(): ProfileRow {
  return requireProfile(CURRENT_STUDENT_ID, "受講生");
}

/** ログイン中の管理者（講師）。認証接続後は非同期になる想定。 */
export function getCurrentAdmin(): ProfileRow {
  return requireProfile(CURRENT_ADMIN_ID, "管理者");
}

/** 「花山 美咲」→「花山」。アバターのフォールバックや挨拶文に使う。 */
export function getFamilyName(profile: ProfileRow): string {
  return profile.full_name.split(/\s+/)[0] ?? profile.full_name;
}
