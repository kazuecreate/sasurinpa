import { CheckCircle2, CircleDashed, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types/database";

export type LessonStatus = "completed" | "in_progress" | "not_started";

/** 完了フラグと視聴位置から、レッスン1件の状態を決める。 */
export function toLessonStatus(
  isCompleted: boolean | undefined,
  lastPositionSeconds: number | undefined,
): LessonStatus {
  if (isCompleted) return "completed";
  if ((lastPositionSeconds ?? 0) > 0) return "in_progress";
  return "not_started";
}

const LESSON_STATUS_STYLE: Record<
  LessonStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  completed: {
    label: "完了",
    icon: CheckCircle2,
    className: "bg-brand-sage-soft text-accent-foreground",
  },
  in_progress: {
    label: "視聴中",
    icon: PlayCircle,
    className: "bg-brand-pink-soft text-secondary-foreground",
  },
  not_started: {
    label: "未受講",
    icon: CircleDashed,
    className: "bg-muted text-muted-foreground",
  },
};

export function LessonStatusBadge({
  status,
  className,
}: {
  status: LessonStatus;
  className?: string;
}) {
  const style = LESSON_STATUS_STYLE[status];

  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      <style.icon aria-hidden />
      {style.label}
    </Badge>
  );
}

const SUBMISSION_STATUS_STYLE: Record<
  SubmissionStatus | "not_submitted",
  { label: string; className: string }
> = {
  not_submitted: { label: "未提出", className: "bg-muted text-muted-foreground" },
  submitted: {
    label: "提出済み",
    className: "bg-brand-pink-soft text-secondary-foreground",
  },
  under_review: {
    label: "添削中",
    className: "bg-brand-pink-soft text-secondary-foreground",
  },
  approved: {
    label: "合格",
    className: "bg-brand-sage-soft text-accent-foreground",
  },
  revision_requested: {
    label: "再提出のお願い",
    className: "bg-destructive/10 text-destructive",
  },
};

export function SubmissionStatusBadge({
  status,
  className,
}: {
  status: SubmissionStatus | undefined;
  className?: string;
}) {
  const style = SUBMISSION_STATUS_STYLE[status ?? "not_submitted"];

  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}
