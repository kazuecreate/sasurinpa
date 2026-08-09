import type { Metadata } from "next";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardList,
  Download,
  Printer,
} from "lucide-react";

import { CertificateCard } from "@/components/student/certificate-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/format";
import {
  demoCourse,
  getAssignmentsForStudent,
  getCertificate,
  getCourseProgress,
} from "@/lib/mock";
import { getCurrentStudent } from "@/lib/session";

export const metadata: Metadata = {
  title: "デジタル認定講師証",
};

export default async function CertificatePage() {
  const student = await getCurrentStudent();
  const certificate = getCertificate(student.id);

  const progress = getCourseProgress(student.id);
  const assignments = getAssignmentsForStudent(student.id);
  const approvedCount = assignments.filter(
    ({ submission }) => submission?.status === "approved",
  ).length;

  /** 修了の条件。すべて満たすと認定証が発行される。 */
  const requirements = [
    {
      label: "全レッスンの受講",
      current: progress.completed,
      total: progress.total,
      href: "/curriculum",
      linkLabel: "カリキュラムをひらく",
      icon: BookOpen,
    },
    {
      label: "全課題の合格",
      current: approvedCount,
      total: assignments.length,
      href: "/assignments",
      linkLabel: "課題ページをひらく",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="text-sm text-muted-foreground">{demoCourse.title}</p>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          デジタル認定講師証
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
          {certificate
            ? "修了おめでとうございます。認定IDはサロンの名刺やご案内にもお使いいただけます。"
            : "全レッスンの受講と全課題の合格で発行されます。あと少し、ご自分のペースで進めていきましょう。"}
        </p>
      </header>

      <CertificateCard
        certificate={certificate ?? null}
        courseTitle={demoCourse.title}
        instructorName={demoCourse.instructor_name}
      />

      {certificate ? (
        <>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>認定証の保存・共有</CardTitle>
              <CardDescription>
                発行日 {formatDate(certificate.issued_at)}／認定ID{" "}
                <span className="font-mono">{certificate.certificate_no}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="lg" disabled className="rounded-2xl">
                  <Printer />
                  印刷する
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  disabled
                  className="rounded-2xl"
                >
                  <Download />
                  画像として保存
                </Button>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                印刷用の書き出しはこれから接続します。認定講師ページへの掲載申請は、サポートチャットから承っています。
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>認定講師として</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <ul className="flex list-disc flex-col gap-1.5 pl-4 text-sm leading-7 text-muted-foreground">
                <li>名刺やご案内に「さすりんぱ認定講師」と認定IDを記載できます。</li>
                <li>公式サイトの「認定講師をさがす」ページへ掲載申請ができます。</li>
                <li>卒業生向けの勉強会・資材のご案内が届きます。</li>
              </ul>
              <ButtonLink
                href="/support"
                variant="outline"
                className="self-start rounded-2xl"
              >
                掲載申請について相談する
              </ButtonLink>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>修了までの条件</CardTitle>
            <CardDescription>
              {student.full_name} さんの、いまの達成状況です。
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {requirements.map((requirement) => {
              const isDone =
                requirement.total > 0 &&
                requirement.current >= requirement.total;
              const rate =
                requirement.total === 0
                  ? 0
                  : Math.round(
                      (requirement.current / requirement.total) * 100,
                    );

              return (
                <div key={requirement.label} className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {isDone ? (
                      <CheckCircle2
                        aria-hidden
                        className="size-4 text-brand-sage"
                      />
                    ) : (
                      <Circle
                        aria-hidden
                        className="size-4 text-muted-foreground"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {requirement.label}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                      {requirement.current} / {requirement.total}
                    </span>
                  </div>

                  <Progress
                    value={rate}
                    aria-label={`${requirement.label}の達成状況`}
                  />

                  <ButtonLink
                    href={requirement.href}
                    variant="outline"
                    className="self-start rounded-2xl"
                  >
                    <requirement.icon />
                    {requirement.linkLabel}
                  </ButtonLink>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
