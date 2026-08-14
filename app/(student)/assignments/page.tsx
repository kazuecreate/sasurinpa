import type { Metadata } from "next";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  MessageSquareQuote,
} from "lucide-react";

import { SubmissionStatusBadge } from "@/components/student/status-badges";
import { SUBMISSION_KIND_META } from "@/components/student/submission-kind";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import { demoCourse, getAssignmentsForStudent } from "@/lib/mock";
import { getCurrentStudent } from "@/lib/session";
import type { SubmissionStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "課題提出",
};

/** 提出状況ごとの、詳細画面へ誘導するボタンの文言。 */
const ACTION_LABEL: Record<SubmissionStatus | "not_submitted", string> = {
  not_submitted: "課題を提出する",
  submitted: "提出した内容を見る",
  under_review: "提出した内容を見る",
  approved: "フィードバックを見る",
  revision_requested: "内容を直して再提出する",
};

export default async function AssignmentsPage() {
  const student = await getCurrentStudent();
  const assignments = getAssignmentsForStudent(student.id);

  const approvedCount = assignments.filter(
    ({ submission }) => submission?.status === "approved",
  ).length;
  const submittedCount = assignments.filter(
    ({ submission }) => submission != null,
  ).length;
  const approvedRate =
    assignments.length === 0
      ? 0
      : Math.round((approvedCount / assignments.length) * 100);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{demoCourse.title}</p>
        <h1 className="font-heading text-2xl font-medium sm:text-3xl">
          課題提出
        </h1>
        <p className="max-w-2xl text-sm leading-8 text-muted-foreground">
          実技動画とレポートを提出すると、{demoCourse.instructor_name}
          先生が一つずつ目を通してお返事します。うまくできなくて大丈夫です、いまの状態のままお送りください。
        </p>
      </header>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">課題の合格</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {approvedCount} / {assignments.length} 合格（提出済み
              {submittedCount}件）
            </span>
          </div>
          <Progress value={approvedRate} aria-label="課題の合格状況" />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {assignments.map(({ assignment, submission }, index) => {
          const kind = SUBMISSION_KIND_META[assignment.submission_kind];

          return (
            <Card key={assignment.id} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="rounded-2xl bg-brand-pink-soft px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    課題{index + 1}
                  </span>
                  <span className="text-base">{assignment.title}</span>
                  <SubmissionStatusBadge
                    status={submission?.status}
                    className="ml-auto shrink-0"
                  />
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <kind.icon className="size-3.5" />
                    {kind.label}
                  </span>
                  {assignment.due_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      提出期限 {formatDate(assignment.due_date)}
                    </span>
                  )}
                  {submission && (
                    <span>提出 {formatDate(submission.submitted_at)}</span>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                {assignment.description && (
                  <p className="text-sm leading-8 text-muted-foreground">
                    {assignment.description}
                  </p>
                )}

                {submission?.feedback && (
                  <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 px-5 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                      <MessageSquareQuote className="size-3.5" />
                      {demoCourse.instructor_name} 先生からのフィードバック
                      {submission.score != null && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-card tabular-nums"
                        >
                          {submission.score}点
                        </Badge>
                      )}
                    </span>
                    <p className="line-clamp-2 text-xs leading-7 text-muted-foreground">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink
                    size="lg"
                    variant={
                      submission?.status === "approved" ? "outline" : "default"
                    }
                    href={`/assignments/${assignment.id}`}
                    className="h-11 rounded-xl px-5"
                  >
                    {submission?.status === "approved" ? (
                      <CheckCircle2 />
                    ) : (
                      <ClipboardList />
                    )}
                    {ACTION_LABEL[submission?.status ?? "not_submitted"]}
                    <ChevronRight />
                  </ButtonLink>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
