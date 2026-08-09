import { AdminHeader } from "@/components/admin/admin-header";
import { getCurrentAdmin } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 未ログイン・受講生はここで弾かれる（getCurrentAdmin が redirect する）。
  const admin = await getCurrentAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AdminHeader
        adminName={admin.full_name}
        initial={admin.full_name.charAt(0)}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-border/70 py-6">
        <p className="mx-auto w-full max-w-6xl px-5 text-xs text-muted-foreground sm:px-6">
          さすりんぱ 認定講師養成講座 管理画面 — 主催者・講師用
        </p>
      </footer>
    </div>
  );
}
