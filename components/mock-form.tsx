import { Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * 見た目だけのフォーム部品。管理画面と受講生画面の両方で使う。
 *
 * いまはどのフォームも「見た目のみ」で、送信しても何も起きない
 * （ボタンはすべて type="button"）。Supabase 接続後に Server Action を
 * 生やす前提なので、入力そのものは制御していない。
 */

export function MockField({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  /** ラベルと結びつける入力の id。 */
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-[0.7rem] leading-5 text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/** 値 → 表示ラベルの対応をそのまま渡すセレクト。既定値は先頭の項目。 */
export function MockSelect({
  id,
  options,
  defaultValue,
  className,
}: {
  id?: string;
  options: Record<string, string>;
  defaultValue?: string;
  className?: string;
}) {
  const values = Object.keys(options);

  return (
    <Select items={options} defaultValue={defaultValue ?? values[0]}>
      <SelectTrigger id={id} className={cn("w-full rounded-2xl", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {values.map((value) => (
          <SelectItem key={value} value={value}>
            {options[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** フォームの足元に置く、書き込み未実装の注記。 */
export function MockFormNotice({ children }: { children?: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-muted/60 px-3.5 py-2.5 text-xs leading-6 text-muted-foreground">
      <Info aria-hidden className="mt-1 size-3.5 shrink-0" />
      <span>
        {children ??
          "保存・配信の処理はまだ繋いでいません。Supabase 接続後に Server Action を実装します。"}
      </span>
    </p>
  );
}
