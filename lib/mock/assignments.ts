import type { AssignmentRow, SubmissionRow } from "@/types/database";
import { ASSIGNMENT_IDS, CHAPTER_IDS, COURSE_ID, USER_IDS } from "./ids";

export const mockAssignments: AssignmentRow[] = [
  {
    id: ASSIGNMENT_IDS.strokes,
    course_id: COURSE_ID,
    chapter_id: CHAPTER_IDS.plate,
    title: "課題1：基本ストローク3種の実技動画",
    description:
      "「なでる」「流す」「ゆらす」を各1分ずつ、手元が見える角度で撮影して提出してください。服の上からで構いません。",
    submission_kind: "video",
    due_date: "2026-06-30T23:59:00+09:00",
    position: 1,
    is_published: true,
    created_at: "2026-04-06T10:00:00+09:00",
    updated_at: "2026-04-06T10:00:00+09:00",
  },
  {
    id: ASSIGNMENT_IDS.bodyPartsReport,
    course_id: COURSE_ID,
    chapter_id: CHAPTER_IDS.bodyParts,
    title: "課題2：部位別アプローチのレポート",
    description:
      "ご家族やお友達に3回施術し、相手の変化と自分の気づきを800字程度でまとめてください。",
    submission_kind: "report",
    due_date: "2026-07-31T23:59:00+09:00",
    position: 2,
    is_published: true,
    created_at: "2026-04-21T10:00:00+09:00",
    updated_at: "2026-06-18T13:35:00+09:00",
  },
  {
    id: ASSIGNMENT_IDS.graduation,
    course_id: COURSE_ID,
    chapter_id: CHAPTER_IDS.femcare,
    title: "卒業課題：60分の通し施術（動画＋レポート）",
    description:
      "カウンセリングから仕上げまで60分の流れを撮影し、施術プランの意図をレポートで補足してください。合格で認定講師証を発行します。",
    submission_kind: "both",
    due_date: "2026-08-31T23:59:00+09:00",
    position: 3,
    is_published: true,
    created_at: "2026-05-11T10:00:00+09:00",
    updated_at: "2026-07-12T14:25:00+09:00",
  },
];

/**
 * 1課題につき1受講生1レコード（再提出は同レコードを更新）。
 * file_url は Storage の `submissions` バケットのパス規約に合わせている。
 */
export const mockSubmissions: SubmissionRow[] = [
  // --- 小林 あゆみ: 3課題すべて合格 -------------------------------------------
  {
    id: "20000000-0000-4000-8000-000000000001",
    assignment_id: ASSIGNMENT_IDS.strokes,
    student_id: USER_IDS.ayumi,
    body: "自宅で撮影しました。ゆらすが一番むずかしかったです。",
    file_url: `submissions/${USER_IDS.ayumi}/${ASSIGNMENT_IDS.strokes}/strokes.mp4`,
    status: "approved",
    score: 92,
    feedback:
      "圧の抜き方がとても上手です。ゆらすは手首ではなく体重移動を意識すると、もっと楽に続けられますよ。",
    reviewed_by: USER_IDS.rika,
    reviewed_at: "2026-06-08T11:30:00+09:00",
    submitted_at: "2026-06-05T22:15:00+09:00",
    created_at: "2026-06-05T22:15:00+09:00",
    updated_at: "2026-06-08T11:30:00+09:00",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    assignment_id: ASSIGNMENT_IDS.bodyPartsReport,
    student_id: USER_IDS.ayumi,
    body: "母に3回施術しました。1回目より3回目のほうが脚が軽いと言ってもらえて、続けることの意味を実感しました。（以下略）",
    file_url: null,
    status: "approved",
    score: 88,
    feedback:
      "相手の変化をよく観察できています。次は「どんな声かけをしたか」も記録に残してみてください。",
    reviewed_by: USER_IDS.rika,
    reviewed_at: "2026-07-14T10:00:00+09:00",
    submitted_at: "2026-07-10T20:00:00+09:00",
    created_at: "2026-07-10T20:00:00+09:00",
    updated_at: "2026-07-14T10:00:00+09:00",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    assignment_id: ASSIGNMENT_IDS.graduation,
    student_id: USER_IDS.ayumi,
    body: "60分の通し施術です。冷えのお悩みが強い方だったので、脚を長めに取りました。",
    file_url: `submissions/${USER_IDS.ayumi}/${ASSIGNMENT_IDS.graduation}/graduation.mp4`,
    status: "approved",
    score: 95,
    feedback:
      "カウンセリングの傾聴がすばらしいです。認定講師として自信を持って進んでください。おめでとうございます。",
    reviewed_by: USER_IDS.rika,
    reviewed_at: "2026-08-01T14:50:00+09:00",
    submitted_at: "2026-07-28T19:40:00+09:00",
    created_at: "2026-07-28T19:40:00+09:00",
    updated_at: "2026-08-01T14:50:00+09:00",
  },

  // --- 花山 美咲: 課題1 合格 / 課題2 再提出依頼 --------------------------------
  {
    id: "20000000-0000-4000-8000-000000000004",
    assignment_id: ASSIGNMENT_IDS.strokes,
    student_id: USER_IDS.misaki,
    body: "サロンの施術ベッドで撮影しています。",
    file_url: `submissions/${USER_IDS.misaki}/${ASSIGNMENT_IDS.strokes}/strokes.mp4`,
    status: "approved",
    score: 85,
    feedback:
      "リズムが安定していて気持ちよさそうです。少しだけ力が入っているので、肩の力を抜いてみましょう。",
    reviewed_by: USER_IDS.rika,
    reviewed_at: "2026-06-22T09:20:00+09:00",
    submitted_at: "2026-06-20T23:05:00+09:00",
    created_at: "2026-06-20T23:05:00+09:00",
    updated_at: "2026-06-22T09:20:00+09:00",
  },
  {
    id: "20000000-0000-4000-8000-000000000005",
    assignment_id: ASSIGNMENT_IDS.bodyPartsReport,
    student_id: USER_IDS.misaki,
    body: "友人2名に施術しました。（以下略）",
    file_url: null,
    status: "revision_requested",
    score: null,
    feedback:
      "内容はとてもよいのですが、施術回数が3回に足りていません。もう1回分を追記して再提出をお願いします。",
    reviewed_by: USER_IDS.rika,
    reviewed_at: "2026-08-03T16:10:00+09:00",
    submitted_at: "2026-07-30T21:50:00+09:00",
    created_at: "2026-07-30T21:50:00+09:00",
    updated_at: "2026-08-03T16:10:00+09:00",
  },

  // --- 田中 ゆかり: 課題1 提出済み（未確認） -----------------------------------
  {
    id: "20000000-0000-4000-8000-000000000006",
    assignment_id: ASSIGNMENT_IDS.strokes,
    student_id: USER_IDS.yukari,
    body: "はじめての提出です。よろしくお願いします。",
    file_url: `submissions/${USER_IDS.yukari}/${ASSIGNMENT_IDS.strokes}/strokes.mp4`,
    status: "submitted",
    score: null,
    feedback: null,
    reviewed_by: null,
    reviewed_at: null,
    submitted_at: "2026-08-08T12:05:00+09:00",
    created_at: "2026-08-08T12:05:00+09:00",
    updated_at: "2026-08-08T12:05:00+09:00",
  },
];
