import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  CalendarDays,
  ClipboardList,
  Lock,
  Megaphone,
  Pin,
  PlayCircle,
} from "lucide-react";

import { LESSON_TYPE_META } from "@/components/student/lesson-type";
import { SubmissionStatusBadge } from "@/components/student/status-badges";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatClock, formatDate, formatDuration } from "@/lib/format";
import {
  demoCourse,
  getAnnouncements,
  getAssignmentsForStudent,
  getCertificate,
  getChapter,
  getCourseProgress,
  getCurriculum,
  getNextLesson,
  getProgress,
} from "@/lib/mock";
import {
  CURRENT_STUDENT_ID,
  getCurrentStudent,
  getFamilyName,
} from "@/lib/session";

export const metadata: Metadata = {
  title: "ダッシュボード",
};

export default function DashboardPage() {
  const student = getCurrentStudent();
  const course = demoCourse;

  const progress = getCourseProgress(CURRENT_STUDENT_ID);
  const chapters = getCurriculum();
  const nextLesson = getNextLesson(CURRENT_STUDENT_ID);
  const nextChapter = nextLesson ? getChapter(nextLesson.chapter_id) : undefined;
  const nextLessonProgress = nextLesson
    ? getProgress(CURRENT_STUDENT_ID, nextLesson.id)
    : undefined;

  const assignments = getAssignmentsForStudent(CURRENT_STUDENT_ID);
  const announcements = getAnnouncements(CURRENT_STUDENT_ID).slice(0, 3);
  const certificate = getCertificate(CURRENT_STUDENT_ID);

  const remainingLessons = progress.total - progress.completed;
  const remainingAssignments = assignments.filter(
    ({ submission }) => submission?.status !== "approved",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">
          {course.instructor_name} 先生の講座
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          こんにちは、{getFamilyName(student)}さん
        </h1>
        <p className="text-sm text-muted-foreground">
          今日もゆっくり、ご自分のペースで進めていきましょう。
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* 学習進捗 + つづきから */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              全{chapters.length}章・{progress.total}レッスン／課題
              {assignments.length}本
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-secondary-foreground tabular-nums">
                  {progress.rate}
                </span>
                <span className="text-lg font-medium text-secondary-foreground">
                  %
                </span>
                <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                  {progress.completed} / {progress.total} レッスン完了
                </span>
              </div>
              <Progress value={progress.rate} aria-label="全体の学習進捗" />
            </div>

            {nextLesson && (
              <div className="flex flex-col gap-3 rounded-2xl bg-brand-pink-soft/60 p-4">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-secondary-foreground">
                    <PlayCircle className="size-3.5" />
                    つづきから
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {nextChapter?.title}
                  </p>
                  <p className="font-heading text-base font-medium">
                    {nextLesson.title}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink
                    size="lg"
                    href={`/curriculum/${nextLesson.id}`}
                    className="rounded-2xl"
                  >
                    {nextLessonProgress?.last_position_seconds
                      ? "つづきから受講する"
                      : "このレッスンを受講する"}
                    <ArrowRight />
                  </ButtonLink>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {nextLessonProgress?.last_position_seconds
                      ? `${formatClock(nextLessonProgress.last_position_seconds)} / ${formatClock(nextLesson.duration_seconds)}`
                      : formatDuration(nextLesson.duration_seconds)}
                    ・{LESSON_TYPE_META[nextLesson.lesson_type].label}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 認定講師証 */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-4 text-brand-sage" />
              デジタル認定講師証
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4">
            {certificate ? (
              <div className="flex flex-1 flex-col justify-center gap-1 rounded-2xl bg-brand-sage-soft/60 p-4 text-center">
                <p className="font-heading text-base font-medium">
                  {certificate.recipient_name} 様
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {certificate.certificate_no}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-muted/60 p-5 text-center">
                  <Lock className="size-5 text-muted-foreground" />
                  <p className="text-xs leading-6 text-muted-foreground">
                    全レッスンの受講と課題の合格で
                    <br />
                    認定講師証が発行されます
                  </p>
                </div>
                <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <li className="flex justify-between">
                    <span>のこりレッスン</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {remainingLessons}件
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>のこり課題</span>
                    <span className="font-medium text-foreground tabular-nums">
                      {remainingAssignments}件
                    </span>
                  </li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 課題の提出状況 */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="size-4 text-brand-pink" />
              課題の提出状況
            </CardTitle>
            <CardDescription>
              講師からのフィードバックはここに届きます。
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {assignments.map(({ assignment, submission }, index) => (
              <div key={assignment.id} className="flex flex-col gap-2.5">
                {index > 0 && <Separator />}
                <div className="flex flex-col gap-2 pt-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium leading-relaxed">
                      {assignment.title}
                    </p>
                    <SubmissionStatusBadge
                      status={submission?.status}
                      className="mt-0.5 shrink-0"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {assignment.due_date && (
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        提出期限 {formatDate(assignment.due_date)}
                      </span>
                    )}
                    {submission?.score != null && (
                      <span className="tabular-nums">
                        評価 {submission.score}点
                      </span>
                    )}
                  </div>

                  {submission?.feedback && (
                    <p className="rounded-2xl bg-muted/60 px-3.5 py-2.5 text-xs leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {demoCourse.instructor_name} 先生：
                      </span>
                      {submission.feedback}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* お知らせ */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-brand-sage" />
              お知らせ
            </CardTitle>
            <CardDescription>運営からの最新のご案内です。</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {announcements.map((announcement, index) => (
              <div key={announcement.id} className="flex flex-col gap-2.5">
                {index > 0 && <Separator />}
                <article className="flex flex-col gap-1 pt-0.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {announcement.is_pinned && (
                      <Pin className="size-3.5 text-brand-pink" />
                    )}
                    {announcement.published_at && (
                      <time dateTime={announcement.published_at}>
                        {formatDate(announcement.published_at)}
                      </time>
                    )}
                  </div>
                  <h3 className="font-medium leading-relaxed">
                    {announcement.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-6 text-muted-foreground">
                    {announcement.body}
                  </p>
                </article>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
