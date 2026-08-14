import { Fragment } from "react";
import type { Metadata } from "next";
import { Clock3, Lock, MessagesSquare, Paperclip, Send } from "lucide-react";

import { MockField, MockFormNotice } from "@/components/mock-form";
import {
  ChatDateDivider,
  ChatMessage,
} from "@/components/student/chat-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  demoCourse,
  getMessages,
  getProfile,
  getThreadForStudent,
  getUnreadCount,
} from "@/lib/mock";
import { getCurrentStudent } from "@/lib/session";

export const metadata: Metadata = {
  title: "サポート",
};

export default async function SupportPage() {
  const student = await getCurrentStudent();

  const thread = getThreadForStudent(student.id);
  const messages = thread ? getMessages(thread.id) : [];
  const unreadCount = thread ? getUnreadCount(thread.id, student.id) : 0;

  const instructor = demoCourse.created_by
    ? getProfile(demoCourse.created_by)
    : undefined;

  // 日付が変わったところに区切りを挟む。
  const timeline = messages.map((message, index) => {
    const date = formatDate(message.created_at);
    const previous = messages[index - 1];

    return {
      message,
      date,
      showDivider:
        previous === undefined || formatDate(previous.created_at) !== date,
    };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{demoCourse.title}</p>
          <h1 className="font-heading text-2xl font-medium sm:text-3xl">
            サポート・チャット
          </h1>
          <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
            講座の内容でも、体の使い方でも、活動のご相談でも大丈夫です。
            {demoCourse.instructor_name} 先生と運営がお答えします。
          </p>
        </header>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <MessagesSquare className="size-4 text-brand-pink" />
              <span>{thread?.subject ?? "サポート"}</span>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-brand-pink-soft text-secondary-foreground tabular-nums"
                >
                  未読 {unreadCount}件
                </Badge>
              )}
              {thread?.is_closed && (
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground"
                >
                  <Lock aria-hidden />
                  受付終了
                </Badge>
              )}
            </CardTitle>
            {thread && (
              <CardDescription>
                最終更新 {formatDateTime(thread.last_message_at)}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {messages.length === 0 ? (
              <p className="rounded-2xl bg-muted/60 px-5 py-10 text-center text-sm leading-8 text-muted-foreground">
                まだやりとりはありません。
                <br />
                下の入力欄から、お気軽に最初のご質問をどうぞ。
              </p>
            ) : (
              <ul className="flex flex-col gap-6">
                {timeline.map(({ message, date, showDivider }) => {
                  const isOwn = message.sender_id === student.id;
                  const sender = getProfile(message.sender_id);

                  return (
                    <Fragment key={message.id}>
                      {showDivider && <ChatDateDivider label={date} />}
                      <ChatMessage
                        message={message}
                        isOwn={isOwn}
                        senderName={sender?.full_name ?? "運営"}
                        isUnread={!isOwn && message.read_at === null}
                      />
                    </Fragment>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* 入力欄（見た目のみ） */}
        <Card className="rounded-2xl">
          <CardContent>
            {thread?.is_closed ? (
              <p className="rounded-2xl bg-muted/60 px-5 py-4 text-xs leading-7 text-muted-foreground">
                このスレッドは受付を終了しています。あらためてご相談がある場合は、新しくご質問をお送りください。
              </p>
            ) : (
              <form className="flex flex-col gap-4">
                <MockField
                  label="メッセージ"
                  htmlFor="support-message"
                  hint="お返事は平日2〜3日以内を目安にお送りしています。"
                >
                  <Textarea
                    id="support-message"
                    rows={4}
                    placeholder="レッスンや課題で気になったことを、そのまま書いてくださって大丈夫です。"
                    className="rounded-xl px-4 py-3"
                  />
                </MockField>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    size="lg"
                    className="h-11 rounded-xl px-5"
                  >
                    <Send />
                    送信する
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-11 rounded-xl px-5"
                  >
                    <Paperclip />
                    写真・動画を添付
                  </Button>
                </div>

                <MockFormNotice>
                  送信の処理はまだ繋いでいません。Supabase Realtime
                  に接続して、講師側の受信箱と同期させる予定です。
                </MockFormNotice>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
        {instructor && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>お答えする人</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <p className="font-heading text-base font-medium">
                {instructor.full_name} 先生
              </p>
              {instructor.bio && (
                <p className="text-xs leading-7 text-muted-foreground">
                  {instructor.bio}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="size-4 text-brand-sage" />
              お返事について
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs leading-7 text-muted-foreground">
            <p>平日2〜3日以内を目安にお返事します。</p>
            <p>
              課題そのものへのご質問は、課題の提出画面から送っていただくと状況が分かりやすくなります。
            </p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
