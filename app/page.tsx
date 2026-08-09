import { redirect } from "next/navigation";

/**
 * 認証を実装するまでは、トップに来たら受講生ダッシュボードへ送る。
 * 認証接続後はここでロールを見て、管理者は管理画面へ振り分ける。
 */
export default function Home() {
  redirect("/dashboard");
}
