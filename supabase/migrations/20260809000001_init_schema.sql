-- =============================================================================
-- さすりんぱ 講師養成講座アプリ / 初期スキーマ
--
-- 対象テーブル:
--   profiles / courses / chapters / lessons / enrollments / progress
--   assignments / submissions / message_threads / messages
--   announcements / certificates
--
-- 前提: Supabase (auth.users が存在すること)
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 列挙型
-- -----------------------------------------------------------------------------

-- 受講生 / 講師・管理者 の2ロール
create type public.user_role as enum ('student', 'admin');

-- レッスンの教材種別
create type public.lesson_type as enum ('video', 'text', 'pdf');

-- 受講ステータス
create type public.enrollment_status as enum ('active', 'completed', 'suspended');

-- 課題の提出物種別
create type public.submission_kind as enum ('video', 'report', 'both');

-- 課題提出のレビュー状況
create type public.submission_status as enum (
  'submitted',          -- 提出済み（未確認）
  'under_review',       -- 講師が確認中
  'approved',           -- 合格
  'revision_requested'  -- 再提出依頼
);

-- お知らせの配信対象
create type public.announcement_audience as enum ('all', 'students', 'graduates');

-- -----------------------------------------------------------------------------
-- 共通トリガ関数: updated_at の自動更新
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles: auth.users の付随情報（アプリ上の「ユーザー」）
-- -----------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text not null,
  furigana    text,
  role        public.user_role not null default 'student',
  avatar_url  text,
  phone       text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'アプリ利用者。auth.users と 1:1。role で受講生 / 管理者を判別する。';

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- サインアップ時に profiles を自動作成する
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- courses: 講座（例: さすりんぱ認定講師養成講座 ベーシック）
-- -----------------------------------------------------------------------------

create table public.courses (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  cover_image_url  text,
  instructor_name  text not null default 'RIKA',
  is_published     boolean not null default false,
  created_by       uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.courses is '講座。受講生は enrollments を通して紐づく。';

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- chapters: 章（カリキュラムの大見出し）
-- -----------------------------------------------------------------------------

create table public.chapters (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses (id) on delete cascade,
  title       text not null,
  description text,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (course_id, position) deferrable initially deferred
);

comment on column public.chapters.position is '並び順。CMS のドラッグ&ドロップで一括更新するため deferrable な一意制約にしている。';

create index chapters_course_id_idx on public.chapters (course_id, position);

create trigger chapters_set_updated_at
  before update on public.chapters
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- lessons: 節（動画 / テキスト / PDF 教材）
-- -----------------------------------------------------------------------------

create table public.lessons (
  id               uuid primary key default gen_random_uuid(),
  chapter_id       uuid not null references public.chapters (id) on delete cascade,
  title            text not null,
  description      text,
  lesson_type      public.lesson_type not null default 'video',
  video_url        text,
  pdf_url          text,
  content          text, -- Web テキスト教材（Markdown）
  duration_seconds integer not null default 0,
  position         integer not null default 0,
  is_published     boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (chapter_id, position) deferrable initially deferred,
  -- 教材種別に応じて必要な本文が入っていることを担保する
  constraint lessons_content_present check (
    (lesson_type = 'video' and video_url is not null)
    or (lesson_type = 'text' and content is not null)
    or (lesson_type = 'pdf' and pdf_url is not null)
  )
);

create index lessons_chapter_id_idx on public.lessons (chapter_id, position);

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- enrollments: 受講登録
-- -----------------------------------------------------------------------------

create table public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  course_id    uuid not null references public.courses (id) on delete cascade,
  status       public.enrollment_status not null default 'active',
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, course_id)
);

create index enrollments_course_id_idx on public.enrollments (course_id);

create trigger enrollments_set_updated_at
  before update on public.enrollments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- progress: レッスンごとの視聴・完了状況
-- -----------------------------------------------------------------------------

