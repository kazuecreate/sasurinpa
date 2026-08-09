import type { AnnouncementRow, CertificateRow } from "@/types/database";
import { COURSE_ID, USER_IDS } from "./ids";

/**
 * published_at の降順、is_pinned が先頭に来る想定。
 * published_at が null のものは下書き（管理画面にだけ出る）。
 */
export const mockAnnouncements: AnnouncementRow[] = [
  {
    id: "50000000-0000-4000-8000-000000000005",
    title: "秋のブラッシュアップ講座（仮）",
    body: "10月にサロン向けのブラッシュアップ講座を予定しています。日程と会場が確定しましたら、あらためてご案内します。ご希望の地域があればチャットでお知らせください。",
    audience: "all",
    is_pinned: false,
    published_at: null,
    author_id: USER_IDS.rika,
    created_at: "2026-08-09T09:20:00+09:00",
    updated_at: "2026-08-09T09:35:00+09:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000001",
    title: "【重要】9月フォローアップ勉強会のご案内",
    body: "9月21日（月・祝）13:00より、オンラインでフォローアップ勉強会を開催します。部位別アプローチの復習と、参加者からのご質問にお答えする時間を設けます。参加費は無料です。前日までにチャットよりお申し込みください。",
    audience: "all",
    is_pinned: true,
    published_at: "2026-08-05T10:00:00+09:00",
    author_id: USER_IDS.rika,
    created_at: "2026-08-05T09:50:00+09:00",
    updated_at: "2026-08-05T10:00:00+09:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    title: "チタニウムプレート追加ロットの受付を開始しました",
    body: "在庫切れとなっておりましたチタニウムプレート（Mサイズ）の受付を再開しました。受講生価格でご案内できますので、ご希望の方はサポートチャットよりご連絡ください。お届けは9月上旬を予定しています。",
    audience: "students",
    is_pinned: false,
    published_at: "2026-07-28T12:00:00+09:00",
    author_id: USER_IDS.rika,
    created_at: "2026-07-28T11:40:00+09:00",
    updated_at: "2026-07-28T12:00:00+09:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    title: "卒業生向け：認定講師ページ掲載申請について",
    body: "公式サイトの「認定講師をさがす」ページへの掲載申請を受け付けています。サロン名・所在地・ご連絡先をチャットよりお送りください。認定IDをお持ちの方が対象です。",
    audience: "graduates",
    is_pinned: false,
    published_at: "2026-07-10T15:00:00+09:00",
    author_id: USER_IDS.rika,
    created_at: "2026-07-10T14:30:00+09:00",
    updated_at: "2026-07-10T15:00:00+09:00",
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    title: "夏季休業期間のサポート受付について",
    body: "8月13日〜8月16日はサポートチャットのお返事をお休みします。課題の提出はいつでも可能ですが、添削の再開は8月17日以降となります。ご了承ください。",
    audience: "all",
    is_pinned: false,
    published_at: "2026-06-20T09:00:00+09:00",
    author_id: USER_IDS.rika,
    created_at: "2026-06-20T08:45:00+09:00",
    updated_at: "2026-06-20T09:00:00+09:00",
  },
];

/** 修了者にのみ存在する。存在＝認定証画面の解放条件。 */
export const mockCertificates: CertificateRow[] = [
  {
    id: "60000000-0000-4000-8000-000000000001",
    user_id: USER_IDS.ayumi,
    course_id: COURSE_ID,
    certificate_no: "SRP-2026-0001",
    recipient_name: "小林 あゆみ",
    instructor_name: "RIKA",
    issued_at: "2026-08-01T15:00:00+09:00",
    created_at: "2026-08-01T15:00:00+09:00",
  },
];
