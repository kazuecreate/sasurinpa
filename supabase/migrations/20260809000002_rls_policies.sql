-- =============================================================================
-- Row Level Security ポリシー
--
-- 方針:
--   - 受講生 (student) は「自分に関係するデータ」と「公開済みの教材」のみ読める
--   - 講師・管理者 (admin) は全データの読み書きができる
--   - 教材（courses / chapters / lessons / assignments）の書き込みは admin のみ
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ヘルパー関数
--   profiles 自身のポリシーから参照するため security definer にして
--   RLS の再帰評価を避ける。
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.profiles p
     where p.id = auth.uid()
       and p.role = 'admin'
  );
$$;

comment on function public.is_admin is '現在のユーザーが講師・管理者かどうか。RLS 再帰を避けるため security definer。';

create or replace function public.is_enrolled(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.enrollments e
     where e.course_id = target_course_id
       and e.user_id = auth.uid()
       and e.status <> 'suspended'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_enrolled(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_enrolled(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- RLS 有効化
-- -----------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.chapters        enable row level security;
alter table public.lessons         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.progress        enable row level security;
alter table public.assignments     enable row level security;
alter table public.submissions     enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages        enable row level security;
alter table public.announcements   enable row level security;
alter table public.certificates    enable row level security;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------

create policy "profiles_select_self_or_admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_self"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));

comment on policy "profiles_update_self" on public.profiles is
  '本人はプロフィールを編集できるが、role の自己昇格は禁止する。';

create policy "profiles_admin_all"
  on public.profiles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- courses
-- -----------------------------------------------------------------------------

create policy "courses_select_published"
  on public.courses for select to authenticated
  using (is_published or public.is_admin());

create policy "courses_admin_write"
  on public.courses for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- chapters
-- -----------------------------------------------------------------------------

create policy "chapters_select_published"
  on public.chapters for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.courses c
       where c.id = chapters.course_id
         and c.is_published
    )
  );

create policy "chapters_admin_write"
  on public.chapters for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- lessons: 公開済み かつ 受講登録済みの講座のみ閲覧できる
-- -----------------------------------------------------------------------------

create policy "lessons_select_enrolled"
  on public.lessons for select to authenticated
  using (
    public.is_admin()
    or (
      is_published
      and exists (
        select 1
          from public.chapters ch
         where ch.id = lessons.chapter_id
           and public.is_enrolled(ch.course_id)
      )
    )
  );

create policy "lessons_admin_write"
  on public.lessons for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- enrollments
-- -----------------------------------------------------------------------------

create policy "enrollments_select_own"
  on public.enrollments for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "enrollments_admin_write"
  on public.enrollments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- progress: 受講生は自分の進捗のみ読み書きできる
-- -----------------------------------------------------------------------------

create policy "progress_select_own"
  on public.progress for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "progress_insert_own"
  on public.progress for insert to authenticated
  with check (user_id = auth.uid());

create policy "progress_update_own"
  on public.progress for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "progress_admin_write"
  on public.progress for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- assignments
-- -----------------------------------------------------------------------------

create policy "assignments_select_enrolled"
  on public.assignments for select to authenticated
  using (
    public.is_admin()
    or (is_published and public.is_enrolled(course_id))
  );

create policy "assignments_admin_write"
  on public.assignments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- submissions
--   受講生: 自分の提出物のみ。評価・フィードバック欄は書き換えられない。
--   管理者: すべて閲覧・添削できる。
-- -----------------------------------------------------------------------------

create policy "submissions_select_own"
  on public.submissions for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

create policy "submissions_insert_own"
  on public.submissions for insert to authenticated
  with check (
    student_id = auth.uid()
    and status = 'submitted'
    and score is null
    and feedback is null
    and reviewed_by is null
  );

create policy "submissions_update_own_before_approval"
  on public.submissions for update to authenticated
  using (
    student_id = auth.uid()
    and status in ('submitted', 'revision_requested')
  )
  with check (
    student_id = auth.uid()
    and status = 'submitted'
    and score is not distinct from (select s.score from public.submissions s where s.id = submissions.id)
    and feedback is not distinct from (select s.feedback from public.submissions s where s.id = submissions.id)
  );

comment on policy "submissions_update_own_before_approval" on public.submissions is
  '合格前のみ再提出可。受講生自身が score / feedback を書き換えることはできない。';

create policy "submissions_admin_write"
  on public.submissions for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- message_threads / messages
-- -----------------------------------------------------------------------------

create policy "message_threads_select_own"
  on public.message_threads for select to authenticated
  using (student_id = auth.uid() or public.is_admin());

create policy "message_threads_insert_own"
  on public.message_threads for insert to authenticated
  with check (student_id = auth.uid() or public.is_admin());

create policy "message_threads_update_participant"
  on public.message_threads for update to authenticated
  using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

create policy "message_threads_admin_delete"
  on public.message_threads for delete to authenticated
  using (public.is_admin());

create policy "messages_select_participant"
  on public.messages for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.message_threads t
       where t.id = messages.thread_id
         and t.student_id = auth.uid()
    )
  );

create policy "messages_insert_participant"
  on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and (
      public.is_admin()
      or exists (
        select 1 from public.message_threads t
         where t.id = messages.thread_id
           and t.student_id = auth.uid()
           and not t.is_closed
      )
    )
  );

-- 既読フラグ (read_at) の更新のみを想定
create policy "messages_update_participant"
  on public.messages for update to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.message_threads t
       where t.id = messages.thread_id
         and t.student_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.message_threads t
       where t.id = messages.thread_id
         and t.student_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- announcements: 公開済みは全受講生が閲覧、作成・編集は admin のみ
-- -----------------------------------------------------------------------------

create policy "announcements_select_published"
  on public.announcements for select to authenticated
  using (
    public.is_admin()
    or (published_at is not null and published_at <= now())
  );

create policy "announcements_admin_write"
  on public.announcements for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- certificates: 本人と admin のみ。発行は admin のみ。
-- -----------------------------------------------------------------------------

create policy "certificates_select_own"
  on public.certificates for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "certificates_admin_write"
  on public.certificates for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
