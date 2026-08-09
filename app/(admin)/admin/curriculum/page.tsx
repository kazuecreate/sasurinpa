import type { Metadata } from "next";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  ClipboardList,
  ExternalLink,
  Layers,
  MonitorPlay,
  Pencil,
  Plus,
} from "lucide-react";

import { VisibilityBadge } from "@/components/admin/admin-badges";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LessonEditorRow } from "@/components/admin/lesson-editor-row";
import {
  MockField,
  MockFormNotice,
  MockSelect,
} from "@/components/admin/mock-form";
import { StatTile, StatTileGrid } from "@/components/admin/stat-tile";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDuration } from "@/lib/format";
import { demoCourse, getAssignments, getCurriculum } from "@/lib/mock";

export const metadata: Metadata = {
  title: "教材コンテンツ管理",
};

const LESSON_TYPE_OPTIONS = {
  video: "動画",
  text: "Webテキスト",
  pdf: "PDF資料",
};

export default function AdminCurriculumPage() {
  const chapters = getCurriculum();
  const assignments = getAssignments();

  const lessons = chapters.flatMap((chapter) => chapter.lessons);
  const totalSeconds = lessons.reduce(
    (sum, lesson) => sum + lesson.duration_seconds,
    0,
  );

  // 「章を選ぶ」セレクト用（値 → 表示ラベル）。
  const chapterOptions = Object.fromEntries(
    chapters.map((chapter, index) => [
      chapter.id,
      `第${index + 1}章　${chapter.title}`,
    ]),
  );

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        eyebrow={demoCourse.title}
        title="教材コンテンツ管理"
        description="章とレッスンの追加・編集・並び替え、動画やテキスト教材の登録を行います。公開中のものはそのまま受講生の画面に反映されます。"
      >
        <ButtonLink
          variant="outline"
          size="lg"
          href="/curriculum"
          className="rounded-2xl"
        >
          <ExternalLink />
          受講生の見え方を確認
        </ButtonLink>
        <Button type="button" size="lg" className="rounded-2xl">
          <Plus />
          章を追加
        </Button>
      </AdminPageHeader>

      <StatTileGrid>
        <StatTile label="章" value={chapters.length} unit="章" icon={Layers} />
        <StatTile
          label="レッスン"
          value={lessons.length}
          unit="本"
          icon={MonitorPlay}
          tone="pink"
        />
        <StatTile
          label="総再生時間"
          value={formatDuration(totalSeconds)}
          icon={Clock}
          tone="muted"
        />
        <StatTile
          label="課題"
          value={assignments.length}
          unit="本"
          icon={ClipboardList}
          tone="sage"
        />
      </StatTileGrid>

      {/* 章とレッスン */}
      <div className="flex flex-col gap-5">
        {chapters.map((chapter, chapterIndex) => (
          <Card key={chapter.id} className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-2xl bg-brand-sage-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  第{chapterIndex + 1}章
                </span>
                <span className="text-base">{chapter.title}</span>

                <span className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={chapterIndex === 0}
                    aria-label={`${chapter.title}を上へ移動`}
                  >
                    <ChevronUp />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={chapterIndex === chapters.length - 1}
                    aria-label={`${chapter.title}を下へ移動`}
                  >
                    <ChevronDown />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-2xl"
                  >
                    <Pencil />
                    章を編集
                  </Button>
                </span>
              </CardTitle>

              {chapter.description && (
                <CardDescription className="leading-6">
                  {chapter.description}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {chapter.lessons.map((lesson, lessonIndex) => (
                <LessonEditorRow
                  key={lesson.id}
                  lesson={lesson}
                  isFirst={lessonIndex === 0}
                  isLast={lessonIndex === chapter.lessons.length - 1}
                />
              ))}

              <Separator />

              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="justify-start rounded-2xl text-muted-foreground"
              >
                <Plus />
                この章にレッスンを追加
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* レッスンの登録フォーム（見た目のみ） */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>レッスンを登録する</CardTitle>
          <CardDescription>
            動画は Storage の course-assets バケットに置き、署名付き URL
            で配信する想定です。
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <MockField label="章" htmlFor="new-lesson-chapter">
                <MockSelect
                  id="new-lesson-chapter"
                  options={chapterOptions}
                  defaultValue={chapters[0]?.id}
                />
              </MockField>

              <MockField label="種別" htmlFor="new-lesson-type">
                <MockSelect
                  id="new-lesson-type"
                  options={LESSON_TYPE_OPTIONS}
                />
              </MockField>
            </div>

            <MockField label="タイトル" htmlFor="new-lesson-title">
              <Input
                id="new-lesson-title"
                placeholder="例：肩まわりのアプローチ"
                className="rounded-2xl"
              />
            </MockField>

            <MockField label="ひとこと説明" htmlFor="new-lesson-description">
              <Input
                id="new-lesson-description"
                placeholder="受講生の一覧に出る 1 行の説明です。"
                className="rounded-2xl"
              />
            </MockField>

            <div className="grid gap-4 sm:grid-cols-2">
              <MockField
                label="動画 / PDF の URL"
                htmlFor="new-lesson-url"
                hint="ファイルのアップロードは Storage 接続後に対応します。"
              >
                <Input
                  id="new-lesson-url"
                  placeholder="https://cdn.sasurinpa.example/lessons/…"
                  className="rounded-2xl font-mono text-xs"
                />
              </MockField>

              <MockField label="所要時間（分）" htmlFor="new-lesson-duration">
                <Input
                  id="new-lesson-duration"
                  type="number"
                  min={1}
                  placeholder="15"
                  className="rounded-2xl"
                />
              </MockField>
            </div>

            <MockField
              label="Webテキスト（Markdown）"
              htmlFor="new-lesson-content"
            >
              <Textarea
                id="new-lesson-content"
                rows={5}
                placeholder={"## リンパのはたらき\n\n本文をここに書きます。"}
                className="rounded-2xl"
              />
            </MockField>

            <Label className="gap-2.5 text-sm font-normal">
              <Checkbox defaultChecked />
              登録と同時に公開する
            </Label>

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="lg" className="rounded-2xl">
                <Plus />
                レッスンを登録する
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-2xl"
              >
                下書きとして保存
              </Button>
            </div>

            <MockFormNotice />
          </form>
        </CardContent>
      </Card>

      {/* 課題の設定 */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>課題の設定</CardTitle>
          <CardDescription>
            提出物の種別と期限を決めておくと、受講生の画面に提出枠が並びます。
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="flex flex-col gap-3">
              {index > 0 && <Separator />}

              <div className="flex flex-wrap items-start gap-3 pt-0.5">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium leading-relaxed">
                      {assignment.title}
                    </p>
                    <VisibilityBadge isPublished={assignment.is_published} />
                  </div>
                  {assignment.description && (
                    <p className="line-clamp-2 text-xs leading-6 text-muted-foreground">
                      {assignment.description}
                    </p>
                  )}
                  {assignment.due_date && (
                    <p className="text-xs text-muted-foreground">
                      提出期限 {formatDate(assignment.due_date)}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-2xl"
                >
                  <Pencil />
                  編集
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="justify-start rounded-2xl text-muted-foreground"
          >
            <Plus />
            課題を追加
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
