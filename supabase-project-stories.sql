-- Add editorial story fields to selected work projects.
-- Run once in the Supabase SQL Editor after supabase-schema.sql.

ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS story TEXT,
  ADD COLUMN IF NOT EXISTS supporting_images TEXT[] NOT NULL DEFAULT '{}';
