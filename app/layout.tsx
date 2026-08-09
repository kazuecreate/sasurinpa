import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

// subsets を指定すると next/font が latin 系しか取得せず、日本語グリフが
// フォールバックしてしまう（Next の font data に "japanese" が無いため指定もできない）。
// preload: false + subsets 省略で全 subset の @font-face を取り込む。
const rounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "さすりんぱ | 講師養成講座",
    template: "%s | さすりんぱ",
  },
  description:
    "Sea Moon Original Method 〜RIKA考案〜「さすりんぱ」講師養成講座の受講プラットフォーム。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${rounded.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
