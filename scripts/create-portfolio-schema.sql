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

-- Create the skills_data table
CREATE TABLE IF NOT EXISTS skills_data (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  projects TEXT[] NOT NULL,
  experience TEXT NOT NULL,
  category TEXT NOT NULL,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the education_data table
CREATE TABLE IF NOT EXISTS education_data (
  id TEXT PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  duration TEXT NOT NULL,
  grade TEXT,
  description TEXT,
  type TEXT,
  image TEXT,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the certifications_data table
CREATE TABLE IF NOT EXISTS certifications_data (
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
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the projects_data table
CREATE TABLE IF NOT EXISTS projects_data (
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
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Create the categories_data table
CREATE TABLE IF NOT EXISTS categories_data (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- Insert default about data if not exists
INSERT INTO about_data (id, name, title, description, location, email, phone, experience, projects, clients, coffee, "updatedAt")
SELECT '1', 'Amitesh', 'Full Stack Developer', 'I''m a passionate full-stack developer with over 5 years of experience creating digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.', 'New York, NY', 'your.email@example.com', '+1 (555) 123-4567', '5+', '100+', '50+', '1000+', NOW()::TEXT
WHERE NOT EXISTS (SELECT 1 FROM about_data WHERE id = '1');

-- Insert default categories if not exists
INSERT INTO categories_data (id, name, description, color, icon, "order", active, "createdAt", "updatedAt")
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
) AS v(id, name, description, color, icon, "order", active, "createdAt", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM categories_data WHERE id = v.id);
