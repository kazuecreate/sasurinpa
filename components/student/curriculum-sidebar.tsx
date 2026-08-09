import Link from "next/link";
import { Check } from "lucide-react";

import { LESSON_TYPE_META } from "@/components/student/lesson-type";
import { formatDuration } from "@/lib/format";
import type { ChapterWithLessons } from "@/lib/mock";
import { cn } from "@/lib/utils";

/** レッスン視聴画面の横に出す、講座全体の目次。 */
export function CurriculumSidebar({
  chapters,
  completedLessonIds,
  currentLessonId,
}: {
  chapters: ChapterWithLessons[];
  completedLessonIds: ReadonlySet<string>;
  currentLessonId: string;
}) {
  return (
    <nav
      aria-label="カリキュラム"
      className="flex flex-col gap-5 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <p className="font-heading text-sm font-medium">カリキュラム</p>

      {chapters.map((chapter, chapterIndex) => (
        <div key={chapter.id} className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            第{chapterIndex + 1}章　{chapter.title}
          </p>

          <ul className="flex flex-col">
            {chapter.lessons.map((lesson) => {
              const isCurrent = lesson.id === currentLessonId;
              const isCompleted = completedLessonIds.has(lesson.id);
              const typeMeta = LESSON_TYPE_META[lesson.lesson_type];

              return (
                <li key={lesson.id}>
                  <Link
                    href={`/curriculum/${lesson.id}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex items-start gap-2.5 rounded-2xl px-2.5 py-2 text-xs transition-colors",
                      isCurrent
                        ? "bg-brand-pink-soft text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted/70",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "mt-px flex size-4 shrink-0 items-center justify-center rounded-full",
                        isCompleted
                          ? "bg-brand-sage text-white"
                          : "ring-1 ring-border",
                      )}
                    >
                      {isCompleted && <Check className="size-2.5" />}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "leading-6",
                          isCurrent && "font-medium",
                        )}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-[0.7rem] opacity-80">
                        {typeMeta.label}・
                        {formatDuration(lesson.duration_seconds)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
