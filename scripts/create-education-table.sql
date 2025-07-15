-- -- Drop existing table if it exists
-- DROP TABLE IF EXISTS education CASCADE;

-- -- Create education table
-- CREATE TABLE education (
--   id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
--   degree TEXT NOT NULL,
--   institution TEXT NOT NULL,
--   duration TEXT NOT NULL,
--   grade TEXT,
--   description TEXT,
--   type TEXT,
--   image TEXT,
--   display_order INTEGER DEFAULT 0,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- -- Create updated_at trigger
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_education_updated_at 
--   BEFORE UPDATE ON education 
--   FOR EACH ROW 
--   EXECUTE FUNCTION update_updated_at_column();

-- -- Enable RLS
-- ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- -- Create policies
-- CREATE POLICY "Enable read access for all users" ON education
--   FOR SELECT USING (true);

-- CREATE POLICY "Enable insert for authenticated users only" ON education
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Enable update for authenticated users only" ON education
--   FOR UPDATE USING (true);

-- CREATE POLICY "Enable delete for authenticated users only" ON education
--   FOR DELETE USING (true);

-- -- Insert default education data
-- INSERT INTO education (id, degree, institution, duration, grade, description, type, image, display_order) VALUES
-- ('1', 'Master of Computer Applications', 'Sister Nivedita University', '2024 - 2026', 'CGPA: 8.5/10', 'Premier technical university known for its industry-oriented curriculum and strong placement record. Focusing on advanced software development, AI/ML, and emerging technologies.', 'Masters', '/placeholder.svg?height=300&width=400', 1),
-- ('2', 'Bachelor of Computer Applications', 'BPPIMT College', '2021 - 2024', 'Percentage: 85%', 'Well-established institution with strong focus on practical learning and industry exposure. Gained foundation in programming, database management, and software engineering principles.', 'Bachelor', '/placeholder.svg?height=300&width=400', 2),
-- ('3', 'Higher Secondary (12th)', 'Local High School', '2019 - 2021', 'Percentage: 78%', 'Completed higher secondary education with Science stream focusing on Mathematics and Computer Science. Developed strong analytical thinking and problem-solving skills during this foundational period.', 'Secondary', '/placeholder.svg?height=300&width=400', 3);

-- -- Create index for better performance
-- CREATE INDEX idx_education_display_order ON education(display_order);
-- CREATE INDEX idx_education_created_at ON education(created_at);
