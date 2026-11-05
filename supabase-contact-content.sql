-- Seed editable contact copy and migrate fixed social fields to a flexible list.
-- Run in the Supabase SQL Editor after supabase-schema.sql. Safe to re-run.

INSERT INTO public.site_content (section, key, value) VALUES
  ('contact', 'eyebrow', '03 / The next thing'),
  ('contact', 'title', 'Have a good'),
  ('contact', 'title_em', 'feeling?'),
  ('contact', 'description', 'For projects, collaborations, and everything in between.'),
  ('contact', 'email', 'hello@yuki.studio')
ON CONFLICT (section, key) DO NOTHING;

-- Preserve existing Instagram/Vimeo values when converting to the editable list.
INSERT INTO public.site_content (section, key, value)
SELECT
  'contact',
  'social_links',
  jsonb_build_array(
    jsonb_build_object(
      'label', COALESCE((SELECT value FROM public.site_content WHERE section = 'contact' AND key = 'instagram_label'), 'Instagram'),
      'url', COALESCE((SELECT value FROM public.site_content WHERE section = 'contact' AND key = 'instagram_url'), 'https://instagram.com')
    ),
    jsonb_build_object(
      'label', COALESCE((SELECT value FROM public.site_content WHERE section = 'contact' AND key = 'vimeo_label'), 'Vimeo'),
      'url', COALESCE((SELECT value FROM public.site_content WHERE section = 'contact' AND key = 'vimeo_url'), 'https://vimeo.com')
    )
  )::text
ON CONFLICT (section, key) DO NOTHING;

DELETE FROM public.site_content
WHERE section = 'contact'
  AND key IN ('instagram_label', 'instagram_url', 'vimeo_label', 'vimeo_url');
