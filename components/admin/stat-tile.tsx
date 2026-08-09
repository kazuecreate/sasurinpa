import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONE_STYLE = {
  pink: "bg-brand-pink-soft text-secondary-foreground",
  sage: "bg-brand-sage-soft text-accent-foreground",
  muted: "bg-muted text-muted-foreground",
} as const;

/** 管理画面の各ページ上部に並べる、件数の要約タイル。 */
export function StatTile({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "sage",
}: {
  label: string;
  value: number | string;
  unit?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONE_STYLE;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
      <span
        aria-hidden
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-2xl",
          TONE_STYLE[tone],
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="flex items-baseline gap-1">
          <span className="font-heading text-2xl font-bold tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-muted-foreground">{unit}</span>
          )}
        </span>
        {hint && (
          <span className="text-[0.7rem] leading-5 text-muted-foreground">
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}

export function StatTileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
  );
}
