-- Admin write access for the Yuki site editor.
-- Run this in the Supabase SQL Editor after the base and gallery schemas.
-- Only users with app_metadata.role = 'admin' can write; user-editable
-- user_metadata is intentionally not trusted for authorization.

DROP POLICY IF EXISTS "Admins manage works" ON public.works;
CREATE POLICY "Admins manage works" ON public.works
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins manage site content" ON public.site_content;
CREATE POLICY "Admins manage site content" ON public.site_content
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins manage gallery items" ON public.gallery_items
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins manage hero images" ON public.hero_images;
CREATE POLICY "Admins manage hero images" ON public.hero_images
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins manage contact images" ON public.contact_images;
CREATE POLICY "Admins manage contact images" ON public.contact_images
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- The public content bucket is used by the public portfolio. Upload/delete
-- permissions remain restricted to admin JWTs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Admins manage content assets" ON storage.objects;
CREATE POLICY "Admins manage content assets" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'content'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'content'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
