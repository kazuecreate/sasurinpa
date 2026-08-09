import type { Metadata } from "next";
import {
  CalendarClock,
  FileEdit,
  Megaphone,
  Pencil,
  Pin,
  Send,
  Users,
} from "lucide-react";

import {
  AudienceBadge,
  PinnedBadge,
  PublishStateBadge,
} from "@/components/admin/admin-badges";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  MockField,
  MockFormNotice,
  MockSelect,
} from "@/components/admin/mock-form";
import { StatTile, StatTileGrid } from "@/components/admin/stat-tile";
import { Button } from "@/components/ui/button";
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
import { formatDate, formatDateTime } from "@/lib/format";
import { getAllAnnouncements, getProfile, getStudents } from "@/lib/mock";

export const metadata: Metadata = {
  title: "お知らせ配信",
};

const AUDIENCE_OPTIONS = {
  all: "全員（受講生・卒業生）",
  students: "受講生のみ",
  graduates: "卒業生のみ",
};

export default function AdminAnnouncementsPage() {
  const announcements = getAllAnnouncements();

  const publishedCount = announcements.filter(
    (a) => a.published_at !== null,
  ).length;
  const draftCount = announcements.length - publishedCount;
  const pinnedCount = announcements.filter((a) => a.is_pinned).length;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="お知らせ配信"
        description="勉強会のご案内や資材の入荷連絡などを、受講生・卒業生へまとめてお届けします。配信すると受講生のダッシュボードにすぐ表示されます。"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="rounded-2xl"
        >
          テンプレートから作成
        </Button>
      </AdminPageHeader>

      <StatTileGrid>
        <StatTile
          label="配信済み"
          value={publishedCount}
          unit="件"
          icon={Megaphone}
          tone="sage"
        />
        <StatTile
          label="下書き"
          value={draftCount}
          unit="件"
          icon={FileEdit}
          tone="muted"
        />
        <StatTile
          label="固定表示中"
          value={pinnedCount}
          unit="件"
          icon={Pin}
          tone="pink"
        />
        <StatTile
          label="配信先の受講生"
          value={getStudents().length}
          unit="名"
          icon={Users}
          tone="pink"
        />
      </StatTileGrid>

      <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        {/* 新規作成フォーム（見た目のみ） */}
        <Card className="rounded-2xl lg:sticky lg:top-28">
          <CardHeader>
            <CardTitle>お知らせを作成する</CardTitle>
            <CardDescription>
              やわらかい語りかけで、ご案内の要点が先に伝わるように。
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4">
              <MockField label="タイトル" htmlFor="announcement-title">
                <Input
                  id="announcement-title"
                  placeholder="例：10月フォローアップ勉強会のご案内"
                  className="rounded-2xl"
                />
              </MockField>

              <MockField label="本文" htmlFor="announcement-body">
                <Textarea
                  id="announcement-body"
                  rows={8}
                  placeholder="日時・場所・参加費・お申し込み方法を書いておくと、お問い合わせが減ります。"
                  className="rounded-2xl"
                />
              </MockField>

              <MockField label="配信先" htmlFor="announcement-audience">
                <MockSelect
                  id="announcement-audience"
                  options={AUDIENCE_OPTIONS}
                />
              </MockField>

              <MockField
                label="予約配信"
                htmlFor="announcement-publish-at"
                hint="空のままにすると、すぐに配信されます。"
              >
                <Input
                  id="announcement-publish-at"
                  type="datetime-local"
                  className="rounded-2xl"
                />
              </MockField>

              <Label className="gap-2.5 text-sm font-normal">
                <Checkbox />
                ダッシュボードの上部に固定表示する
              </Label>

              <div className="flex flex-wrap gap-2">
                <Button type="button" size="lg" className="rounded-2xl">
                  <Send />
                  配信する
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl"
                >
                  下書き保存
                </Button>
              </div>

              <MockFormNotice />
            </form>
          </CardContent>
        </Card>

        {/* 配信履歴 */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>配信履歴（{announcements.length}件）</CardTitle>
            <CardDescription>
              下書きは受講生には表示されません。固定表示はダッシュボードの先頭に並びます。
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {announcements.map((announcement, index) => {
              const author = announcement.author_id
                ? getProfile(announcement.author_id)
                : undefined;

              return (
                <div key={announcement.id} className="flex flex-col gap-4">
                  {index > 0 && <Separator />}

                  <article className="flex flex-col gap-2 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <PublishStateBadge
                        publishedAt={announcement.published_at}
                      />
                      <AudienceBadge audience={announcement.audience} />
                      {announcement.is_pinned && <PinnedBadge />}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto rounded-2xl"
                      >
                        <Pencil />
                        編集
                      </Button>
                    </div>

                    <h3 className="font-heading text-base font-medium leading-relaxed">
                      {announcement.title}
                    </h3>

                    <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
                      {announcement.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarClock className="size-3.5" />
                        {announcement.published_at
                          ? `配信 ${formatDateTime(announcement.published_at)}`
                          : `最終更新 ${formatDate(announcement.updated_at)}`}
                      </span>
                      <span>作成者 {author?.full_name ?? "—"}</span>
                    </div>
                  </article>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
