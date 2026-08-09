/**
 * ログイン・新規登録の共通レイアウト。
 * ヘッダーナビは出さず、1枚のカードに集中させる。
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-linear-to-b from-brand-pink-soft/60 via-background to-brand-sage-soft/40">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-2xl bg-card text-2xl shadow-soft ring-1 ring-foreground/10"
          >
            🤲
          </span>
          <h1 className="font-heading text-xl font-bold tracking-tight">
            さすりんぱ 認定講師養成講座
          </h1>
          <p className="text-xs text-muted-foreground">
            Sea Moon Original Method 〜RIKA考案〜
          </p>
        </div>

        {children}
      </main>

      <footer className="py-6">
        <p className="mx-auto w-full max-w-md px-5 text-center text-xs text-muted-foreground sm:px-6">
          © Sea Moon Original Method
        </p>
      </footer>
    </div>
  );
}
