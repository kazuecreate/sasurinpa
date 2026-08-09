import type { NextConfig } from "next";

/**
 * 開発時に Server Action を通すためのオリジン許可。
 *
 * Next.js は Server Action の CSRF 対策として、リクエストの `Origin` と
 * `x-forwarded-host`（無ければ `host`）を突き合わせ、一致しなければ
 * 「Invalid Server Actions request.」（E80）で中止する。
 * ポート転送を挟むと、ブラウザが送る Origin と転送側が付ける
 * x-forwarded-host が食い違うため、素通しでは必ず弾かれる。
 *
 *   - Codespaces の転送 URL で開く   → Origin は `<codespace>-<port>.app.github.dev`
 *   - VS Code のローカル転送で開く   → Origin は `localhost:<port>`
 *
 * 判定は Origin 側をこの一覧と突き合わせる（host 側ではない）ので、
 * 両方を挙げておけばどちらの入り方でも通る。
 *
 * 実装: node_modules/next/dist/server/app-render/{action-handler,csrf-protection}.js
 * 設定: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md
 *
 * なお `localhost:*` のようなワイルドカードは効かない。Next の照合は
 * ドット区切りのラベル単位で、比較対象の host にはポートが含まれるため、
 * `localhost:*` は「そういう名前のホスト」としか一致しない（検証済み）。
 * そのためポートは列挙する。
 */

/** `next dev` の既定は 3000。埋まっていると 3001… と繰り上がるので少し余裕を持たせる。 */
const DEV_PORTS = ["3000", "3001", "3002", "3003"];

function devAllowedOrigins(): string[] {
  // 本番ビルド・本番起動では空にして、既定の同一オリジン判定に戻す。
  if (process.env.NODE_ENV !== "development") return [];

  const ports = new Set(DEV_PORTS);
  if (process.env.PORT) ports.add(process.env.PORT);

  const origins: string[] = [];

  for (const port of ports) {
    // VS Code などのローカルポート転送で開いた場合。
    origins.push(`localhost:${port}`, `127.0.0.1:${port}`);

    // Codespaces の転送 URL で直接開いた場合。
    // ワイルドカードにすると他人の Codespace まで通るので、
    // いま動いている Codespace のホスト名だけを許可する。
    const codespaceName = process.env.CODESPACE_NAME;
    const forwardingDomain =
      process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;

    if (codespaceName && forwardingDomain) {
      origins.push(`${codespaceName}-${port}.${forwardingDomain}`);
    }
  }

  return origins;
}

const allowedOrigins = devAllowedOrigins();

const nextConfig: NextConfig = {
  ...(allowedOrigins.length > 0 && {
    experimental: { serverActions: { allowedOrigins } },
  }),
};

export default nextConfig;
