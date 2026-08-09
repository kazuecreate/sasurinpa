import Link from "next/link"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ボタンの見た目をした遷移リンク。
 *
 * Base UI の Button はボタンのセマンティクスを強制するため、`render` に
 * `<Link>`（= `<a>`）を渡すと `role="button"` が付き、開発時には
 * 「nativeButton の指定と描画されたタグが違う」という警告が出る。
 * リンクはリンクのまま、クラスだけボタンと共有するのが Base UI 推奨の形。
 * https://base-ui.com/react/components/button#rendering-links-as-buttons
 */
function ButtonLink({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Link
      data-slot="button-link"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ButtonLink }
