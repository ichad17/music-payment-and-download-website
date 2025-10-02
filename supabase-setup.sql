-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  cover_image_url TEXT,
  file_path TEXT NOT NULL,
  r2_url TEXT -- Cloudflare R2 URL for full album download
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  track_number INTEGER NOT NULL,
  r2_url TEXT NOT NULL -- Cloudflare R2 URL for individual track download
);

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable Row Level Security (RLS)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Albums policies (public read, authenticated for operations)
CREATE POLICY "Albums are viewable by everyone" 
  ON albums FOR SELECT 
  USING (true);

-- Tracks policies (public read)
CREATE POLICY "Tracks are viewable by everyone" 
  ON tracks FOR SELECT 
  USING (true);

-- Purchases policies (users can only see their own purchases)
CREATE POLICY "Users can view own purchases" 
  ON purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert purchases" 
  ON purchases FOR INSERT 
  WITH CHECK (true);

-- Gallery images policies (public read, authenticated for write)
CREATE POLICY "Gallery images are viewable by everyone" 
  ON gallery_images FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert gallery images" 
  ON gallery_images FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery images" 
  ON gallery_images FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tracks_album_id_idx ON tracks(album_id);
CREATE INDEX IF NOT EXISTS tracks_track_number_idx ON tracks(track_number);
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_album_id_idx ON purchases(album_id);
CREATE INDEX IF NOT EXISTS gallery_images_display_order_idx ON gallery_images(display_order);

-- Insert sample album (optional)
INSERT INTO albums (title, artist, description, price, file_path) 
VALUES (
  'Sample Album',
  'Sample Artist',
  'This is a sample album for demonstration purposes. Replace with your actual albums.',
  9.99,
  'sample-album.zip'
) ON CONFLICT DO NOTHING;

-- Insert sample gallery image (optional)
INSERT INTO gallery_images (title, description, image_url, display_order)
VALUES (
  'Sample Gallery Image',
  'This is a sample gallery image. Replace with your actual images.',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
  0
) ON CONFLICT DO NOTHING;
