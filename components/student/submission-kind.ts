import { ClipboardList, MonitorPlay, ScrollText } from "lucide-react";

import type { SubmissionKind } from "@/types/database";

/**
 * 課題の提出物ごとの見た目（アイコン・ラベル）と、提出フォームに出す入力の種類。
 * 受講生の提出画面と管理画面の添削画面で共有する。
 */
export const SUBMISSION_KIND_META: Record<
  SubmissionKind,
  {
    label: string;
    icon: typeof MonitorPlay;
    /** 動画ファイルの添付欄を出すか。 */
    needsFile: boolean;
    /** レポート本文の入力欄を出すか。 */
    needsBody: boolean;
  }
> = {
  video: { label: "実技動画", icon: MonitorPlay, needsFile: true, needsBody: false },
  report: { label: "レポート", icon: ScrollText, needsFile: false, needsBody: true },
  both: {
    label: "動画＋レポート",
    icon: ClipboardList,
    needsFile: true,
    needsBody: true,
  },
};
