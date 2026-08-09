import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import { MockField, MockFormNotice } from "@/components/mock-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-5">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>新規登録</CardTitle>
          <CardDescription>
            受講のお申し込みが済んだ方のご登録ページです。お名前はご本名でお願いします。
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/*
            Supabase Auth 差し替えポイント:
            この form に action={supabase.auth.signUp を呼ぶ Server Action} を渡す。
            登録後は profiles に role="student" の行を作り、確認メールの案内を出す。
          */}
          <form className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <MockField label="お名前" htmlFor="signup-name">
                <Input
                  id="signup-name"
                  autoComplete="name"
                  placeholder="花山 美咲"
                  className="rounded-2xl"
                />
              </MockField>

              <MockField label="ふりがな" htmlFor="signup-furigana">
                <Input
                  id="signup-furigana"
                  placeholder="ハナヤマ ミサキ"
                  className="rounded-2xl"
                />
              </MockField>
            </div>

            <MockField label="メールアドレス" htmlFor="signup-email">
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="misaki.hanayama@example.com"
                className="rounded-2xl"
              />
            </MockField>

            <MockField
              label="パスワード"
              htmlFor="signup-password"
              hint="8文字以上で、英字と数字を混ぜてください。"
            >
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="rounded-2xl"
              />
            </MockField>

            <MockField label="パスワード（確認）" htmlFor="signup-password-confirm">
              <Input
                id="signup-password-confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="rounded-2xl"
              />
            </MockField>

            <div className="flex items-start gap-2.5">
              <Checkbox id="signup-terms" className="mt-0.5" />
              <Label
                htmlFor="signup-terms"
                className="text-xs leading-6 font-normal text-muted-foreground"
              >
                利用規約とプライバシーポリシーに同意します
              </Label>
            </div>

            <Button type="button" size="lg" className="rounded-2xl">
              <UserPlus />
              この内容で登録する
            </Button>
          </form>

          <MockFormNotice>
            登録の処理はまだ繋いでいません。Supabase Auth の signUp と
            profiles への行追加を実装するまでは、ログイン画面から既存のプロフィールをお選びください。
          </MockFormNotice>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="font-medium text-foreground underline">
          ログイン
        </Link>
        {" "}へ。
      </p>
    </div>
  );
}
