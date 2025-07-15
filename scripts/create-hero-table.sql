-- Create the hero_data table for dynamic hero section management
CREATE TABLE IF NOT EXISTS hero_data (
  id TEXT PRIMARY KEY DEFAULT '1',
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  social_links JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an update trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_data_updated_at 
    BEFORE UPDATE ON hero_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default hero data
INSERT INTO hero_data (
  id, 
  name, 
  title, 
  description, 
  hero_image, 
  skills, 
  social_links
) VALUES (
  '1',
  'AMITESH',
  'Full Stack Developer',
  'Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and turning ideas into reality.',
  '/new-hero-image.jpg',
  ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'Next.js', 'MongoDB'],
  '{"github": "https://github.com/yourusername", "linkedin": "https://linkedin.com/in/yourusername", "twitter": "https://twitter.com/yourusername", "email": "your.email@example.com"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE hero_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on hero_data" ON hero_data
  FOR ALL USING (true) WITH CHECK (true);
