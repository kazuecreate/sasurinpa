import type { ProfileRow } from "@/types/database";
import { USER_IDS } from "./ids";

/** 講師・管理者 1名 + 受講生 3名 */
export const mockProfiles: ProfileRow[] = [
  {
    id: USER_IDS.rika,
    email: "rika@sasurinpa.example",
    full_name: "RIKA",
    furigana: "リカ",
    role: "admin",
    avatar_url: null,
    phone: "090-0000-0000",
    bio: "さすりんぱ（Sea Moon Original Method）考案者。チタニウムプレートを使った「手当」を全国に広める活動をしています。",
    created_at: "2026-03-15T10:00:00+09:00",
    updated_at: "2026-03-15T10:00:00+09:00",
  },
  {
    id: USER_IDS.misaki,
    email: "misaki.hanayama@example.com",
    full_name: "花山 美咲",
    furigana: "ハナヤマ ミサキ",
    role: "student",
    avatar_url: null,
    phone: "090-1111-2222",
    bio: "エステサロン勤務。フェムケアメニューを取り入れたくて受講しました。",
    created_at: "2026-05-07T09:12:00+09:00",
    updated_at: "2026-08-07T21:40:00+09:00",
  },
  {
    id: USER_IDS.ayumi,
    email: "ayumi.kobayashi@example.com",
    full_name: "小林 あゆみ",
    furigana: "コバヤシ アユミ",
    role: "student",
    avatar_url: null,
    phone: "080-3333-4444",
    bio: "自宅サロンを開業予定。認定講師を目指しています。",
    created_at: "2026-05-07T09:30:00+09:00",
    updated_at: "2026-08-01T15:05:00+09:00",
  },
  {
    id: USER_IDS.yukari,
    email: "yukari.tanaka@example.com",
    full_name: "田中 ゆかり",
    furigana: "タナカ ユカリ",
    role: "student",
    avatar_url: null,
    phone: null,
    bio: null,
    created_at: "2026-05-20T18:44:00+09:00",
    updated_at: "2026-08-08T12:10:00+09:00",
  },
];
