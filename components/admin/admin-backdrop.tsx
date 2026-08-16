import { cn } from "@/lib/utils";

/**
 * 管理画面の背景（`docs/admin-reference.png`）。
 *
 * 淡いグラデーションの上に、水彩のにじみ（ぼかした円）と花・葉を重ねる。
 * 写真素材は使わず、かたちはすべて CSS（`.admin-flower` / `.admin-leaf` は
 * `app/globals.css` にある）。
 *
 * 表とデータが読みにくくならないよう、モチーフは画面のふちに寄せて薄く置き、
 * 本文はこの上の白いカードに載る。`aria-hidden` の純粋な装飾。
 */
export function AdminBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-linear-to-br from-brand-pink-soft/45 via-background to-brand-sage-soft/35"
    >
      {/* 水彩のにじみ */}
      <span className="absolute -top-32 -left-24 size-96 rounded-full bg-brand-pink-soft/50 blur-3xl" />
      <span className="absolute top-1/4 -right-32 size-[30rem] rounded-full bg-brand-pink/12 blur-3xl" />
      <span className="absolute -bottom-40 right-1/4 size-[34rem] rounded-full bg-brand-sage-soft/40 blur-3xl" />
      <span className="absolute -bottom-24 -left-16 size-80 rounded-full bg-brand-pink-soft/35 blur-3xl" />

      {/*
        右下の花のまとまり。狭い画面では右隅だけに寄せる（sm 未満で左へ伸びる分は
        出さない）——本文の下に来るフッターの細かい文字と重ならないようにするため。
      */}
      <Leaf className="hidden sm:block sm:right-40 sm:bottom-52 sm:h-28 sm:w-10 sm:rotate-[35deg] sm:opacity-45" />
      <Leaf className="right-16 bottom-56 h-24 w-9 -rotate-[18deg] opacity-40" />
      <Leaf className="right-4 bottom-24 h-32 w-12 rotate-[62deg] opacity-35" />

      <Flower className="-right-8 bottom-6 size-44 opacity-55 blur-[1px] sm:right-20 sm:bottom-10 sm:size-64" />
      <Flower
        className="-right-6 bottom-28 size-28 opacity-50 sm:right-0 sm:bottom-36 sm:size-36"
        petals={5}
        tone="cream"
      />
      <Flower
        className="hidden sm:block sm:right-52 sm:bottom-0 sm:size-40 sm:opacity-40 sm:blur-[2px]"
        petals={5}
      />
      <Flower
        className="hidden sm:block sm:right-48 sm:bottom-40 sm:size-20 sm:opacity-45"
        petals={6}
        tone="cream"
      />

      {/*
        右上は角から覗くだけにする。本文の右上には見出し横のボタンが来るので、
        枠の外にはみ出させて（-top-8）薄く置き、文字の下地を汚さない。
      */}
      <Leaf className="top-8 right-28 h-14 w-5 rotate-[28deg] opacity-25" />
      <Flower
        className="-top-8 right-2 size-28 opacity-30 blur-[1px]"
        petals={5}
      />
    </div>
  );
}

/** CSS だけで描く花。`petals` 枚の花びらを中心のまわりに等間隔で回す。 */
function Flower({
  className,
  petals = 6,
  tone,
}: {
  className?: string;
  petals?: number;
  /** cream は参考画像のかすみ草のような白い小花。既定はピンク。 */
  tone?: "cream";
}) {
  return (
    <span
      data-tone={tone}
      className={cn("admin-flower absolute", className)}
    >
      {Array.from({ length: petals }, (_, index) => (
        <i
          key={index}
          style={
            { "--petal": `${(360 / petals) * index}deg` } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

/** CSS だけで描く葉。大きさと角度は呼び出し側のクラスで決める。 */
function Leaf({ className }: { className?: string }) {
  return <span className={cn("admin-leaf absolute", className)} />;
}
