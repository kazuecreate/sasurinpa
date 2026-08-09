/**
 * 画面開発用のモックデータと、その参照ヘルパー。
 *
 * すべて `types/database.ts` の行型そのままなので、Supabase に接続したあとは
 * ここの関数の中身をクエリに差し替えるだけで済むようにしてある。
 */

import type {
  AnnouncementRow,
  AssignmentRow,
  ChapterRow,
  LessonRow,
  MessageRow,
  MessageThreadRow,
  ProfileRow,
  ProgressRow,
  SubmissionRow,
} from "@/types/database";

import { mockAnnouncements, mockCertificates } from "./announcements";
import { mockAssignments, mockSubmissions } from "./assignments";
import { mockChapters, mockCourse, mockLessons } from "./curriculum";
import { COURSE_ID, DEMO_ADMIN_ID, DEMO_STUDENT_ID } from "./ids";
import { mockMessageThreads, mockMessages } from "./messages";
import { mockProfiles } from "./profiles";
import { mockEnrollments, mockProgress } from "./progress";

export * from "./ids";
export { mockAnnouncements, mockCertificates } from "./announcements";
export { mockAssignments, mockSubmissions } from "./assignments";
export { mockChapters, mockCourse, mockLessons } from "./curriculum";
export { mockMessageThreads, mockMessages } from "./messages";
export { mockProfiles } from "./profiles";
export { mockEnrollments, mockProgress } from "./progress";

// -----------------------------------------------------------------------------
// ユーザー
// -----------------------------------------------------------------------------

export function getProfile(userId: string): ProfileRow | undefined {
  return mockProfiles.find((p) => p.id === userId);
}

/** 受講生一覧（管理画面の名簿用）。氏名の五十音順。 */
export function getStudents(): ProfileRow[] {
  return mockProfiles
    .filter((p) => p.role === "student")
    .sort((a, b) => (a.furigana ?? a.full_name).localeCompare(b.furigana ?? b.full_name, "ja"));
}

// -----------------------------------------------------------------------------
// カリキュラム
// -----------------------------------------------------------------------------

/** 章にレッスンをぶら下げた、カリキュラム一覧表示用の形。 */
export type ChapterWithLessons = ChapterRow & { lessons: LessonRow[] };

export function getCurriculum(courseId: string = COURSE_ID): ChapterWithLessons[] {
  return mockChapters
    .filter((c) => c.course_id === courseId)
    .sort((a, b) => a.position - b.position)
    .map((chapter) => ({
      ...chapter,
      lessons: getLessonsByChapter(chapter.id),
    }));
}

export function getLessonsByChapter(chapterId: string): LessonRow[] {
  return mockLessons
    .filter((l) => l.chapter_id === chapterId)
    .sort((a, b) => a.position - b.position);
}

/** 講座内の全レッスンを章 → 節の順に並べたもの。「次のレッスン」の算出に使う。 */
export function getOrderedLessons(courseId: string = COURSE_ID): LessonRow[] {
  return getCurriculum(courseId).flatMap((chapter) => chapter.lessons);
}

export function getLesson(lessonId: string): LessonRow | undefined {
  return mockLessons.find((l) => l.id === lessonId);
}

export function getChapter(chapterId: string): ChapterRow | undefined {
  return mockChapters.find((c) => c.id === chapterId);
}

// -----------------------------------------------------------------------------
// 進捗
// -----------------------------------------------------------------------------

export function getProgress(userId: string, lessonId: string): ProgressRow | undefined {
  return mockProgress.find((p) => p.user_id === userId && p.lesson_id === lessonId);
}

export type CourseProgress = {
  completed: number;
  total: number;
  /** 0〜100 の整数（プログレスバー用）。 */
  rate: number;
};

export function getCourseProgress(
  userId: string,
  courseId: string = COURSE_ID,
): CourseProgress {
  const lessons = getOrderedLessons(courseId);
  const completed = lessons.filter((l) => getProgress(userId, l.id)?.is_completed).length;

  return {
    completed,
    total: lessons.length,
    rate: lessons.length === 0 ? 0 : Math.round((completed / lessons.length) * 100),
  };
}

/** 未完了のうち最初のレッスン。ダッシュボードの「つづきから」に使う。 */
export function getNextLesson(
  userId: string,
  courseId: string = COURSE_ID,
): LessonRow | undefined {
  const lessons = getOrderedLessons(courseId);
  return lessons.find((l) => !getProgress(userId, l.id)?.is_completed) ?? lessons.at(-1);
}

export function getEnrollment(userId: string, courseId: string = COURSE_ID) {
  return mockEnrollments.find((e) => e.user_id === userId && e.course_id === courseId);
}

