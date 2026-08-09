import type { Metadata } from "next";
import {
  Award,
  ClipboardList,
  Download,
  GraduationCap,
  MessageCircle,
  UserPlus,
  Users,
} from "lucide-react";

import { EnrollmentStatusBadge } from "@/components/admin/admin-badges";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatTile, StatTileGrid } from "@/components/admin/stat-tile";
import { SubmissionStatusBadge } from "@/components/student/status-badges";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import {
  demoCourse,
  getAssignments,
  getAssignmentsForStudent,
  getCertificate,
  getCourseProgress,
  getEnrollment,
  getOrderedLessons,
  getPendingSubmissions,
  getStudents,
  getThreadForStudent,
  getUnreadCount,
} from "@/lib/mock";
import { getCurrentAdmin, getFamilyName } from "@/lib/session";

export const metadata: Metadata = {
  title: "受講生管理",
};

export default async function AdminStudentsPage() {
  const admin = await getCurrentAdmin();

  const assignments = getAssignments();
  const lessonCount = getOrderedLessons().length;

  // 一覧に出す 1 行分をまとめる。Supabase 接続後もこの組み立て方は変えずに済む。
  const rows = getStudents().map((student) => {
    const thread = getThreadForStudent(student.id);

    return {
      student,
      enrollment: getEnrollment(student.id),
      progress: getCourseProgress(student.id),
      submissions: getAssignmentsForStudent(student.id),
      certificate: getCertificate(student.id),
      unreadCount: thread ? getUnreadCount(thread.id, admin.id) : 0,
    };
  });

  const activeCount = rows.filter((r) => r.enrollment?.status === "active")
    .length;
  const completedCount = rows.filter(
    (r) => r.enrollment?.status === "completed",
  ).length;
  const pendingCount = getPendingSubmissions().length;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow={demoCourse.title}
        title="受講生管理"
        description="受講生の進捗と課題の提出状況をまとめて確認できます。気になる方にはサポートチャットから声をかけてみてください。"
      >
        <Button variant="outline" size="lg" className="rounded-2xl">
          <Download />
          名簿を書き出す
        </Button>
        <Button size="lg" className="rounded-2xl">
          <UserPlus />
          受講生を招待する
        </Button>
      </AdminPageHeader>

      <StatTileGrid>
        <StatTile
          label="受講生"
          value={rows.length}
          unit="名"
          icon={Users}
          tone="pink"
        />
        <StatTile
          label="受講中"
          value={activeCount}
          unit="名"
          icon={GraduationCap}
          tone="pink"
        />
        <StatTile
          label="修了（認定済み）"
          value={completedCount}
          unit="名"
          icon={Award}
          tone="sage"
        />
        <StatTile
          label="添削待ちの課題"
          value={pendingCount}
          unit="件"
          icon={ClipboardList}
          tone="sage"
          hint="「課題添削」から確認できます"
        />
      </StatTileGrid>

      {/* 受講生一覧 */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>受講生一覧</CardTitle>
          <CardDescription>
            氏名の五十音順。進捗は全{lessonCount}レッスン、課題は全
            {assignments.length}本に対する割合です。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>受講生</TableHead>
                <TableHead>受講状況</TableHead>
                <TableHead className="w-56">学習進捗</TableHead>
                <TableHead>課題の合格</TableHead>
                <TableHead>認定ID</TableHead>
                <TableHead>最終ログイン</TableHead>
                <TableHead className="text-right">未読</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map(
                ({
                  student,
                  enrollment,
                  progress,
                  submissions,
                  certificate,
                  unreadCount,
                }) => {
                  const approvedCount = submissions.filter(
                    ({ submission }) => submission?.status === "approved",
                  ).length;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-brand-pink-soft text-secondary-foreground">
                              {getFamilyName(student).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col leading-tight">
                            <span className="font-medium">
                              {student.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <EnrollmentStatusBadge status={enrollment?.status} />
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {progress.completed} / {progress.total} レッスン（
                            {progress.rate}%）
                          </span>
                          <Progress
                            value={progress.rate}
                            aria-label={`${student.full_name}の学習進捗`}
                          />
                        </div>
                      </TableCell>

                      <TableCell className="tabular-nums">
                        {approvedCount} / {assignments.length}
                      </TableCell>

                      <TableCell>
                        {certificate ? (
                          <span className="font-mono text-xs">
                            {certificate.certificate_no}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(student.updated_at)}
                      </TableCell>

                      <TableCell className="text-right">
                        {unreadCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-2xl bg-brand-pink-soft px-2 py-1 text-xs font-medium text-secondary-foreground tabular-nums">
                            <MessageCircle className="size-3.5" />
                            {unreadCount}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 課題の提出状況（受講生 × 課題） */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>課題の提出状況</CardTitle>
          <CardDescription>
            提出のあった課題は「課題添削」から個別に確認・返信できます。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>受講生</TableHead>
                {assignments.map((assignment) => (
                  <TableHead key={assignment.id} className="min-w-40">
                    <span className="flex flex-col gap-0.5 py-1 leading-tight">
                      <span className="whitespace-normal">
                        {assignment.title}
                      </span>
                      {assignment.due_date && (
                        <span className="text-xs font-normal text-muted-foreground">
                          期限 {formatDate(assignment.due_date)}
                        </span>
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map(({ student, submissions }) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.full_name}
                  </TableCell>

                  {submissions.map(({ assignment, submission }) => (
                    <TableCell key={assignment.id}>
                      <div className="flex flex-col items-start gap-1">
                        <SubmissionStatusBadge status={submission?.status} />
                        {submission && (
                          <span className="text-xs text-muted-foreground tabular-nums">
                            提出 {formatDate(submission.submitted_at)}
                            {submission.score != null &&
                              `・${submission.score}点`}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
