-- Create contact table for portfolio contact information
CREATE TABLE IF NOT EXISTS contact (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  website_url VARCHAR(500),
  resume_url VARCHAR(500),
  bio TEXT,
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact(email);
CREATE INDEX IF NOT EXISTS idx_contact_availability ON contact(availability_status);

-- Enable RLS (Row Level Security)
ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on contact" ON contact
  FOR ALL USING (true) WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_updated_at_trigger
  BEFORE UPDATE ON contact
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_updated_at();

-- Insert sample contact data
INSERT INTO contact (
  email,
  phone,
  location,
  github_url,
  linkedin_url,
  twitter_url,
  website_url,
  resume_url,
  bio,
  availability_status
) VALUES (
  'john.doe@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  'https://github.com/johndoe',
  'https://linkedin.com/in/johndoe',
  'https://twitter.com/johndoe',
  'https://johndoe.dev',
  '/resume.pdf',
  'I''m a passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Always excited to work on innovative projects and collaborate with amazing teams.',
  'available'
) ON CONFLICT DO NOTHING;
