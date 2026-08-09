import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MessageRow } from "@/types/database";

/**
 * チャットの吹き出し1つ。
 *
 * 自分（ログイン中の受講生）の発言は右にピンク、
 * 相手（講師・運営）の発言は左に白で並べる。
 */
export function ChatMessage({
  message,
  isOwn,
  senderName,
  isUnread,
}: {
  message: MessageRow;
  /** ログイン中のユーザー自身の発言か。 */
  isOwn: boolean;
  senderName: string;
  /** 自分宛でまだ読んでいない発言か（相手の発言にだけ付く）。 */
  isUnread?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex max-w-[85%] items-end gap-2.5 sm:max-w-[75%]",
        isOwn && "ml-auto flex-row-reverse",
      )}
    >
      {!isOwn && (
        <Avatar className="mb-5 shrink-0">
          <AvatarFallback className="bg-brand-sage-soft text-accent-foreground">
            {senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex min-w-0 flex-col gap-1", isOwn && "items-end")}>
        <span className="px-1 text-xs text-muted-foreground">
          {isOwn ? "あなた" : senderName}
        </span>

        <p
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-7",
            isOwn
              ? "rounded-br-sm bg-brand-pink-soft text-secondary-foreground"
              : "rounded-bl-sm bg-card ring-1 ring-foreground/10",
          )}
        >
          {message.body}
        </p>

        <span className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          {isUnread && (
            <span className="rounded-2xl bg-brand-pink px-1.5 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
              新着
            </span>
          )}
          <time dateTime={message.created_at}>
            {formatTime(message.created_at)}
          </time>
        </span>
      </div>
    </li>
  );
}

/** 日付が変わったところに挟む区切り。 */
export function ChatDateDivider({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </li>
  );
}
