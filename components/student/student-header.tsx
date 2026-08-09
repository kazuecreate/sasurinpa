"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/curriculum", label: "カリキュラム", icon: BookOpen },
  { href: "/assignments", label: "課題", icon: ClipboardList },
  { href: "/support", label: "サポート", icon: MessagesSquare },
  { href: "/certificate", label: "認定証", icon: Award },
] as const;

type StudentHeaderProps = {
  studentName: string;
  /** アバターのフォールバックに出す一文字（姓の頭文字）。 */
  initial: string;
};

export function StudentHeader({ studentName, initial }: StudentHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
      {/* 項目が5つあるので、狭い画面ではメニューだけを2行目に折り返す。 */}
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:flex-nowrap sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-2xl bg-brand-pink-soft text-base text-primary-foreground"
          >
            🤲
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-base font-bold tracking-tight">
              さすりんぱ
            </span>
            <span className="hidden text-[0.7rem] text-muted-foreground sm:block">
              Sea Moon Original Method
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:order-last sm:border-l sm:border-border/70 sm:pl-3">
          <Avatar>
            <AvatarFallback className="bg-brand-sage-soft text-accent-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium lg:inline">
            {studentName}
          </span>

          {/* Server Action を直接 action に渡す（Cookie の削除はサーバー側でしか行えない）。 */}
          <form action={logout}>
            <button
              type="submit"
              title="ログアウト"
              className="flex items-center gap-1.5 rounded-2xl px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-3.5" />
              <span className="sr-only lg:not-sr-only">ログアウト</span>
            </button>
          </form>
        </div>

        <nav
          aria-label="メインメニュー"
          className="order-last flex w-full flex-wrap items-center gap-1 sm:order-none sm:ml-auto sm:w-auto sm:flex-nowrap"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-pink-soft text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {/* 横並びになる中間サイズだけラベルを隠す（読み上げには残す）。 */}
                <span className="sm:sr-only lg:not-sr-only">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
