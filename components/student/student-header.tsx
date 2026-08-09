"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/curriculum", label: "カリキュラム", icon: BookOpen },
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
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-3 sm:px-6">
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

        <nav className="ml-auto flex items-center gap-1">
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
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 border-l border-border/70 pl-3">
          <Avatar>
            <AvatarFallback className="bg-brand-sage-soft text-accent-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">
            {studentName}
          </span>
        </div>
      </div>
    </header>
  );
}
