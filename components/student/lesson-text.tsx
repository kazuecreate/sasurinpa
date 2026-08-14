import { Fragment, type ReactNode } from "react";

/**
 * Web テキスト教材（`lessons.content`）の簡易 Markdown レンダラー。
 *
 * 教材で使っている記法だけを扱う：見出し `##`、箇条書き `- `、太字 `**`、段落。
 * 記法が増えるようなら remark 系ライブラリへの差し替えを検討する。
 */
export function LessonText({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-5 text-[0.95rem] leading-8">
      {parseBlocks(content)}
    </div>
  );
}

function parseBlocks(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];

  let paragraph: string[] = [];
  let bullets: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <p key={`p-${blocks.length}`}>{renderInline(paragraph.join(""))}</p>,
    );
    paragraph = [];
  };

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="flex flex-col gap-3 pl-1">
        {bullets.map((item, index) => (
          <li key={index} className="flex gap-2.5">
            <span aria-hidden className="mt-3.5 size-1.5 shrink-0 rounded-full bg-brand-pink" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      flushBullets();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushBullets();
      blocks.push(
        <h2
          key={`h-${blocks.length}`}
          className="mt-3 flex items-center gap-2.5 font-heading text-lg font-medium first:mt-0"
        >
          <span aria-hidden className="h-5 w-1 rounded-full bg-brand-pink" />
          {heading[2]}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      bullets.push(trimmed.slice(2));
      continue;
    }

    flushBullets();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushBullets();

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-bold text-secondary-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
