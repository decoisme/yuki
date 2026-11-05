import { createClient as createBrowserClient } from '@/utils/supabase/client';

// Browser client untuk client components
export const supabase = createBrowserClient();

// Types untuk database
export interface Work {
  id: string;
  title: string;
  role: string;
  year: string;
  image_url: string;
  size: 'tall' | 'short';
  order_index: number;
  summary?: string | null;
  story?: string | null;
  supporting_images?: string[] | null;
  created_at?: string;
}

export interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  created_at?: string;
}

export interface ContactImage {
  id: string;
  image_url: string;
  caption: string;
  is_active: boolean;
  created_at?: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updated_at?: string;
}
