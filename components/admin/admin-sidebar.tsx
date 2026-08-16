"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  Layers,
  LogOut,
  Megaphone,
  Menu,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

/** 管理画面のナビゲーション。受講生ヘッダーとは別建てにしている。 */
const NAV_ITEMS = [
  { href: "/admin/students", label: "受講生管理", icon: Users },
  { href: "/admin/submissions", label: "課題添削", icon: ClipboardCheck },
  { href: "/admin/curriculum", label: "教材管理", icon: Layers },
  { href: "/admin/announcements", label: "お知らせ", icon: Megaphone },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  adminName: string;
  /** アバターのフォールバックに出す一文字。 */
  initial: string;
};

/**
 * 左固定のサイドバー（`docs/admin-reference.png`）。
 *
 * lg 以上では画面左に貼り付いたまま、lg 未満では上部バーのボタンで開く
 * 引き出しになる。閉じている引き出しは DOM に出さないので、画面外の
 * リンクにフォーカスが入ることはない。
 */
export function AdminSidebar({ adminName, initial }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentLabel = NAV_ITEMS.find((item) =>
    isCurrent(pathname, item.href),
  )?.label;

  // 引き出しの中のリンクは onNavigate で自分で閉じるので、pathname を見て
  // 閉じる副作用は要らない（effect 内の setState は react-hooks 側で禁じられている）。

  // 開いたら閉じるボタンへフォーカスを移し、Esc でも閉じられるようにする。
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* lg 未満：サイドバーを開くための上部バー */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-brand-sage/25 bg-card/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          className="flex size-10 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-brand-sage-soft/60 hover:text-foreground"
        >
          <Menu className="size-5" />
          <span className="sr-only">メニューをひらく</span>
        </button>

        <span className="font-heading text-sm font-medium">さすりんぱ 管理</span>

        {currentLabel && (
          <span className="ml-auto truncate text-xs text-muted-foreground">
            {currentLabel}
          </span>
        )}
      </div>

      {/* lg 未満：引き出し本体 */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 animate-in bg-foreground/25 fade-in backdrop-blur-sm"
          >
            <span className="sr-only">メニューを閉じる</span>
          </button>

          <div className="relative flex h-full w-72 max-w-[85%] animate-in duration-200 slide-in-from-left">
            <SidebarPanel
              pathname={pathname}
              adminName={adminName}
              initial={initial}
              onNavigate={() => setIsOpen(false)}
              closeButtonRef={closeButtonRef}
            />
          </div>
        </div>
      )}

      {/* lg 以上：常に見えている左サイドバー */}
      <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64 lg:shrink-0">
        <SidebarPanel
          pathname={pathname}
          adminName={adminName}
          initial={initial}
        />
      </aside>
    </>
  );
}

/**
 * サイドバーの中身。固定表示と引き出しで同じものを使う。
 * `closeButtonRef` が渡されたときだけ、右上に閉じるボタンを出す（＝引き出しのとき）。
 */
function SidebarPanel({
  pathname,
  adminName,
  initial,
  onNavigate,
  closeButtonRef,
}: AdminSidebarProps & {
  pathname: string;
  onNavigate?: () => void;
  closeButtonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-8 overflow-y-auto border-r border-brand-sage/25 bg-brand-sage-soft/70 px-4 py-6 backdrop-blur-md">
      {/* ロゴ */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href="/admin/students"
          onClick={onNavigate}
          className="flex flex-1 flex-col items-center gap-2 rounded-2xl py-2 text-center transition-colors hover:bg-card/50"
        >
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-full bg-card/80 text-xl ring-1 ring-brand-sage/30"
          >
            🌿
          </span>
          <span className="flex flex-col gap-0.5 leading-tight">
            <span className="font-heading text-sm font-medium tracking-tight">
              さすりんぱ
            </span>
            <span className="text-[0.65rem] tracking-[0.25em] text-muted-foreground">
              ADMIN
            </span>
          </span>
        </Link>

        {closeButtonRef && (
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onNavigate}
            className="flex size-9 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            <X className="size-4" />
            <span className="sr-only">メニューを閉じる</span>
          </button>
        )}
      </div>

      <nav aria-label="管理メニュー" className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = isCurrent(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-sage-soft text-accent-foreground ring-1 ring-brand-sage/25"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 最下部：だれで入っているかと、ログアウト */}
      <div className="mt-auto flex flex-col gap-2 border-t border-brand-sage/25 pt-4">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <Avatar>
            <AvatarFallback className="bg-card text-accent-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium">{adminName}</span>
            <span className="text-[0.7rem] text-muted-foreground">管理者</span>
          </span>
        </div>

        {/*
          Server Action を直接 action に渡す（Cookie の削除はサーバー側でしか行えない）。
          以前ヘッダーにあった「受講生画面」リンクは外したまま。ロールで振り分けるように
          なったため、管理者が /dashboard を開いても /admin に戻されるだけになる。
          受講生画面の下見が要るなら、なりすまし（impersonation）の実装が必要。
        */}
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            ログアウト
          </button>
        </form>
      </div>
    </div>
  );
}
