import { Download, FileText, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatClock, formatDuration } from "@/lib/format";

/**
 * 動画プレイヤーの枠。
 *
 * モックの `video_url` は実体のないダミー URL なので、いまは再生面をプレースホルダーで
 * 描いている。Storage の署名付き URL を返せるようになったら、この中身を
 * `<video controls src={...} />` に置き換える（外側のレイアウトはそのまま使える）。
 */
export function LessonVideo({
  videoUrl,
  durationSeconds,
  lastPositionSeconds,
}: {
  videoUrl: string;
  durationSeconds: number;
  lastPositionSeconds: number;
}) {
  const watchedRate =
    durationSeconds === 0
      ? 0
      : Math.min(100, Math.round((lastPositionSeconds / durationSeconds) * 100));

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-foreground/10">
      <div className="relative flex aspect-video items-center justify-center bg-linear-to-br from-brand-pink-soft via-background to-brand-sage-soft">
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-16 items-center justify-center rounded-full bg-card shadow-soft ring-1 ring-foreground/10">
            <Play className="size-6 translate-x-0.5 fill-brand-pink text-brand-pink" />
          </span>
          <p className="text-xs text-muted-foreground">
            動画プレイヤー（{formatDuration(durationSeconds)}）
          </p>
        </div>

        <p className="absolute bottom-3 left-4 max-w-[80%] truncate font-mono text-[0.65rem] text-muted-foreground/70">
          {videoUrl}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-card px-4 py-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand-pink"
            style={{ width: `${watchedRate}%` }}
          />
        </div>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {formatClock(lastPositionSeconds)} / {formatClock(durationSeconds)}
        </span>
      </div>
    </div>
  );
}

/** PDF 教材のダウンロード枠。実ファイルが繋がるまではボタンを無効化しておく。 */
export function LessonPdf({
  pdfUrl,
  title,
}: {
  pdfUrl: string;
  title: string;
}) {
  const fileName = pdfUrl.split("/").at(-1) ?? "資料.pdf";

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-linear-to-br from-brand-sage-soft via-background to-brand-pink-soft px-6 py-12 ring-1 ring-foreground/10">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-card shadow-soft ring-1 ring-foreground/10">
        <FileText className="size-7 text-brand-sage" />
      </span>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="font-heading text-base font-medium">{title}</p>
        <p className="font-mono text-xs text-muted-foreground">{fileName}</p>
      </div>
      <Button size="lg" variant="secondary" disabled className="rounded-2xl">
        <Download />
        PDFをひらく
      </Button>
      <p className="text-xs text-muted-foreground">
        ファイルの配信はこれから接続します。
      </p>
    </div>
  );
}
