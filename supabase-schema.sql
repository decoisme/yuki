-- Schema untuk database Supabase
-- Jalankan ini di SQL Editor di Supabase Dashboard

-- Table untuk hero images
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table untuk works/portfolio
CREATE TABLE works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  year TEXT NOT NULL,
  image_url TEXT NOT NULL,
  size TEXT CHECK (size IN ('tall', 'short')) NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table untuk contact images
CREATE TABLE contact_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table untuk konten website yang fleksibel
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(section, key)
);

-- Insert data awal untuk lokasi Jakarta
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'location', 'Jakarta, Indonesia'),
  ('hero', 'tagline', 'Independent artist'),
  ('hero', 'availability', 'Available for select projects'),
  ('hero', 'practice', 'A practice in presence'),
  ('intro', 'location_full', 'Jakarta, ID · 6°12'' S'),
  ('intro', 'description', 'I work with <em>movement</em>, image, and feeling — shaping moments that stay with you.'),
  ('section2', 'eyebrow', '02 / Selected work'),
  ('section2', 'title', 'In good'),
  ('section2', 'title_em', 'company.'),
  ('section2', 'description', 'A collection of collaborations<br />and quiet obsessions.'),
  ('footer', 'location', 'Jakarta · Available in Indonesia'),
  ('menu', 'location', 'Jakarta · Indonesia');

-- Insert data works awal
INSERT INTO works (id, title, role, year, image_url, size, order_index) VALUES
  ('01', 'Soft Structures', 'Movement direction', '2025', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1800&q=85', 'tall', 1),
  ('02', 'Nocturne, 04', 'Campaign · Model', '2024', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=85', 'short', 2),
  ('03', 'A Study in Blue', 'Creative direction', '2024', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85', 'short', 3),
  ('04', 'Body / Object', 'Dancer · Performer', '2023', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1800&q=85', 'tall', 4);

-- Insert hero image
INSERT INTO hero_images (image_url, alt_text, is_active) VALUES
  ('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=90', 'Yuki in a soft studio portrait', true);

-- Insert contact image
INSERT INTO contact_images (image_url, caption, is_active) VALUES
  ('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85', 'Yuki, between takes · 2025', true);

-- Enable Row Level Security (RLS)
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policies untuk public read access
CREATE POLICY "Public read access" ON hero_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON works FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);

-- Indexes untuk performa
CREATE INDEX works_order_index_idx ON works(order_index);
CREATE INDEX site_content_section_key_idx ON site_content(section, key);
