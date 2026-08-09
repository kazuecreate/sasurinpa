import { FileText, MonitorPlay, ScrollText } from "lucide-react";

import type { LessonType } from "@/types/database";

/** レッスン種別ごとの見た目（アイコン・ラベル）。一覧と詳細で共有する。 */
export const LESSON_TYPE_META: Record<
  LessonType,
  { label: string; icon: typeof FileText }
> = {
  video: { label: "動画", icon: MonitorPlay },
  text: { label: "テキスト", icon: ScrollText },
  pdf: { label: "PDF", icon: FileText },
};
