-- Gallery Schema Extension
-- Jalankan ini di SQL Editor Supabase untuk menambah gallery functionality

-- Table untuk gallery images
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  video_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  category TEXT CHECK (category IN ('dancer', 'model', 'producer', 'fashion')) DEFAULT 'model',
  aspect_ratio TEXT CHECK (aspect_ratio IN ('portrait', 'landscape', 'square')) DEFAULT 'portrait',
  bg_text TEXT DEFAULT 'MOVEMENT',
  order_index INTEGER NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert sample gallery data
INSERT INTO gallery_items (title, image_url, media_type, category, aspect_ratio, bg_text, order_index, is_featured, is_active) VALUES
  ('Movement Study 01', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=90', 'image', 'dancer', 'portrait', 'MOVEMENT', 1, true, true),
  ('Editorial Portrait', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=90', 'image', 'model', 'landscape', 'EDITORIAL', 2, true, true),
  ('Fashion Campaign', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=2400&q=90', 'image', 'fashion', 'square', 'ARCHIVE', 3, false, true),
  ('Studio Session', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=2400&q=90', 'image', 'producer', 'portrait', 'FASHION', 4, false, true),
  ('Behind the Scenes', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=2400&q=90', 'image', 'dancer', 'landscape', 'STUDIO', 5, false, true);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON gallery_items FOR SELECT USING (true);

-- Index untuk performa
CREATE INDEX gallery_order_index_idx ON gallery_items(order_index);
CREATE INDEX gallery_featured_idx ON gallery_items(is_featured) WHERE is_featured = true;
CREATE INDEX gallery_active_idx ON gallery_items(is_active) WHERE is_active = true;

-- Add gallery settings to site_content
INSERT INTO site_content (section, key, value) VALUES
  ('gallery', 'title', 'GALLERY'),
  ('gallery', 'subtitle', 'A visual journey'),
  ('gallery', 'description', 'Moments captured through movement and stillness')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;
