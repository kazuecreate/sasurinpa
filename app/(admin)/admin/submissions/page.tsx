import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  ListFilter,
  MonitorPlay,
  RotateCcw,
  Send,
} from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatTile, StatTileGrid } from "@/components/admin/stat-tile";
import {
  MockField,
  MockFormNotice,
  MockSelect,
} from "@/components/mock-form";
import { SubmissionStatusBadge } from "@/components/student/status-badges";
import { SUBMISSION_KIND_META } from "@/components/student/submission-kind";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  getAssignment,
  getPendingSubmissions,
  getProfile,
  getReviewedSubmissions,
} from "@/lib/mock";

export const metadata: Metadata = {
  title: "課題添削",
};

/** 添削フォームの返信ステータス。 */
const REVIEW_STATUS_OPTIONS = {
  approved: "合格にする",
  revision_requested: "再提出をお願いする",
  under_review: "添削中のままにする",
};

export default function AdminSubmissionsPage() {
  const pending = getPendingSubmissions();
  const reviewed = getReviewedSubmissions();

  const approvedCount = reviewed.filter((s) => s.status === "approved").length;
  const revisionCount = reviewed.filter(
    (s) => s.status === "revision_requested",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="課題添削・フィードバック"
        description="受講生から届いた実技動画とレポートを確認し、評価とコメントを返します。まずは提出の古いものから順に並んでいます。"
      >
        <Button variant="outline" size="lg" className="rounded-2xl">
          <ListFilter />
          絞り込み
        </Button>
      </AdminPageHeader>

      <StatTileGrid>
        <StatTile
          label="添削待ち"
          value={pending.length}
          unit="件"
          icon={ClipboardList}
          tone="pink"
        />
        <StatTile
          label="再提出をお願い中"
          value={revisionCount}
          unit="件"
          icon={RotateCcw}
          tone="pink"
        />
        <StatTile
          label="合格"
          value={approvedCount}
          unit="件"
          icon={CheckCircle2}
          tone="sage"
        />
        <StatTile
          label="提出の総数"
          value={pending.length + reviewed.length}
          unit="件"
          icon={FileText}
          tone="muted"
        />
      </StatTileGrid>

      {/* 添削待ち */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-bold tracking-tight">
          添削待ちの提出（{pending.length}件）
        </h2>

        {pending.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              いま添削をお待ちの課題はありません。
            </CardContent>
          </Card>
        ) : (
          pending.map((submission) => {
            const assignment = getAssignment(submission.assignment_id);
            const student = getProfile(submission.student_id);

            return (
              <Card key={submission.id} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-brand-pink-soft text-secondary-foreground">
                        {student?.full_name.charAt(0) ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{student?.full_name ?? "（不明な受講生）"}</span>
                    <SubmissionStatusBadge status={submission.status} />
                    {assignment && (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground"
                      >
                        {SUBMISSION_KIND_META[assignment.submission_kind].label}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>{assignment?.title}</span>
                    <span className="flex items-center gap-1 text-xs">
                      <CalendarDays className="size-3.5" />
                      提出 {formatDateTime(submission.submitted_at)}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  {/* 提出物 */}
                  <div className="flex flex-1 flex-col gap-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      提出内容
                    </p>

                    {submission.file_url && (
                      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-brand-sage-soft/50 px-4 py-3">
                        <span
                          aria-hidden
                          className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-card ring-1 ring-foreground/10"
                        >
                          <MonitorPlay className="size-4 text-brand-sage" />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                          {submission.file_url}
                        </span>
                        <Button variant="secondary" disabled>
                          動画を再生
                        </Button>
                      </div>
                    )}

                    {submission.body && (
                      <p className="rounded-2xl bg-muted/60 px-3.5 py-3 text-sm leading-7">
                        {submission.body}
                      </p>
                    )}
                  </div>

                  {/* 添削フォーム（見た目のみ） */}
                  <form className="flex w-full flex-col gap-3 rounded-2xl bg-brand-pink-soft/40 p-4 lg:max-w-sm">
                    <p className="text-xs font-medium text-secondary-foreground">
                      評価とコメントを返す
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <MockField
                        label="評価（100点満点）"
                        htmlFor={`score-${submission.id}`}
                      >
                        <Input
                          id={`score-${submission.id}`}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="85"
                          className="rounded-2xl bg-card"
                        />
                      </MockField>

                      <MockField
                        label="返信ステータス"
                        htmlFor={`status-${submission.id}`}
                      >
                        <MockSelect
                          id={`status-${submission.id}`}
                          options={REVIEW_STATUS_OPTIONS}
                          className="bg-card"
                        />
                      </MockField>
                    </div>

                    <MockField
                      label="コメント"
                      htmlFor={`feedback-${submission.id}`}
                      hint="よかった点をひとつ添えると、受講生が次に進みやすくなります。"
                    >
                      <Textarea
                        id={`feedback-${submission.id}`}
                        rows={5}
                        placeholder="圧の抜き方がとても上手です。ゆらすは手首ではなく体重移動を意識してみてください。"
                        className="rounded-2xl bg-card"
                      />
                    </MockField>

                    <div className="flex flex-wrap gap-2">
                      <Button type="button" className="rounded-2xl">
                        <Send />
                        この内容で返信する
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl bg-card"
                      >
                        下書き保存
                      </Button>
                    </div>

                    <MockFormNotice />
                  </form>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      {/* 添削済み */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>添削済みの履歴</CardTitle>
          <CardDescription>
            返信した内容は受講生のダッシュボードにそのまま表示されます。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>受講生</TableHead>
                <TableHead>課題</TableHead>
                <TableHead>結果</TableHead>
                <TableHead className="text-right">評価</TableHead>
                <TableHead>添削日</TableHead>
                <TableHead className="min-w-64">コメント</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reviewed.map((submission) => {
                const assignment = getAssignment(submission.assignment_id);
                const student = getProfile(submission.student_id);

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {student?.full_name ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {assignment?.title}
                    </TableCell>
                    <TableCell>
                      <SubmissionStatusBadge status={submission.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {submission.score != null ? `${submission.score}点` : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {submission.reviewed_at
                        ? formatDate(submission.reviewed_at)
                        : "—"}
                    </TableCell>
                    <TableCell className="whitespace-normal text-xs leading-6 text-muted-foreground">
                      <span className="line-clamp-2">
                        {submission.feedback ?? "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
