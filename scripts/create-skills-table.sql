-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  projects TEXT[] DEFAULT '{}',
  experience TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON skills 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON skills
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users full access" ON skills
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON skills(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_is_active ON skills(is_active);

-- Insert default skills data
INSERT INTO skills (id, name, level, projects, experience, category, display_order) VALUES
-- Frontend Skills
('skill_1', 'React', 95, ARRAY['E-Commerce Platform', 'Task Manager', 'Portfolio'], '3+ years', 'Frontend', 1),
('skill_2', 'Next.js', 90, ARRAY['Portfolio Website', 'Task Manager'], '2+ years', 'Frontend', 2),
('skill_3', 'TypeScript', 88, ARRAY['Task Manager', 'AI Chat App'], '2+ years', 'Frontend', 3),
('skill_4', 'Tailwind CSS', 92, ARRAY['Portfolio', 'E-Commerce Platform'], '2+ years', 'Frontend', 4),
('skill_5', 'Vue.js', 85, ARRAY['Weather Dashboard'], '1+ years', 'Frontend', 5),
('skill_6', 'JavaScript', 93, ARRAY['All Projects'], '4+ years', 'Frontend', 6),

-- Backend Skills
('skill_7', 'Node.js', 90, ARRAY['E-Commerce Platform', 'AI Chat App'], '3+ years', 'Backend', 1),
('skill_8', 'Python', 85, ARRAY['AI Chat App', 'Data Analysis Tools'], '2+ years', 'Backend', 2),
('skill_9', 'Express.js', 88, ARRAY['E-Commerce Platform', 'Task Manager API'], '2+ years', 'Backend', 3),
('skill_10', 'FastAPI', 80, ARRAY['AI Chat App'], '1+ years', 'Backend', 4),
('skill_11', 'PHP', 75, ARRAY['Legacy Projects'], '1+ years', 'Backend', 5),

-- Database Skills
('skill_12', 'MongoDB', 85, ARRAY['E-Commerce Platform'], '2+ years', 'Database', 1),
('skill_13', 'PostgreSQL', 88, ARRAY['Task Manager', 'AI Chat App'], '2+ years', 'Database', 2),
('skill_14', 'Redis', 75, ARRAY['E-Commerce Platform', 'AI Chat App'], '1+ years', 'Database', 3),
('skill_15', 'Supabase', 80, ARRAY['Portfolio Website'], '1+ years', 'Database', 4),
('skill_16', 'MySQL', 82, ARRAY['Legacy Projects'], '2+ years', 'Database', 5),

-- Tools & Others
('skill_17', 'Git', 95, ARRAY['All Projects'], '4+ years', 'Tools & Others', 1),
('skill_18', 'Docker', 80, ARRAY['E-Commerce Platform', 'AI Chat App'], '1+ years', 'Tools & Others', 2),
('skill_19', 'AWS', 75, ARRAY['E-Commerce Platform'], '1+ years', 'Tools & Others', 3),
('skill_20', 'Figma', 85, ARRAY['Portfolio', 'Task Manager'], '2+ years', 'Tools & Others', 4),
('skill_21', 'Vercel', 88, ARRAY['Portfolio', 'Next.js Projects'], '2+ years', 'Tools & Others', 5),

-- Mobile Skills
('skill_22', 'React Native', 78, ARRAY['Mobile Task Manager'], '1+ years', 'Mobile', 1),
('skill_23', 'Flutter', 70, ARRAY['Cross-platform App'], '6 months', 'Mobile', 2),

-- DevOps Skills
('skill_24', 'CI/CD', 75, ARRAY['E-Commerce Platform'], '1+ years', 'DevOps', 1),
('skill_25', 'Nginx', 70, ARRAY['Server Configuration'], '1+ years', 'DevOps', 2),
('skill_26', 'Linux', 80, ARRAY['Server Management'], '2+ years', 'DevOps', 3)

ON CONFLICT (id) DO NOTHING;
