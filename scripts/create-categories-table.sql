-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#8B5CF6',
  icon TEXT NOT NULL DEFAULT '🚀',
  "order" INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete categories" ON categories
  FOR DELETE USING (true);

-- Insert sample categories data
INSERT INTO categories (id, name, description, color, icon, "order", active) VALUES
('cat-1', 'Full Stack', 'Complete web application development with frontend and backend', '#8B5CF6', '🚀', 1, true),
('cat-2', 'Frontend', 'User interface and user experience development', '#06B6D4', '🎨', 2, true),
('cat-3', 'Backend', 'Server-side development and API creation', '#10B981', '⚙️', 3, true),
('cat-4', 'Mobile', 'Mobile application development for iOS and Android', '#F59E0B', '📱', 4, true),
('cat-5', 'DevOps', 'Development operations and infrastructure management', '#EF4444', '🔧', 5, true)
ON CONFLICT (id) DO NOTHING;
