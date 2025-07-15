-- Create the hero_data table (already exists)
CREATE TABLE IF NOT EXISTS hero_data (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "heroImage" TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  "socialLinks" JSONB NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the about_data table
CREATE TABLE IF NOT EXISTS about_data (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT NOT NULL,
  projects TEXT NOT NULL,
  clients TEXT NOT NULL,
  coffee TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the skills table (matching code expectations)
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  projects TEXT[] NOT NULL,
  experience TEXT NOT NULL,
  category TEXT NOT NULL,
  "created_at" TEXT NOT NULL DEFAULT NOW()::TEXT,
  "updated_at" TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Create the education table (matching code expectations)
CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  duration TEXT NOT NULL,
  grade TEXT,
  description TEXT,
  type TEXT,
  image TEXT,
  "created_at" TEXT NOT NULL DEFAULT NOW()::TEXT,
  "updated_at" TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Create the certifications table (matching code expectations)
CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  "credentialId" TEXT NOT NULL,
  image TEXT,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  "verificationUrl" TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  "validUntil" TEXT NOT NULL,
  level TEXT NOT NULL,
  "examScore" TEXT,
  "created_at" TEXT NOT NULL DEFAULT NOW()::TEXT,
  "updated_at" TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Create the projects table (matching code expectations)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  "githubUrl" TEXT,
  "liveUrl" TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  duration TEXT,
  "teamSize" TEXT,
  image TEXT,
  "problemStatement" TEXT,
  solution TEXT,
  challenges TEXT,
  features TEXT[],
  published BOOLEAN DEFAULT TRUE,
  "created_at" TEXT NOT NULL DEFAULT NOW()::TEXT,
  "updated_at" TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Create the categories table (matching code expectations)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  "created_at" TEXT NOT NULL DEFAULT NOW()::TEXT,
  "updated_at" TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Insert default hero data if not exists
INSERT INTO hero_data (id, name, title, description, "heroImage", skills, "socialLinks", "updatedAt")
SELECT '1', 'AMITESH', 'Full Stack Developer', 'Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and turning ideas into reality.', '/new-hero-image.jpg', ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'Next.js', 'MongoDB'], '{"github": "#", "linkedin": "#", "twitter": "#", "email": "#"}', NOW()::TEXT
WHERE NOT EXISTS (SELECT 1 FROM hero_data WHERE id = '1');

-- Insert default about data if not exists
INSERT INTO about_data (id, name, title, description, location, email, phone, experience, projects, clients, coffee, "updatedAt")
SELECT '1', 'Amitesh', 'Full Stack Developer', 'I''m a passionate full-stack developer with over 5 years of experience creating digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.', 'New York, NY', 'your.email@example.com', '+1 (555) 123-4567', '5+', '100+', '50+', '1000+', NOW()::TEXT
WHERE NOT EXISTS (SELECT 1 FROM about_data WHERE id = '1');

-- Insert default categories if not exists
INSERT INTO categories (id, name, description, color, icon, "order", active, "created_at", "updated_at")
SELECT * FROM (VALUES
  ('1', 'Full Stack', 'Complete web applications with frontend and backend', '#8B5CF6', '🚀', 1, true, NOW()::TEXT, NOW()::TEXT),
  ('2', 'Frontend', 'User interface and client-side applications', '#06B6D4', '🎨', 2, true, NOW()::TEXT, NOW()::TEXT),
  ('3', 'Backend', 'Server-side applications and APIs', '#10B981', '⚙️', 3, true, NOW()::TEXT, NOW()::TEXT),
  ('4', 'Mobile App', 'iOS and Android applications', '#F59E0B', '📱', 4, true, NOW()::TEXT, NOW()::TEXT),
  ('5', 'Web App', 'Interactive web applications', '#EF4444', '🌐', 5, true, NOW()::TEXT, NOW()::TEXT),
  ('6', 'AI/ML', 'Artificial Intelligence and Machine Learning projects', '#8B5CF6', '🤖', 6, true, NOW()::TEXT, NOW()::TEXT),
  ('7', 'Data Visualization', 'Charts, graphs, and data representation', '#06B6D4', '📊', 7, true, NOW()::TEXT, NOW()::TEXT),
  ('8', 'Analytics', 'Data analysis and reporting tools', '#10B981', '📈', 8, true, NOW()::TEXT, NOW()::TEXT),
  ('9', 'Social Platform', 'Social networking and community platforms', '#F59E0B', '👥', 9, true, NOW()::TEXT, NOW()::TEXT)
) AS v(id, name, description, color, icon, "order", active, "created_at", "updated_at")
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE id = v.id);

