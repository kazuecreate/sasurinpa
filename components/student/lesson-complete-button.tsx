"use client";

import { useState } from "react";
import { Check, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * レッスンの完了フラグ。
 *
 * いまは画面内のローカル state だけを更新する（リロードでモックの値に戻る）。
 * Supabase 接続後は `progress` テーブルを更新する Server Action を呼び、
 * `revalidatePath` で一覧側の進捗も合わせて更新する。
 */
export function LessonCompleteButton({
  initialCompleted,
}: {
  initialCompleted: boolean;
}) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <Button
        size="lg"
        variant={isCompleted ? "outline" : "default"}
        aria-pressed={isCompleted}
        onClick={() => setIsCompleted((prev) => !prev)}
        className="h-11 rounded-xl px-5"
      >
        {isCompleted ? <CircleCheck /> : <Check />}
        {isCompleted ? "完了しました" : "このレッスンを完了にする"}
      </Button>
      <p className="text-xs text-muted-foreground">
        {isCompleted
          ? "もう一度押すと未完了に戻せます。"
          : "最後まで視聴したら押してください。"}
      </p>
    </div>
  );
}
