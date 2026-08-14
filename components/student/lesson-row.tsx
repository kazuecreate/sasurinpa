import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { LESSON_TYPE_META } from "@/components/student/lesson-type";
import {
  LessonStatusBadge,
  type LessonStatus,
} from "@/components/student/status-badges";
import { formatDuration } from "@/lib/format";
import type { LessonRow as LessonRowType } from "@/types/database";

/** カリキュラム一覧の 1 行。レッスン視聴画面へのリンクを兼ねる。 */
export function LessonRow({
  lesson,
  status,
}: {
  lesson: LessonRowType;
  status: LessonStatus;
}) {
  const typeMeta = LESSON_TYPE_META[lesson.lesson_type];

  return (
    <Link
      href={`/curriculum/${lesson.id}`}
      className="-mx-3 flex items-start gap-4 rounded-xl px-3 py-4 transition-colors hover:bg-muted/70"
    >
      <span
        aria-hidden
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream ring-1 ring-foreground/10"
      >
        <typeMeta.icon className="size-4 text-brand-sage" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-medium leading-relaxed">{lesson.title}</p>
        {lesson.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {lesson.description}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          {typeMeta.label}・{formatDuration(lesson.duration_seconds)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
        <LessonStatusBadge status={status} />
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
