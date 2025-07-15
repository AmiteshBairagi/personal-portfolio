-- Drop existing table if it exists (for clean setup)
DROP TABLE IF EXISTS about_data CASCADE;

-- Create about_data table for single entry
CREATE TABLE about_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    experience VARCHAR(50) DEFAULT '0+',
    projects VARCHAR(50) DEFAULT '0+',
    clients VARCHAR(50) DEFAULT '0+',
    coffee VARCHAR(50) DEFAULT '0+',
    profile_image_url TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to about_data table
CREATE TRIGGER update_about_data_updated_at
    BEFORE UPDATE ON about_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to ensure only one record exists
CREATE OR REPLACE FUNCTION ensure_single_about_record()
RETURNS TRIGGER AS $$
BEGIN
    -- If inserting and a record already exists, prevent insertion
    IF TG_OP = 'INSERT' THEN
        IF EXISTS (SELECT 1 FROM about_data) THEN
            RAISE EXCEPTION 'Only one about record is allowed. Use UPDATE instead.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply single record trigger
CREATE TRIGGER ensure_single_about_record_trigger
    BEFORE INSERT ON about_data
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_about_record();

-- Enable Row Level Security
ALTER TABLE about_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON about_data
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON about_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON about_data
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON about_data
    FOR DELETE USING (true);

-- Insert default data (only if table is empty)
INSERT INTO about_data (
    name, 
    title, 
    description, 
    location, 
    email, 
    phone, 
    experience, 
    projects, 
    clients, 
    coffee, 
    profile_image_url, 
    resume_url
) 
SELECT 
    'AMITESH',
    'Full Stack Developer',
    'Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and turning ideas into reality through clean, efficient code.',
    'India',
    'contact@amitesh.dev',
    '+91 9876543210',
    '5+',
    '100+',
    '50+',
    '1000+',
    '/profile-photo.jpg',
    ''
WHERE NOT EXISTS (SELECT 1 FROM about_data);

-- Create indexes for better performance
CREATE INDEX idx_about_data_updated_at ON about_data(updated_at);

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'about_data' 
ORDER BY ordinal_position;
