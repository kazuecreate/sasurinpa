-- =============================================================================
-- Storage バケットとポリシー
--
--   course-assets : 教材（動画・PDF・サムネイル）。閲覧は認証ユーザー、更新は admin。
--   submissions   : 課題の実技動画・レポート。非公開。
--                   パス規約: submissions/{student_id}/{assignment_id}/{filename}
--   avatars       : プロフィール画像。公開バケット。
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('course-assets', 'course-assets', false, 1073741824,
   array['video/mp4', 'video/quicktime', 'application/pdf', 'image/png', 'image/jpeg', 'image/webp']),
  ('submissions', 'submissions', false, 1073741824,
   array['video/mp4', 'video/quicktime', 'application/pdf', 'image/png', 'image/jpeg']),
  ('avatars', 'avatars', true, 5242880,
   array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- course-assets
-- -----------------------------------------------------------------------------

create policy "course_assets_read_authenticated"
  on storage.objects for select to authenticated
  using (bucket_id = 'course-assets');

create policy "course_assets_admin_write"
  on storage.objects for all to authenticated
  using (bucket_id = 'course-assets' and public.is_admin())
  with check (bucket_id = 'course-assets' and public.is_admin());

-- -----------------------------------------------------------------------------
-- submissions: 先頭フォルダを自分の user id に限定する
-- -----------------------------------------------------------------------------

create policy "submissions_read_own_or_admin"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'submissions'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

create policy "submissions_upload_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "submissions_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "submissions_delete_own_or_admin"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'submissions'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

-- -----------------------------------------------------------------------------
-- avatars
-- -----------------------------------------------------------------------------

create policy "avatars_read_public"
  on storage.objects for select to public
  using (bucket_id = 'avatars');

create policy "avatars_write_own"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
