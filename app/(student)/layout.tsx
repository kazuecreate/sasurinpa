import { StudentHeader } from "@/components/student/student-header";
import { getCurrentStudent, getFamilyName } from "@/lib/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 未ログイン・管理者はここで弾かれる（getCurrentStudent が redirect する）。
  const student = await getCurrentStudent();

  return (
    // data-view="student" が globals.css の受講生向けスコープ（角丸・カード余白）の起点。
    <div data-view="student" className="flex min-h-full flex-1 flex-col">
      <StudentHeader
        studentName={student.full_name}
        initial={getFamilyName(student).charAt(0)}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>

      <footer className="border-t border-border/70 py-10">
        <p className="mx-auto w-full max-w-5xl px-5 text-xs leading-7 text-muted-foreground sm:px-8">
          さすりんぱ 認定講師養成講座 — Sea Moon Original Method 〜RIKA考案〜
        </p>
      </footer>
    </div>
  );
}
