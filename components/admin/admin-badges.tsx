import { Eye, EyeOff, Pin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  AnnouncementAudience,
  EnrollmentStatus,
} from "@/types/database";

/**
 * 管理画面だけで使う状態バッジ。
 * 課題の提出ステータスとレッスン種別は受講生画面と共通のものを使う
 * （`components/student/status-badges.tsx` / `lesson-type.ts`）。
 */

const AUDIENCE_STYLE: Record<
  AnnouncementAudience,
  { label: string; className: string }
> = {
  all: { label: "全員", className: "bg-brand-sage-soft text-accent-foreground" },
  students: {
    label: "受講生のみ",
    className: "bg-brand-pink-soft text-secondary-foreground",
  },
  graduates: {
    label: "卒業生のみ",
    className: "bg-muted text-muted-foreground",
  },
};

export function AudienceBadge({
  audience,
  className,
}: {
  audience: AnnouncementAudience;
  className?: string;
}) {
  const style = AUDIENCE_STYLE[audience];

  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}

/** お知らせの配信状態。published_at が null なら下書き。 */
export function PublishStateBadge({
  publishedAt,
  className,
}: {
  publishedAt: string | null;
  className?: string;
}) {
  const isPublished = publishedAt !== null;

  return (
    <Badge
      variant="secondary"
      className={cn(
        isPublished
          ? "bg-brand-sage-soft text-accent-foreground"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isPublished ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
      {isPublished ? "配信済み" : "下書き"}
    </Badge>
  );
}

/** レッスン・課題の公開フラグ。 */
export function VisibilityBadge({
  isPublished,
  className,
}: {
  isPublished: boolean;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        isPublished
          ? "bg-brand-sage-soft text-accent-foreground"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isPublished ? "公開中" : "非公開"}
    </Badge>
  );
}

const ENROLLMENT_STYLE: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  active: {
    label: "受講中",
    className: "bg-brand-pink-soft text-secondary-foreground",
  },
  completed: {
    label: "修了",
    className: "bg-brand-sage-soft text-accent-foreground",
  },
  suspended: {
    label: "休止中",
    className: "bg-muted text-muted-foreground",
  },
};

export function EnrollmentStatusBadge({
  status,
  className,
}: {
  status: EnrollmentStatus | undefined;
  className?: string;
}) {
  if (!status) {
    return (
      <Badge
        variant="secondary"
        className={cn("bg-muted text-muted-foreground", className)}
      >
        未登録
      </Badge>
    );
  }

  const style = ENROLLMENT_STYLE[status];

  return (
    <Badge variant="secondary" className={cn(style.className, className)}>
      {style.label}
    </Badge>
  );
}

/** ピン留め（上部固定）表示。 */
export function PinnedBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("bg-brand-pink-soft text-secondary-foreground", className)}
    >
      <Pin aria-hidden />
      固定表示
    </Badge>
  );
}
