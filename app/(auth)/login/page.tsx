import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight, Info, TriangleAlert } from "lucide-react";

import { MockField } from "@/components/mock-form";
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
import { login } from "@/lib/auth-actions";
import {
  getCertificate,
  getCourseProgress,
  getStudents,
  mockProfiles,
} from "@/lib/mock";
import { getFamilyName } from "@/lib/session";
import type { ProfileRow } from "@/types/database";

export const metadata: Metadata = {
  title: "ログイン",
};

/** クエリ文字列は同じキーが複数来ることがあるので、先頭の1件だけ使う。 */
function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

/** 誰としてログインするか選ぶときの手がかり。 */
function describeProfile(profile: ProfileRow): string {
  if (profile.role === "admin") return "講師・主催者";

  const progress = getCourseProgress(profile.id);
  const certificate = getCertificate(profile.id);

  return certificate
    ? `修了（認定ID ${certificate.certificate_no}）`
    : `受講中・進捗 ${progress.rate}%`;
}

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const next = firstValue(params.next);
  const hasError = firstValue(params.error) === "unknown-user";

  const admins = mockProfiles.filter((profile) => profile.role === "admin");
  const students = getStudents();

  return (
    <div className="flex flex-col gap-5">
      {hasError && (
        <p className="flex items-start gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-xs leading-6 text-destructive">
          <TriangleAlert aria-hidden className="mt-1 size-3.5 shrink-0" />
          <span>
            そのアカウントが見つかりませんでした。下の一覧からもう一度お選びください。
          </span>
        </p>
      )}

      {/* メール＋パスワード（見た目のみ） */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            受講生の方も講師の方も、こちらからお入りください。
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/*
            Supabase Auth 差し替えポイント:
            この form に action={signInWithPassword を呼ぶ Server Action} を渡し、
            ボタンを type="submit" に変える。入力は今は制御していない。
          */}
          <form className="flex flex-col gap-4">
            <MockField label="メールアドレス" htmlFor="login-email">
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="misaki.hanayama@example.com"
                className="rounded-2xl"
              />
            </MockField>

            <MockField label="パスワード" htmlFor="login-password">
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="rounded-2xl"
              />
            </MockField>

            <Button type="button" size="lg" className="rounded-2xl">
              ログイン
              <ArrowRight />
            </Button>
          </form>

          <p className="flex items-start gap-2 rounded-2xl bg-muted/60 px-3.5 py-2.5 text-xs leading-6 text-muted-foreground">
            <Info aria-hidden className="mt-1 size-3.5 shrink-0" />
            <span>
              パスワード認証はまだ繋いでいません。Supabase Auth の
              signInWithPassword を実装するまでは、下の一覧から選んでお入りください。
            </span>
          </p>
        </CardContent>
      </Card>

      {/* モックのプロフィールを選んでログイン */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>どなたとしてログインしますか？</CardTitle>
          <CardDescription>
            選ぶとセッションの Cookie に保存され、ロールに応じた画面へ移動します。
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/*
            1人につき1つの form にしている。1つの form に submit ボタンを並べて
            name/value で送り分ける書き方は、Server Action ではできない
            （React が action の識別に name を使うため上書きされる）。
          */}
          <div className="flex flex-col gap-1.5">
            {[...admins, ...students].map((profile) => {
              const isAdmin = profile.role === "admin";

              return (
                <form key={profile.id} action={login}>
                  <input type="hidden" name="userId" value={profile.id} />
                  {/* proxy が付けた「元々開こうとしていたページ」。 */}
                  <input type="hidden" name="next" value={next} />

                  <button
                    type="submit"
                    className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3.5 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Avatar>
                      <AvatarFallback
                        className={
                          isAdmin
                            ? "bg-brand-sage-soft text-accent-foreground"
                            : "bg-brand-pink-soft text-secondary-foreground"
                        }
                      >
                        {getFamilyName(profile).charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {profile.full_name}
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            isAdmin
                              ? "bg-brand-sage-soft text-accent-foreground"
                              : "bg-brand-pink-soft text-secondary-foreground"
                          }
                        >
                          {isAdmin ? "管理者" : "受講生"}
                        </Badge>
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {describeProfile(profile)}
                      </span>
                    </span>

                    <ChevronRight
                      aria-hidden
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                  </button>
                </form>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        はじめての方は{" "}
        <Link href="/signup" className="font-medium text-foreground underline">
          新規登録
        </Link>
        {" "}へ。
      </p>
    </div>
  );
}
