import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, ChevronRight } from "lucide-react";

import { SubmissionStatusBadge } from "@/components/student/status-badges";
import { SubmissionFeedback } from "@/components/student/submission-feedback";
import { SubmissionFile } from "@/components/student/submission-file";
import { SubmissionForm } from "@/components/student/submission-form";
import { SUBMISSION_KIND_META } from "@/components/student/submission-kind";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  demoCourse,
  getAssignment,
  getChapter,
  getSubmission,
} from "@/lib/mock";
import { CURRENT_STUDENT_ID } from "@/lib/session";

export async function generateMetadata({
  params,
}: PageProps<"/assignments/[assignmentId]">): Promise<Metadata> {
  const { assignmentId } = await params;
  const assignment = getAssignment(assignmentId);

  return { title: assignment?.title ?? "課題" };
}

export default async function AssignmentPage({
  params,
}: PageProps<"/assignments/[assignmentId]">) {
  const { assignmentId } = await params;

  const assignment = getAssignment(assignmentId);
  if (!assignment) notFound();

  const submission = getSubmission(assignment.id, CURRENT_STUDENT_ID);
  const chapter = assignment.chapter_id
    ? getChapter(assignment.chapter_id)
    : undefined;
  const kind = SUBMISSION_KIND_META[assignment.submission_kind];

  // 合格した課題は提出しなおす必要がないので、フォームの代わりにお祝いを出す。
  const isApproved = submission?.status === "approved";

  return (
    <div className="flex flex-col gap-6">
      <nav
        aria-label="パンくず"
        className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
      >
        <Link href="/assignments" className="hover:text-foreground">
          課題提出
        </Link>
        <ChevronRight className="size-3.5" />
        <span>{assignment.title}</span>
      </nav>

      <header className="flex flex-col gap-2.5">
        {chapter && (
          <p className="text-sm text-muted-foreground">{chapter.title}</p>
        )}
        <h1 className="font-heading text-xl font-bold leading-relaxed tracking-tight sm:text-2xl">
          {assignment.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
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
          <SubmissionStatusBadge status={submission?.status} />
        </div>
      </header>

      {assignment.description && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>課題の内容</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-muted-foreground">
            {assignment.description}
          </CardContent>
        </Card>
      )}

      {/* 提出済みの内容とフィードバック */}
      {submission && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>提出した内容</CardTitle>
            <CardDescription>
              提出日時 {formatDateTime(submission.submitted_at)}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {submission.file_url && (
              <SubmissionFile fileUrl={submission.file_url} />
            )}

            {submission.body && (
              <p className="rounded-2xl bg-muted/60 px-4 py-3.5 text-sm leading-7">
                {submission.body}
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              <h2 className="text-sm font-medium">講師からのフィードバック</h2>
              <SubmissionFeedback
                submission={submission}
                instructorName={demoCourse.instructor_name}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 提出フォーム（見た目のみ） */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isApproved && <CheckCircle2 className="size-4 text-brand-sage" />}
            {isApproved
              ? "この課題は合格しています"
              : submission
                ? "課題を再提出する"
                : "課題を提出する"}
          </CardTitle>
          {!isApproved && (
            <CardDescription>
              {submission
                ? "前回の内容を残してあります。直したところだけ書き換えて送ってください。"
                : "提出後の差し替えもできます。まずは今できるところまでで大丈夫です。"}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {isApproved ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-brand-sage-soft/50 px-4 py-3.5">
              <p className="text-sm leading-7">
                おつかれさまでした。この課題はすでに合格しているので、提出しなおす必要はありません。
                内容を見直したいときは、サポートチャットからご相談ください。
              </p>
              <ButtonLink
                href="/support"
                variant="outline"
                className="rounded-2xl bg-card"
              >
                サポートチャットをひらく
              </ButtonLink>
            </div>
          ) : (
            <SubmissionForm assignment={assignment} submission={submission} />
          )}
        </CardContent>
      </Card>

      <ButtonLink
        href="/assignments"
        variant="outline"
        size="lg"
        className="self-start rounded-2xl"
      >
        課題の一覧にもどる
      </ButtonLink>
    </div>
  );
}
