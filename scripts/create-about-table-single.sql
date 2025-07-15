-- Drop existing table if it exists
DROP TABLE IF EXISTS about_data CASCADE;

-- Create about_data table for single instance
CREATE TABLE about_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'About Me',
    description TEXT NOT NULL,
    image_url TEXT,
    skills TEXT[], -- Array of skills
    experience_years INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to ensure only one record exists
CREATE OR REPLACE FUNCTION ensure_single_about_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete any existing records before inserting new one
    IF TG_OP = 'INSERT' THEN
        DELETE FROM about_data WHERE id != NEW.id;
        RETURN NEW;
    END IF;
    
    -- Update timestamp on update
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = NOW();
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS ensure_single_about_record_trigger ON about_data;
CREATE TRIGGER ensure_single_about_record_trigger
    BEFORE INSERT ON about_data
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_about_record();

DROP TRIGGER IF EXISTS update_about_timestamp_trigger ON about_data;
CREATE TRIGGER update_about_timestamp_trigger
    BEFORE UPDATE ON about_data
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_about_record();

-- Enable RLS
ALTER TABLE about_data ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow public read access" ON about_data;
CREATE POLICY "Allow public read access" ON about_data
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage about data" ON about_data;
CREATE POLICY "Allow authenticated users to manage about data" ON about_data
    FOR ALL USING (true);

-- Insert default data
INSERT INTO about_data (
    title,
    description,
    image_url,
    skills,
    experience_years
) VALUES (
    'About Me',
    'I''m a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions and turning complex problems into simple, beautiful designs.',
    '/profile-photo.jpg',
    ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'Next.js', 'MongoDB'],
    5
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_about_data_created_at ON about_data(created_at);
CREATE INDEX IF NOT EXISTS idx_about_data_updated_at ON about_data(updated_at);