-- Insert default skills if not exists
INSERT INTO skills (id, name, level, projects, experience, category, "created_at", "updated_at")
SELECT * FROM (VALUES
  ('1', 'React', 95, ARRAY['E-Commerce Platform', 'Task Manager'], '4 years', 'Frontend', NOW()::TEXT, NOW()::TEXT),
  ('2', 'Node.js', 90, ARRAY['E-Commerce Platform', 'API Gateway'], '4 years', 'Backend', NOW()::TEXT, NOW()::TEXT),
  ('3', 'TypeScript', 88, ARRAY['Task Manager', 'Portfolio'], '3 years', 'Frontend', NOW()::TEXT, NOW()::TEXT),
  ('4', 'Python', 85, ARRAY['AI Chat Bot', 'Data Analysis'], '3 years', 'Backend', NOW()::TEXT, NOW()::TEXT),
  ('5', 'Next.js', 92, ARRAY['Portfolio', 'Blog Platform'], '2 years', 'Frontend', NOW()::TEXT, NOW()::TEXT),
  ('6', 'MongoDB', 80, ARRAY['E-Commerce Platform', 'User Management'], '3 years', 'Database', NOW()::TEXT, NOW()::TEXT)
) AS v(id, name, level, projects, experience, category, "created_at", "updated_at")
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE id = v.id);

-- Insert default education if not exists
INSERT INTO education (id, degree, institution, duration, grade, description, type, image, "created_at", "updated_at")
SELECT * FROM (VALUES
  ('1', 'Bachelor of Computer Science', 'University of Technology', '2018-2022', 'First Class', 'Comprehensive study of computer science fundamentals including algorithms, data structures, software engineering, and web development.', 'Bachelor''s Degree', '/education-reference.png', NOW()::TEXT, NOW()::TEXT),
  ('2', 'Full Stack Web Development', 'Tech Academy', '2022', 'Certificate', 'Intensive bootcamp covering modern web development technologies including React, Node.js, and database management.', 'Certificate', '/placeholder.svg?height=300&width=400', NOW()::TEXT, NOW()::TEXT)
) AS v(id, degree, institution, duration, grade, description, type, image, "created_at", "updated_at")
WHERE NOT EXISTS (SELECT 1 FROM education WHERE id = v.id);

-- Insert default certifications if not exists
INSERT INTO certifications (id, title, issuer, date, "credentialId", image, description, skills, "verificationUrl", featured, "validUntil", level, "examScore", "created_at", "updated_at")
SELECT * FROM (VALUES
  ('1', 'AWS Certified Solutions Architect', 'Amazon Web Services', '2024', 'AWS-SAA-2024-001', '/placeholder.svg?height=400&width=600', 'Validates expertise in designing distributed systems on AWS.', ARRAY['AWS', 'Cloud Architecture', 'Security', 'Scalability'], 'https://aws.amazon.com/verification', true, '2027', 'Professional', '892/1000', NOW()::TEXT, NOW()::TEXT),
  ('2', 'Google Cloud Professional Developer', 'Google Cloud', '2023', 'GCP-PD-2023-002', '/placeholder.svg?height=400&width=600', 'Demonstrates ability to build scalable applications on Google Cloud Platform.', ARRAY['Google Cloud', 'Kubernetes', 'APIs', 'DevOps'], 'https://cloud.google.com/certification', true, '2026', 'Professional', '85%', NOW()::TEXT, NOW()::TEXT)
) AS v(id, title, issuer, date, "credentialId", image, description, skills, "verificationUrl", featured, "validUntil", level, "examScore", "created_at", "updated_at")
WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE id = v.id);

-- Insert default projects if not exists
INSERT INTO projects (id, title, description, "shortDescription", technologies, "githubUrl", "liveUrl", category, featured, duration, "teamSize", image, published, "created_at", "updated_at")
SELECT * FROM (VALUES
  ('1', 'E-Commerce Platform', 'Full-stack e-commerce solution with React, Node.js, and MongoDB', 'Modern e-commerce platform with advanced features', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'], 'https://github.com/username/ecommerce', 'https://ecommerce-demo.com', 'Full Stack', true, '3 months', 'Solo Project', '/placeholder.svg?height=300&width=400', true, NOW()::TEXT, NOW()::TEXT),
  ('2', 'Task Management App', 'Collaborative task management with real-time updates', 'Team collaboration made simple', ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'], 'https://github.com/username/taskmanager', 'https://taskmanager-demo.com', 'Web App', true, '2 months', '2 developers', '/placeholder.svg?height=300&width=400', true, NOW()::TEXT, NOW()::TEXT)
) AS v(id, title, description, "shortDescription", technologies, "githubUrl", "liveUrl", category, featured, duration, "teamSize", image, published, "created_at", "updated_at")
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE id = v.id);
