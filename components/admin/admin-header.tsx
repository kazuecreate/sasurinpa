"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  ExternalLink,
  Layers,
  Megaphone,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** 管理画面のナビゲーション。受講生ヘッダーとは別建てにしている。 */
const NAV_ITEMS = [
  { href: "/admin/students", label: "受講生管理", icon: Users },
  { href: "/admin/submissions", label: "課題添削", icon: ClipboardCheck },
  { href: "/admin/curriculum", label: "教材管理", icon: Layers },
  { href: "/admin/announcements", label: "お知らせ", icon: Megaphone },
] as const;

type AdminHeaderProps = {
  adminName: string;
  /** アバターのフォールバックに出す一文字。 */
  initial: string;
};

export function AdminHeader({ adminName, initial }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-card/90 backdrop-blur-md">
      {/* 受講生画面と見分けがつくよう、上端にセージのラインを引く。 */}
      <div aria-hidden className="h-1 bg-brand-sage" />

      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 sm:px-6">
        <Link href="/admin/students" className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-2xl bg-brand-sage-soft text-base"
          >
            🌿
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-base font-bold tracking-tight">
              さすりんぱ 管理
            </span>
            <span className="hidden text-[0.7rem] text-muted-foreground sm:block">
              主催者・講師用
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 border-border/70 sm:order-3 sm:border-l sm:pl-3">
          <Avatar>
            <AvatarFallback className="bg-brand-sage-soft text-accent-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">
            {adminName}
          </span>
          <Badge
            variant="secondary"
            className="bg-brand-sage-soft text-accent-foreground"
          >
            管理者
          </Badge>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 rounded-2xl px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            <span className="hidden lg:inline">受講生画面</span>
          </Link>
        </div>

        <nav className="flex w-full items-center gap-1 sm:order-2 sm:w-auto">
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
                    ? "bg-brand-sage-soft text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