// -----------------------------------------------------------------------------
// 課題・提出
// -----------------------------------------------------------------------------

export function getAssignments(courseId: string = COURSE_ID): AssignmentRow[] {
  return mockAssignments
    .filter((a) => a.course_id === courseId)
    .sort((a, b) => a.position - b.position);
}

export function getAssignment(assignmentId: string): AssignmentRow | undefined {
  return mockAssignments.find((a) => a.id === assignmentId);
}

export function getSubmission(
  assignmentId: string,
  studentId: string,
): SubmissionRow | undefined {
  return mockSubmissions.find(
    (s) => s.assignment_id === assignmentId && s.student_id === studentId,
  );
}

/** 課題と、その受講生の提出状況を組にしたもの（未提出は submission が undefined）。 */
export type AssignmentWithSubmission = {
  assignment: AssignmentRow;
  submission: SubmissionRow | undefined;
};

export function getAssignmentsForStudent(
  studentId: string,
  courseId: string = COURSE_ID,
): AssignmentWithSubmission[] {
  return getAssignments(courseId).map((assignment) => ({
    assignment,
    submission: getSubmission(assignment.id, studentId),
  }));
}

/** 添削待ちの提出（管理画面の「要対応」用）。提出が古い順。 */
export function getPendingSubmissions(): SubmissionRow[] {
  return mockSubmissions
    .filter((s) => s.status === "submitted" || s.status === "under_review")
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at));
}

/** 添削済みの提出（管理画面の履歴用）。添削が新しい順。 */
export function getReviewedSubmissions(): SubmissionRow[] {
  return mockSubmissions
    .filter((s) => s.status === "approved" || s.status === "revision_requested")
    .sort((a, b) => (b.reviewed_at ?? "").localeCompare(a.reviewed_at ?? ""));
}

export function getSubmissionsByStudent(studentId: string): SubmissionRow[] {
  return mockSubmissions
    .filter((s) => s.student_id === studentId)
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
}

// -----------------------------------------------------------------------------
// チャット
// -----------------------------------------------------------------------------

/** 新着順のスレッド一覧（管理画面の受信箱）。 */
export function getMessageThreads(): MessageThreadRow[] {
  return [...mockMessageThreads].sort((a, b) =>
    b.last_message_at.localeCompare(a.last_message_at),
  );
}

export function getThreadForStudent(studentId: string): MessageThreadRow | undefined {
  return getMessageThreads().find((t) => t.student_id === studentId);
}

/** スレッド内のメッセージ（古い順）。 */
export function getMessages(threadId: string): MessageRow[] {
  return mockMessages
    .filter((m) => m.thread_id === threadId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

/** 自分宛の未読件数。 */
export function getUnreadCount(threadId: string, viewerId: string): number {
  return getMessages(threadId).filter((m) => m.sender_id !== viewerId && m.read_at === null)
    .length;
}

// -----------------------------------------------------------------------------
// お知らせ・認定証
// -----------------------------------------------------------------------------

/** 公開済みのお知らせを、ピン留め優先＋新着順で返す。 */
export function getAnnouncements(userId?: string): AnnouncementRow[] {
  const isGraduate = userId != null && getCertificate(userId) != null;

  return mockAnnouncements
    .filter((a) => a.published_at !== null)
    .filter((a) => {
      if (userId == null || a.audience === "all") return true;
      if (a.audience === "graduates") return isGraduate;
      return true; // students
    })
    .sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return (b.published_at ?? "").localeCompare(a.published_at ?? "");
    });
}

/**
 * 下書きも含めた全件（管理画面の配信一覧用）。
 * 下書き → ピン留め → 日付の新しい順に並べる。
 */
export function getAllAnnouncements(): AnnouncementRow[] {
  return [...mockAnnouncements].sort((a, b) => {
    const isDraft = (announcement: AnnouncementRow) =>
      Number(announcement.published_at !== null);

    if (isDraft(a) !== isDraft(b)) return isDraft(a) - isDraft(b);
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;

    return (b.published_at ?? b.updated_at).localeCompare(
      a.published_at ?? a.updated_at,
    );
  });
}

export function getCertificate(userId: string, courseId: string = COURSE_ID) {
  return mockCertificates.find((c) => c.user_id === userId && c.course_id === courseId);
}

// -----------------------------------------------------------------------------
// 画面確認用のショートカット
// -----------------------------------------------------------------------------

/** 認証を繋ぐまでの暫定ログインユーザー。 */
export const demoStudent = getProfile(DEMO_STUDENT_ID)!;
export const demoAdmin = getProfile(DEMO_ADMIN_ID)!;

export { mockCourse as demoCourse };
