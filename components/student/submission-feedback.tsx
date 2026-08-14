import { Hourglass } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/format";
import type { SubmissionRow } from "@/types/database";

/**
 * 講師からのフィードバック。
 *
 * 添削がまだ済んでいない提出（`feedback` が null）のときは、
 * 空欄を出さずに「お待ちください」の案内に切り替える。
 */
export function SubmissionFeedback({
  submission,
  instructorName,
}: {
  submission: SubmissionRow;
  instructorName: string;
}) {
  if (submission.feedback == null) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-muted/60 px-5 py-4">
        <Hourglass aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground" />
        <p className="text-xs leading-7 text-muted-foreground">
          {instructorName} 先生が確認中です。フィードバックが届くとこちらに表示され、
          ダッシュボードにもお知らせが出ます。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-brand-pink-soft/50 p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Avatar>
          <AvatarFallback className="bg-card text-secondary-foreground">
            {instructorName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{instructorName} 先生</span>

        {submission.score != null && (
          <span className="rounded-2xl bg-card px-2.5 py-1 text-xs font-medium tabular-nums">
            評価 {submission.score}点
          </span>
        )}

        {submission.reviewed_at && (
          <span className="text-xs text-muted-foreground">
            {formatDateTime(submission.reviewed_at)}
          </span>
        )}
      </div>

      <p className="text-sm leading-8">{submission.feedback}</p>
    </div>
  );
}
