import { Send, Upload } from "lucide-react";

import { MockField, MockFormNotice } from "@/components/mock-form";
import { SUBMISSION_KIND_META } from "@/components/student/submission-kind";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssignmentRow, SubmissionRow } from "@/types/database";

/**
 * 課題の提出フォーム。いまは見た目のみで、送信しても何も起きない。
 *
 * Supabase 接続後は Storage への動画アップロード → `submissions` の upsert →
 * `revalidatePath("/assignments")` を行う Server Action をここに繋ぐ。
 * 再提出は行を増やさず同じレコードを更新する（モックデータもその前提）。
 */
export function SubmissionForm({
  assignment,
  submission,
}: {
  assignment: AssignmentRow;
  submission: SubmissionRow | undefined;
}) {
  const kind = SUBMISSION_KIND_META[assignment.submission_kind];
  const isResubmission = submission != null;

  return (
    <form className="flex flex-col gap-6">
      {kind.needsFile && (
        <MockField
          label="実技動画のファイル"
          htmlFor="submission-file"
          hint="スマートフォンで撮影したもので構いません。手元が見える角度でお願いします。"
        >
          <Input
            id="submission-file"
            type="file"
            accept="video/*"
            className="h-auto rounded-xl px-4 py-3"
          />
        </MockField>
      )}

      <MockField
        label={kind.needsBody ? "レポート本文" : "講師へのメッセージ（任意）"}
        htmlFor="submission-body"
        hint={
          kind.needsBody
            ? "800字程度が目安です。うまく書けなくても、感じたことをそのまま書いてください。"
            : "撮影時に気になったことがあれば添えてください。"
        }
      >
        <Textarea
          id="submission-body"
          rows={kind.needsBody ? 10 : 4}
          defaultValue={submission?.body ?? undefined}
          placeholder={
            kind.needsBody
              ? "3回の施術を通して感じた相手の変化と、ご自身の気づきをまとめてください。"
              : "自宅で撮影しました。ゆらすが一番むずかしかったです。"
          }
          className="rounded-xl bg-card px-4 py-3"
        />
      </MockField>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" className="h-11 rounded-xl px-5">
          {isResubmission ? <Upload /> : <Send />}
          {isResubmission ? "この内容で再提出する" : "この内容で提出する"}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="h-11 rounded-xl bg-card px-5"
        >
          下書き保存
        </Button>
      </div>

      <MockFormNotice>
        提出の受け付けはまだ繋いでいません。Supabase Storage
        へのアップロードと合わせて Server Action を実装します。
      </MockFormNotice>
    </form>
  );
}