create table public.progress (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles (id) on delete cascade,
  lesson_id             uuid not null references public.lessons (id) on delete cascade,
  is_completed          boolean not null default false,
  completed_at          timestamptz,
  last_position_seconds integer not null default 0, -- 動画の視聴再開位置
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index progress_user_id_idx on public.progress (user_id);
create index progress_lesson_id_idx on public.progress (lesson_id);

create trigger progress_set_updated_at
  before update on public.progress
  for each row execute function public.set_updated_at();

-- 完了フラグと完了日時の整合を取る
create or replace function public.sync_progress_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_completed and new.completed_at is null then
    new.completed_at = now();
  elsif not new.is_completed then
    new.completed_at = null;
  end if;
  return new;
end;
$$;

create trigger progress_sync_completed_at
  before insert or update on public.progress
  for each row execute function public.sync_progress_completed_at();

-- -----------------------------------------------------------------------------
-- assignments: 課題（実技動画 / レポート）
-- -----------------------------------------------------------------------------

create table public.assignments (
  id              uuid primary key default gen_random_uuid(),
  course_id       uuid not null references public.courses (id) on delete cascade,
  chapter_id      uuid references public.chapters (id) on delete set null,
  title           text not null,
  description     text,
  submission_kind public.submission_kind not null default 'video',
  due_date        timestamptz,
  position        integer not null default 0,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index assignments_course_id_idx on public.assignments (course_id, position);

create trigger assignments_set_updated_at
  before update on public.assignments
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- submissions: 課題提出とフィードバック
-- -----------------------------------------------------------------------------

create table public.submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id    uuid not null references public.profiles (id) on delete cascade,
  body          text,   -- レポート本文 / 提出コメント
  file_url      text,   -- Storage 上の実技動画・PDF などのパス
  status        public.submission_status not null default 'submitted',
  score         integer check (score is null or score between 0 and 100),
  feedback      text,   -- 講師コメント
  reviewed_by   uuid references public.profiles (id) on delete set null,
  reviewed_at   timestamptz,
  submitted_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (assignment_id, student_id)
);

comment on table public.submissions is '1課題につき1受講生1レコード。再提出は同レコードを更新する。';

create index submissions_student_id_idx on public.submissions (student_id);
create index submissions_status_idx on public.submissions (status);

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- message_threads / messages: 受講生と運営の個別サポートチャット
-- -----------------------------------------------------------------------------

create table public.message_threads (
  id              uuid primary key default gen_random_uuid(),
  student_id      uuid not null references public.profiles (id) on delete cascade,
  subject         text not null default 'サポート',
  last_message_at timestamptz not null default now(),
  is_closed       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.message_threads is '受講生1人 ↔ 運営・講師 のスレッド。運営側は誰でも参加できる。';

create index message_threads_student_id_idx on public.message_threads (student_id, last_message_at desc);

create trigger message_threads_set_updated_at
  before update on public.message_threads
  for each row execute function public.set_updated_at();

create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references public.message_threads (id) on delete cascade,
  sender_id  uuid not null references public.profiles (id) on delete cascade,
  body       text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index messages_thread_id_idx on public.messages (thread_id, created_at);

-- 新着メッセージでスレッドの並び順を更新する
create or replace function public.touch_message_thread()
returns trigger
language plpgsql
as $$
begin
  update public.message_threads
     set last_message_at = new.created_at,
         updated_at      = now()
   where id = new.thread_id;
  return new;
end;
$$;

create trigger messages_touch_thread
  after insert on public.messages
  for each row execute function public.touch_message_thread();

-- -----------------------------------------------------------------------------
-- announcements: お知らせ配信
-- -----------------------------------------------------------------------------

create table public.announcements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  body         text not null,
  audience     public.announcement_audience not null default 'all',
  is_pinned    boolean not null default false,
  published_at timestamptz,
  author_id    uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index announcements_published_at_idx on public.announcements (published_at desc);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- certificates: デジタル認定講師証
-- -----------------------------------------------------------------------------

create table public.certificates (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  course_id       uuid not null references public.courses (id) on delete cascade,
  certificate_no  text not null unique, -- 認定ID（例: SRP-2026-0001）
  recipient_name  text not null,
  instructor_name text not null default 'RIKA',
  issued_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (user_id, course_id)
);

comment on table public.certificates is '講座修了時に発行。存在＝認定証画面の解放条件。';
