import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <span aria-hidden className="text-4xl">
        🤲
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-xl font-bold">
          ページが見つかりませんでした
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          お探しのページは移動したか、削除された可能性があります。
        </p>
      </div>
      <Button
        size="lg"
        className="rounded-2xl"
        render={<Link href="/dashboard">ダッシュボードへもどる</Link>}
      />
    </main>
  );
}
