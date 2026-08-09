import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

const palette = [
  { name: "Primary Pink", token: "bg-brand-pink", hex: "#E8A5B8" },
  { name: "Pink Soft", token: "bg-brand-pink-soft", hex: "#FCE7F0" },
  { name: "Accent Sage", token: "bg-brand-sage", hex: "#8DA399" },
  { name: "Sage Soft", token: "bg-brand-sage-soft", hex: "#D8E2DC" },
  { name: "Base Cream", token: "bg-brand-cream", hex: "#FAF8F5" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Sea Moon Original Method 〜RIKA考案〜
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          さすりんぱ 講師養成講座
        </h1>
        <p className="text-muted-foreground">
          デザインシステムのセットアップが完了しました。画面の実装はこれからです。
        </p>
      </header>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>カラーパレット</CardTitle>
          <CardDescription>
            トークンは app/globals.css の @theme inline に定義しています。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {palette.map((color) => (
            <div key={color.hex} className="flex flex-col gap-1.5">
              <div
                className={`h-14 rounded-2xl ring-1 ring-foreground/10 ${color.token}`}
              />
              <span className="text-xs font-medium">{color.name}</span>
              <span className="text-xs text-muted-foreground">{color.hex}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>共通コンポーネント</CardTitle>
          <CardDescription>shadcn/ui: Button / Card / Progress</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Button size="lg">受講をはじめる</Button>
            <Button size="lg" variant="secondary">
              教材を見る
            </Button>
            <Button size="lg" variant="outline">
              お問い合わせ
            </Button>
            <Button size="lg" variant="ghost">
              あとで
            </Button>
          </div>
          <Progress value={45}>
            <ProgressLabel>学習進捗</ProgressLabel>
            <ProgressValue />
          </Progress>
        </CardContent>
      </Card>
    </main>
  );
}
