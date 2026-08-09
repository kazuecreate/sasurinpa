import { StudentHeader } from "@/components/student/student-header";
import { getCurrentStudent, getFamilyName } from "@/lib/session";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証をつなぐまでは固定の受講生（花山 美咲）としてレンダリングする。
  const student = getCurrentStudent();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <StudentHeader
        studentName={student.full_name}
        initial={getFamilyName(student).charAt(0)}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-border/70 py-6">
        <p className="mx-auto w-full max-w-5xl px-5 text-xs text-muted-foreground sm:px-6">
          さすりんぱ 認定講師養成講座 — Sea Moon Original Method 〜RIKA考案〜
        </p>
      </footer>
    </div>
  );
}
