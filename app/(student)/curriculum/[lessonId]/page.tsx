import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight, Clock } from "lucide-react";

import { CurriculumSidebar } from "@/components/student/curriculum-sidebar";
import { LessonCompleteButton } from "@/components/student/lesson-complete-button";
import { LessonPdf, LessonVideo } from "@/components/student/lesson-media";
import { LessonText } from "@/components/student/lesson-text";
import { LESSON_TYPE_META } from "@/components/student/lesson-type";
import {
  LessonStatusBadge,
  toLessonStatus,
} from "@/components/student/status-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/format";
import {
  getChapter,
  getCurriculum,
  getLesson,
  getOrderedLessons,
  getProgress,
} from "@/lib/mock";
import { CURRENT_STUDENT_ID } from "@/lib/session";

export async function generateMetadata({
  params,
}: PageProps<"/curriculum/[lessonId]">): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);

  return { title: lesson?.title ?? "レッスン" };
}

export default async function LessonPage({
  params,
}: PageProps<"/curriculum/[lessonId]">) {
  const { lessonId } = await params;

  const lesson = getLesson(lessonId);
  if (!lesson) notFound();

  const chapters = getCurriculum();
  const chapter = getChapter(lesson.chapter_id);
  const chapterIndex = chapters.findIndex((c) => c.id === lesson.chapter_id);

  const orderedLessons = getOrderedLessons();
  const currentIndex = orderedLessons.findIndex((l) => l.id === lesson.id);
  const previousLesson = orderedLessons[currentIndex - 1];
  const nextLesson = orderedLessons[currentIndex + 1];

  const lessonProgress = getProgress(CURRENT_STUDENT_ID, lesson.id);
  const status = toLessonStatus(
    lessonProgress?.is_completed,
    lessonProgress?.last_position_seconds,
  );

  const completedLessonIds = new Set(
    orderedLessons
      .filter((l) => getProgress(CURRENT_STUDENT_ID, l.id)?.is_completed)
      .map((l) => l.id),
  );

  const typeMeta = LESSON_TYPE_META[lesson.lesson_type];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div className="flex flex-col gap-5">
        <nav
          aria-label="パンくず"
          className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
        >
          <Link href="/curriculum" className="hover:text-foreground">
            カリキュラム
          </Link>
          <ChevronRight className="size-3.5" />
          <span>
            第{chapterIndex + 1}章　{chapter?.title}
          </span>
        </nav>

        <header className="flex flex-col gap-2.5">
          <h1 className="font-heading text-xl font-bold leading-relaxed tracking-tight sm:text-2xl">
            {lesson.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <typeMeta.icon className="size-3.5" />
              {typeMeta.label}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatDuration(lesson.duration_seconds)}
            </span>
            <LessonStatusBadge status={status} />
          </div>
        </header>

        {/* 教材本体 */}
        {lesson.lesson_type === "video" && lesson.video_url && (
          <LessonVideo
            videoUrl={lesson.video_url}
            durationSeconds={lesson.duration_seconds}
            lastPositionSeconds={lessonProgress?.last_position_seconds ?? 0}
          />
        )}

        {lesson.lesson_type === "pdf" && lesson.pdf_url && (
          <LessonPdf pdfUrl={lesson.pdf_url} title={lesson.title} />
        )}

        {lesson.lesson_type === "text" && lesson.content && (
          <Card className="rounded-2xl">
            <CardContent className="py-2">
              <LessonText content={lesson.content} />
            </CardContent>
          </Card>
        )}

        {lesson.description && lesson.lesson_type !== "text" && (
          <Card className="rounded-2xl">
            <CardContent className="py-1 text-sm leading-7 text-muted-foreground">
              {lesson.description}
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl">
          <CardContent className="py-1">
            <LessonCompleteButton
              initialCompleted={lessonProgress?.is_completed ?? false}
            />
          </CardContent>
        </Card>

        {/* 前後のレッスン */}
        <div className="flex flex-wrap gap-3">
          {previousLesson && (
            <Button
              variant="outline"
              size="lg"
              className="h-auto flex-1 justify-start gap-3 rounded-2xl px-4 py-3 text-left whitespace-normal"
              render={
                <Link href={`/curriculum/${previousLesson.id}`}>
                  <ArrowLeft className="shrink-0" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      前のレッスン
                    </span>
                    <span className="truncate text-sm font-medium">
                      {previousLesson.title}
                    </span>
                  </span>
                </Link>
              }
            />
          )}

          {nextLesson && (
            <Button
              variant="outline"
              size="lg"
              className="h-auto flex-1 justify-end gap-3 rounded-2xl px-4 py-3 text-right whitespace-normal"
              render={
                <Link href={`/curriculum/${nextLesson.id}`}>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      次のレッスン
                    </span>
                    <span className="truncate text-sm font-medium">
                      {nextLesson.title}
                    </span>
                  </span>
                  <ArrowRight className="shrink-0" />
                </Link>
              }
            />
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24">
        <CurriculumSidebar
          chapters={chapters}
          completedLessonIds={completedLessonIds}
          currentLessonId={lesson.id}
        />
      </aside>
    </div>
  );
}
