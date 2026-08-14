import { MonitorPlay } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * 提出した動画ファイルの枠。
 *
 * モックの `file_url` は Storage のパス規約に合わせただけの文字列で実体がないため、
 * いまはパスを見せるだけにしている。署名付き URL を発行できるようになったら、
 * この中身を `<video controls src={...} />` に置き換える。
 */
export function SubmissionFile({ fileUrl }: { fileUrl: string }) {
  const fileName = fileUrl.split("/").at(-1) ?? "提出ファイル";

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-brand-sage-soft/50 px-5 py-4">
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10"
      >
        <MonitorPlay className="size-4 text-brand-sage" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{fileName}</span>
        <span className="truncate font-mono text-[0.7rem] text-muted-foreground">
          {fileUrl}
        </span>
      </span>

      <Button variant="secondary" disabled className="h-11 rounded-xl px-5">
        動画を見る
      </Button>
    </div>
  );
}
