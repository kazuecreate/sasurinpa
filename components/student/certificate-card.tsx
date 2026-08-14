import { Lock } from "lucide-react";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CertificateRow } from "@/types/database";

/**
 * デジタル認定講師証の本体。
 *
 * `certificate` が null のとき（＝まだ修了していない受講生）は、
 * 氏名・認定ID・発行日を伏せた「見本」として同じ意匠を描く。
 * 発行後は同じコンポーネントがそのまま実物になる。
 */
export function CertificateCard({
  certificate,
  courseTitle,
  instructorName,
}: {
  certificate: CertificateRow | null;
  courseTitle: string;
  /** 未発行のときに見本へ出す講師名。発行後は認定証の値を使う。 */
  instructorName: string;
}) {
  const isIssued = certificate !== null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-pink-soft via-background to-brand-sage-soft p-1.5 ring-1 ring-foreground/10",
        !isIssued && "select-none",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-8 rounded-2xl border border-brand-sage/40 bg-card/80 px-6 py-12 text-center sm:px-12 sm:py-16",
          !isIssued && "opacity-45",
        )}
        // 見本は読み上げても意味がないので、支援技術からは隠す。
        aria-hidden={!isIssued}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full bg-brand-pink-soft text-2xl ring-1 ring-foreground/10"
          >
            🤲
          </span>
          <p className="font-heading text-lg font-medium tracking-widest sm:text-xl">
            認定講師証
          </p>
          <p className="text-[0.65rem] tracking-[0.3em] text-muted-foreground">
            CERTIFICATE
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">{courseTitle}</p>
          <p className="min-h-9 border-b border-brand-pink/50 px-8 pb-2 font-heading text-2xl font-medium tracking-wide sm:text-3xl">
            {certificate?.recipient_name ?? "＿＿＿＿＿"}
            <span className="ml-2 text-base font-normal">様</span>
          </p>
        </div>

        <p className="max-w-md text-sm leading-8 text-muted-foreground">
          あなたは所定の課程を修了し、
          <br className="hidden sm:inline" />
          「さすりんぱ」の認定講師として
          <br className="hidden sm:inline" />
          必要な知識と技術を修めたことをここに証します。
        </p>

        <dl className="grid w-full max-w-md gap-x-8 gap-y-4 text-left sm:grid-cols-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.7rem] text-muted-foreground">認定ID</dt>
            <dd className="font-mono text-sm">
              {certificate?.certificate_no ?? "SRP-XXXX-XXXX"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.7rem] text-muted-foreground">発行日</dt>
            <dd className="text-sm">
              {certificate ? formatDate(certificate.issued_at) : "＿年＿月＿日"}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[0.7rem] text-muted-foreground">認定講師</dt>
            <dd className="text-sm">
              {certificate?.instructor_name ?? instructorName}
            </dd>
          </div>
        </dl>
      </div>

      {!isIssued && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-card shadow-soft ring-1 ring-foreground/10">
            <Lock aria-hidden className="size-4 text-muted-foreground" />
          </span>
          <p className="text-sm font-medium">まだ発行されていません</p>
          <p className="max-w-xs text-xs leading-7 text-muted-foreground">
            修了の条件を満たすと、この認定証にあなたのお名前と認定IDが入ります。
          </p>
        </div>
      )}
    </div>
  );
}
