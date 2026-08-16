import { AdminBackdrop } from "@/components/admin/admin-backdrop";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentAdmin } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 未ログイン・受講生はここで弾かれる（getCurrentAdmin が redirect する）。
  const admin = await getCurrentAdmin();

  return (
    // isolate がないと、body の背景（bg-background）が -z-10 の背景を覆ってしまう。
    <div
      data-view="admin"
      className="isolate flex min-h-full flex-1 flex-col lg:flex-row"
    >
      <AdminBackdrop />

      <AdminSidebar
        adminName={admin.full_name}
        initial={admin.full_name.charAt(0)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>

        <footer className="py-6">
          <p className="mx-auto w-full max-w-6xl px-5 text-xs text-muted-foreground sm:px-8">
            さすりんぱ 認定講師養成講座 管理画面 — 主催者・講師用
          </p>
        </footer>
      </div>
    </div>
  );
}
