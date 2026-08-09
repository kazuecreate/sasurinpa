import type { MessageRow, MessageThreadRow } from "@/types/database";
import { THREAD_IDS, USER_IDS } from "./ids";

/** 受講生1人 ↔ 運営・講師 のスレッド。last_message_at の降順で表示する想定。 */
export const mockMessageThreads: MessageThreadRow[] = [
  {
    id: THREAD_IDS.yukari,
    student_id: USER_IDS.yukari,
    subject: "課題1の撮影について",
    last_message_at: "2026-08-08T12:20:00+09:00",
    is_closed: false,
    created_at: "2026-08-06T21:00:00+09:00",
    updated_at: "2026-08-08T12:20:00+09:00",
  },
  {
    id: THREAD_IDS.misaki,
    student_id: USER_IDS.misaki,
    subject: "サポート",
    last_message_at: "2026-08-07T22:05:00+09:00",
    is_closed: false,
    created_at: "2026-06-21T10:00:00+09:00",
    updated_at: "2026-08-07T22:05:00+09:00",
  },
  {
    id: THREAD_IDS.ayumi,
    student_id: USER_IDS.ayumi,
    subject: "開業のご相談",
    last_message_at: "2026-08-02T09:40:00+09:00",
    is_closed: true,
    created_at: "2026-08-01T20:00:00+09:00",
    updated_at: "2026-08-02T09:40:00+09:00",
  },
];

/** created_at 昇順。read_at が null のものが未読バッジの対象。 */
export const mockMessages: MessageRow[] = [
  // --- 花山 美咲 -------------------------------------------------------------
  {
    id: "40000000-0000-4000-8000-000000000001",
    thread_id: THREAD_IDS.misaki,
    sender_id: USER_IDS.misaki,
    body: "課題1のフィードバックありがとうございました。肩の力を抜くコツはありますか？",
    read_at: "2026-06-21T14:00:00+09:00",
    created_at: "2026-06-21T10:05:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    thread_id: THREAD_IDS.misaki,
    sender_id: USER_IDS.rika,
    body: "施術前に肩を2〜3回大きく回して、息を吐きながら手を置いてみてください。呼吸が止まっていると自然と力が入ってしまいます。",
    read_at: "2026-06-21T19:30:00+09:00",
    created_at: "2026-06-21T14:02:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    thread_id: THREAD_IDS.misaki,
    sender_id: USER_IDS.misaki,
    body: "課題2の再提出、今週末までに送ります。もう1名分の施術を追加すれば大丈夫でしょうか？",
    read_at: "2026-08-07T22:00:00+09:00",
    created_at: "2026-08-07T21:55:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000004",
    thread_id: THREAD_IDS.misaki,
    sender_id: USER_IDS.rika,
    body: "はい、それで大丈夫です。同じ方への3回目でも、別の方への1回目でもかまいません。焦らずどうぞ。",
    read_at: null,
    created_at: "2026-08-07T22:05:00+09:00",
  },

  // --- 小林 あゆみ -----------------------------------------------------------
  {
    id: "40000000-0000-4000-8000-000000000005",
    thread_id: THREAD_IDS.ayumi,
    sender_id: USER_IDS.ayumi,
    body: "修了ありがとうございました。自宅サロンを開くにあたって、名刺に「さすりんぱ認定講師」と書いても大丈夫でしょうか？",
    read_at: "2026-08-02T09:35:00+09:00",
    created_at: "2026-08-01T20:10:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000006",
    thread_id: THREAD_IDS.ayumi,
    sender_id: USER_IDS.rika,
    body: "もちろんです。認定ID（SRP-2026-0001）も併記していただけると、お客様の安心につながります。応援しています。",
    read_at: "2026-08-02T12:00:00+09:00",
    created_at: "2026-08-02T09:40:00+09:00",
  },

  // --- 田中 ゆかり -----------------------------------------------------------
  {
    id: "40000000-0000-4000-8000-000000000007",
    thread_id: THREAD_IDS.yukari,
    sender_id: USER_IDS.yukari,
    body: "課題の動画は、スマートフォンで撮ったものでも大丈夫ですか？三脚がなくて手持ちになってしまいます。",
    read_at: "2026-08-07T09:00:00+09:00",
    created_at: "2026-08-06T21:05:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000008",
    thread_id: THREAD_IDS.yukari,
    sender_id: USER_IDS.rika,
    body: "スマートフォンで大丈夫です。手持ちが難しければ、椅子の上に本を重ねて立てかけるだけでも十分ですよ。",
    read_at: "2026-08-08T11:50:00+09:00",
    created_at: "2026-08-07T09:05:00+09:00",
  },
  {
    id: "40000000-0000-4000-8000-000000000009",
    thread_id: THREAD_IDS.yukari,
    sender_id: USER_IDS.yukari,
    body: "ありがとうございます、先ほど提出しました！",
    read_at: null,
    created_at: "2026-08-08T12:20:00+09:00",
  },
];
