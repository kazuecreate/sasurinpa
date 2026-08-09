/** 表示用の書式ヘルパー。日時はすべて JST 固定で整形する。 */

const TIME_ZONE = "Asia/Tokyo";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  month: "numeric",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "2026-08-05T10:00:00+09:00" → "2026年8月5日" */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** "2026-08-05T10:00:00+09:00" → "8/5" */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

/** "2026-08-05T10:00:00+09:00" → "2026年8月5日 10:00" */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

/** 480 → "8分" / 4200 → "1時間10分" */
export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));

  if (minutes < 60) return `${minutes}分`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}時間` : `${hours}時間${rest}分`;
}

/** 420 → "7:00"（プレイヤーの再生位置表示用） */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
