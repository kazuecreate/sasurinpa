/**
 * 認証を実装するまでの暫定セッション。
 *
 * 現時点ではログイン中の受講生を「花山 美咲」に固定している。
 * Supabase Auth を繋いだあとは、この 2 つの関数の中身を
 * `supabase.auth.getUser()` + `profiles` の取得に差し替えるだけでよい。
 */

import { DEMO_STUDENT_ID, getProfile } from "@/lib/mock";
import type { ProfileRow } from "@/types/database";

export const CURRENT_STUDENT_ID = DEMO_STUDENT_ID;

/** ログイン中の受講生。認証接続後は非同期になる想定。 */
export function getCurrentStudent(): ProfileRow {
  const profile = getProfile(CURRENT_STUDENT_ID);

  if (!profile) {
    throw new Error(`受講生プロフィールが見つかりません: ${CURRENT_STUDENT_ID}`);
  }

  return profile;
}

/** 「花山 美咲」→「花山」。アバターのフォールバックや挨拶文に使う。 */
export function getFamilyName(profile: ProfileRow): string {
  return profile.full_name.split(/\s+/)[0] ?? profile.full_name;
}
