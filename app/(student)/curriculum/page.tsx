import type { Metadata } from "next";

import { LessonRow } from "@/components/student/lesson-row";
import { toLessonStatus } from "@/components/student/status-badges";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  demoCourse,
  getCourseProgress,
  getCurriculum,
  getProgress,
} from "@/lib/mock";
import { CURRENT_STUDENT_ID } from "@/lib/session";

export const metadata: Metadata = {
  title: "カリキュラム",
};

export default function CurriculumPage() {
  const chapters = getCurriculum();
  const progress = getCourseProgress(CURRENT_STUDENT_ID);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">{demoCourse.title}</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          カリキュラム
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {demoCourse.description}
        </p>
      </header>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-2.5 py-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">全体の進捗</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {progress.completed} / {progress.total} レッスン（{progress.rate}
              %）
            </span>
          </div>
          <Progress value={progress.rate} aria-label="全体の学習進捗" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5">
        {chapters.map((chapter, chapterIndex) => {
          const completedCount = chapter.lessons.filter(
            (lesson) => getProgress(CURRENT_STUDENT_ID, lesson.id)?.is_completed,
          ).length;

          return (
            <Card key={chapter.id} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="rounded-2xl bg-brand-pink-soft px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    第{chapterIndex + 1}章
                  </span>
                  <span className="text-base">{chapter.title}</span>
                  <span className="ml-auto text-xs font-normal text-muted-foreground tabular-nums">
                    {completedCount} / {chapter.lessons.length} 完了
                  </span>
                </CardTitle>
                {chapter.description && (
                  <CardDescription className="leading-6">
                    {chapter.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="flex flex-col">
                {chapter.lessons.map((lesson) => {
                  const lessonProgress = getProgress(
                    CURRENT_STUDENT_ID,
                    lesson.id,
                  );

                  return (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      status={toLessonStatus(
                        lessonProgress?.is_completed,
                        lessonProgress?.last_position_seconds,
                      )}
                    />
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
