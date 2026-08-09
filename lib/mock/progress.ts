import type { EnrollmentRow, ProgressRow } from "@/types/database";
import { COURSE_ID, ENROLLMENT_IDS, LESSON_IDS, USER_IDS } from "./ids";

export const mockEnrollments: EnrollmentRow[] = [
  {
    id: ENROLLMENT_IDS.misaki,
    user_id: USER_IDS.misaki,
    course_id: COURSE_ID,
    status: "active",
    enrolled_at: "2026-05-07T09:20:00+09:00",
    completed_at: null,
    created_at: "2026-05-07T09:20:00+09:00",
    updated_at: "2026-08-07T21:40:00+09:00",
  },
  {
    id: ENROLLMENT_IDS.ayumi,
    user_id: USER_IDS.ayumi,
    course_id: COURSE_ID,
    status: "completed",
    enrolled_at: "2026-05-07T09:35:00+09:00",
    completed_at: "2026-08-01T15:00:00+09:00",
    created_at: "2026-05-07T09:35:00+09:00",
    updated_at: "2026-08-01T15:00:00+09:00",
  },
  {
    id: ENROLLMENT_IDS.yukari,
    user_id: USER_IDS.yukari,
    course_id: COURSE_ID,
    status: "active",
    enrolled_at: "2026-05-20T18:50:00+09:00",
    completed_at: null,
    created_at: "2026-05-20T18:50:00+09:00",
    updated_at: "2026-08-08T12:10:00+09:00",
  },
];

/** progress は行数が多いので、DB の既定値と同じ埋め方をする小さなファクトリを使う。 */
type ProgressSeed = {
  lessonId: string;
  /** 完了日時。未完了のレッスンでは省略する。 */
  completedAt?: string;
  /** 動画の視聴再開位置（秒）。 */
  lastPositionSeconds?: number;
  /** 最初に開いた日時。 */
  startedAt: string;
};

let progressSeq = 0;

function progressRow(userId: string, seed: ProgressSeed): ProgressRow {
  progressSeq += 1;
  const isCompleted = seed.completedAt != null;

  return {
    id: `f0000000-0000-4000-8000-${String(progressSeq).padStart(12, "0")}`,
    user_id: userId,
    lesson_id: seed.lessonId,
    is_completed: isCompleted,
    completed_at: seed.completedAt ?? null,
    last_position_seconds: seed.lastPositionSeconds ?? 0,
    created_at: seed.startedAt,
    updated_at: seed.completedAt ?? seed.startedAt,
  };
}

/** 花山 美咲: 6/8 完了。第3章「脚・むくみケア」を視聴途中。 */
const misakiProgress: ProgressRow[] = [
  { lessonId: LESSON_IDS.whatIsSasurinpa, startedAt: "2026-05-08T20:00:00+09:00", completedAt: "2026-05-08T20:09:00+09:00" },
  { lessonId: LESSON_IDS.lymphAndNerves, startedAt: "2026-05-10T21:00:00+09:00", completedAt: "2026-05-10T21:22:00+09:00" },
  { lessonId: LESSON_IDS.plateGrip, startedAt: "2026-05-17T19:30:00+09:00", completedAt: "2026-05-17T19:45:00+09:00" },
  { lessonId: LESSON_IDS.basicStrokes, startedAt: "2026-05-24T20:10:00+09:00", completedAt: "2026-05-24T20:31:00+09:00" },
  { lessonId: LESSON_IDS.hygiene, startedAt: "2026-06-02T22:00:00+09:00", completedAt: "2026-06-02T22:08:00+09:00" },
  { lessonId: LESSON_IDS.decollete, startedAt: "2026-07-05T20:00:00+09:00", completedAt: "2026-07-05T20:25:00+09:00" },
  { lessonId: LESSON_IDS.legs, startedAt: "2026-08-07T21:20:00+09:00", lastPositionSeconds: 420 },
].map((seed) => progressRow(USER_IDS.misaki, seed));

/** 小林 あゆみ: 8/8 完了（修了済み）。 */
const ayumiProgress: ProgressRow[] = [
  { lessonId: LESSON_IDS.whatIsSasurinpa, startedAt: "2026-05-08T10:00:00+09:00", completedAt: "2026-05-08T10:09:00+09:00" },
  { lessonId: LESSON_IDS.lymphAndNerves, startedAt: "2026-05-09T10:00:00+09:00", completedAt: "2026-05-09T10:18:00+09:00" },
  { lessonId: LESSON_IDS.plateGrip, startedAt: "2026-05-14T13:00:00+09:00", completedAt: "2026-05-14T13:14:00+09:00" },
  { lessonId: LESSON_IDS.basicStrokes, startedAt: "2026-05-16T13:00:00+09:00", completedAt: "2026-05-16T13:17:00+09:00" },
  { lessonId: LESSON_IDS.hygiene, startedAt: "2026-05-21T09:00:00+09:00", completedAt: "2026-05-21T09:07:00+09:00" },
  { lessonId: LESSON_IDS.decollete, startedAt: "2026-06-11T14:00:00+09:00", completedAt: "2026-06-11T14:22:00+09:00" },
  { lessonId: LESSON_IDS.legs, startedAt: "2026-06-25T14:00:00+09:00", completedAt: "2026-06-25T14:20:00+09:00" },
  { lessonId: LESSON_IDS.femcareBasics, startedAt: "2026-07-16T11:00:00+09:00", completedAt: "2026-07-16T11:26:00+09:00" },
].map((seed) => progressRow(USER_IDS.ayumi, seed));

/** 田中 ゆかり: 4/8 完了。衛生管理の PDF を開いたところ。 */
const yukariProgress: ProgressRow[] = [
  { lessonId: LESSON_IDS.whatIsSasurinpa, startedAt: "2026-05-21T22:00:00+09:00", completedAt: "2026-05-21T22:10:00+09:00" },
  { lessonId: LESSON_IDS.lymphAndNerves, startedAt: "2026-06-04T22:30:00+09:00", completedAt: "2026-06-04T22:52:00+09:00" },
  { lessonId: LESSON_IDS.plateGrip, startedAt: "2026-07-01T21:00:00+09:00", completedAt: "2026-07-01T21:16:00+09:00" },
  { lessonId: LESSON_IDS.basicStrokes, startedAt: "2026-07-23T21:00:00+09:00", completedAt: "2026-07-23T21:19:00+09:00" },
  { lessonId: LESSON_IDS.hygiene, startedAt: "2026-08-08T12:10:00+09:00" },
].map((seed) => progressRow(USER_IDS.yukari, seed));

export const mockProgress: ProgressRow[] = [
  ...misakiProgress,
  ...ayumiProgress,
  ...yukariProgress,
];
