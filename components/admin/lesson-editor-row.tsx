import { ChevronDown, ChevronUp, GripVertical, Pencil } from "lucide-react";

import { VisibilityBadge } from "@/components/admin/admin-badges";
import { LESSON_TYPE_META } from "@/components/student/lesson-type";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/format";
import type { LessonRow } from "@/types/database";

/**
 * 教材管理のレッスン 1 行。
 * 並び替え・編集ボタンは見た目のみ（押しても何も起きない）。
 */
export function LessonEditorRow({
  lesson,
  isFirst,
  isLast,
}: {
  lesson: LessonRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const typeMeta = LESSON_TYPE_META[lesson.lesson_type];
  const sourceUrl = lesson.video_url ?? lesson.pdf_url;

  return (
    <div className="-mx-2 flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60">
      <GripVertical
        aria-hidden
        className="mt-2 size-4 shrink-0 cursor-grab text-muted-foreground/60"
      />

      <span
        aria-hidden
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-brand-cream ring-1 ring-foreground/10"
      >
        <typeMeta.icon className="size-4 text-brand-sage" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium leading-relaxed">{lesson.title}</p>
          <VisibilityBadge isPublished={lesson.is_published} />
        </div>

        {lesson.description && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {lesson.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {typeMeta.label}・{formatDuration(lesson.duration_seconds)}
          {lesson.content && "・Webテキストあり"}
        </p>

        {sourceUrl && (
          <p className="truncate font-mono text-[0.7rem] text-muted-foreground/80">
            {sourceUrl}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isFirst}
          aria-label={`${lesson.title}を上へ移動`}
        >
          <ChevronUp />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isLast}
          aria-label={`${lesson.title}を下へ移動`}
        >
          <ChevronDown />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-2xl"
        >
          <Pencil />
          編集
        </Button>
      </div>
    </div>
  );
}
