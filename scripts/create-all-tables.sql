-- Drop existing tables if they exist (to ensure clean setup)
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS education CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS about_data CASCADE;

-- Create the skills table
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  projects TEXT[] NOT NULL DEFAULT '{}',
  experience TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the education table
CREATE TABLE education (
  id TEXT PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  duration TEXT NOT NULL,
  grade TEXT,
  description TEXT,
  type TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the certifications table
CREATE TABLE certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  "credentialId" TEXT NOT NULL,
  image TEXT,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  "verificationUrl" TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  "validUntil" TEXT NOT NULL,
  level TEXT NOT NULL,
  "examScore" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
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
  features TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the about_data table
CREATE TABLE about_data (
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

-- Insert default categories
INSERT INTO categories (id, name, description, color, icon, "order", active) VALUES
('1', 'Full Stack', 'Complete web applications with frontend and backend', '#8B5CF6', '🚀', 1, true),
('2', 'Frontend', 'User interface and client-side applications', '#06B6D4', '🎨', 2, true),
('3', 'Backend', 'Server-side applications and APIs', '#10B981', '⚙️', 3, true),
('4', 'Mobile App', 'iOS and Android applications', '#F59E0B', '📱', 4, true),
('5', 'Web App', 'Interactive web applications', '#EF4444', '🌐', 5, true),
('6', 'AI/ML', 'Artificial Intelligence and Machine Learning projects', '#8B5CF6', '🤖', 6, true),
('7', 'Data Visualization', 'Charts, graphs, and data representation', '#06B6D4', '📊', 7, true),
('8', 'Analytics', 'Data analysis and reporting tools', '#10B981', '📈', 8, true),
('9', 'Social Platform', 'Social networking and community platforms', '#F59E0B', '👥', 9, true);

-- Insert default skills
INSERT INTO skills (id, name, level, projects, experience, category) VALUES
('1', 'React', 95, ARRAY['E-Commerce Platform', 'Task Manager', 'Portfolio'], '3+ years', 'Frontend'),
('2', 'Next.js', 90, ARRAY['Portfolio Website', 'Task Manager'], '2+ years', 'Frontend'),
('3', 'TypeScript', 88, ARRAY['Task Manager', 'AI Chat App'], '2+ years', 'Frontend'),
('4', 'Tailwind CSS', 92, ARRAY['Portfolio', 'E-Commerce Platform'], '2+ years', 'Frontend'),
('5', 'Vue.js', 85, ARRAY['Weather Dashboard'], '1+ years', 'Frontend'),
('6', 'Node.js', 90, ARRAY['E-Commerce Platform', 'AI Chat App'], '3+ years', 'Backend'),
('7', 'Python', 85, ARRAY['AI Chat App', 'Data Analysis Tools'], '2+ years', 'Backend'),
('8', 'Express.js', 88, ARRAY['E-Commerce Platform', 'Task Manager API'], '2+ years', 'Backend'),
('9', 'FastAPI', 80, ARRAY['AI Chat App'], '1+ years', 'Backend'),
('10', 'MongoDB', 85, ARRAY['E-Commerce Platform'], '2+ years', 'Database'),
('11', 'PostgreSQL', 88, ARRAY['Task Manager', 'AI Chat App'], '2+ years', 'Database'),
('12', 'Redis', 75, ARRAY['E-Commerce Platform', 'AI Chat App'], '1+ years', 'Database'),
('13', 'Supabase', 80, ARRAY['Portfolio Website'], '1+ years', 'Database'),
('14', 'Git', 95, ARRAY['All Projects'], '4+ years', 'Tools & Others'),
('15', 'Docker', 80, ARRAY['E-Commerce Platform', 'AI Chat App'], '1+ years', 'Tools & Others'),
('16', 'AWS', 75, ARRAY['E-Commerce Platform'], '1+ years', 'Tools & Others'),
('17', 'Figma', 85, ARRAY['Portfolio', 'Task Manager'], '2+ years', 'Tools & Others');

-- Insert default education
INSERT INTO education (id, degree, institution, duration, grade, description, type, image) VALUES
('1', 'Master of Computer Applications', 'Sister Nivedita University', '2024 - 2026', 'CGPA: 8.5/10', 'Premier technical university known for its industry-oriented curriculum and strong placement record. Focusing on advanced software development, AI/ML, and emerging technologies.', 'Masters', '/placeholder.svg?height=300&width=400'),
('2', 'Bachelor of Computer Applications', 'BPPIMT College', '2021 - 2024', 'Percentage: 85%', 'Well-established institution with strong focus on practical learning and industry exposure. Gained foundation in programming, database management, and software engineering principles.', 'Bachelor', '/placeholder.svg?height=300&width=400'),
('3', 'Higher Secondary (12th)', 'Local High School', '2019 - 2021', 'Percentage: 78%', 'Completed higher secondary education with Science stream focusing on Mathematics and Computer Science. Developed strong analytical thinking and problem-solving skills during this foundational period.', 'Secondary', '/placeholder.svg?height=300&width=400');

-- Insert default certifications
INSERT INTO certifications (id, title, issuer, date, "credentialId", image, description, skills, "verificationUrl", featured, "validUntil", level, "examScore") VALUES
('1', 'AWS Certified Solutions Architect', 'Amazon Web Services', '2024', 'AWS-SAA-2024-001', '/placeholder.svg?height=400&width=600', 'Validates expertise in designing distributed systems on AWS. This certification demonstrates the ability to design and deploy scalable, highly available, and fault-tolerant systems on Amazon Web Services.', ARRAY['AWS', 'Cloud Architecture', 'Security', 'Scalability'], 'https://aws.amazon.com/verification', true, '2027', 'Professional', '892/1000'),
('2', 'Google Cloud Professional Developer', 'Google Cloud', '2023', 'GCP-PD-2023-002', '/placeholder.svg?height=400&width=600', 'Demonstrates ability to build scalable applications on Google Cloud Platform. This certification validates skills in designing, building, testing, and deploying cloud-native applications.', ARRAY['Google Cloud', 'Kubernetes', 'APIs', 'DevOps'], 'https://cloud.google.com/certification', true, '2026', 'Professional', '85%'),
('3', 'Meta React Developer Certificate', 'Meta', '2023', 'META-RD-2023-003', '/placeholder.svg?height=400&width=600', 'Comprehensive React development skills certification covering modern React patterns, hooks, state management, testing, and performance optimization.', ARRAY['React', 'JavaScript', 'Frontend Development', 'Testing'], 'https://developers.facebook.com/certification', false, 'Lifetime', 'Professional', '95%'),
('4', 'MongoDB Certified Developer', 'MongoDB University', '2023', 'MDB-DEV-2023-004', '/placeholder.svg?height=400&width=600', 'Expertise in MongoDB database design and development. This certification validates skills in data modeling, aggregation pipelines, indexing strategies, and performance optimization.', ARRAY['MongoDB', 'Database Design', 'Aggregation', 'Performance'], 'https://university.mongodb.com/certification', false, '2026', 'Associate', '88%'),
('5', 'Docker Certified Associate', 'Docker Inc.', '2022', 'DCA-2022-005', '/placeholder.svg?height=400&width=600', 'Container orchestration and Docker platform expertise. This certification demonstrates proficiency in containerization, Docker Swarm, security best practices, and container lifecycle management.', ARRAY['Docker', 'Containerization', 'DevOps', 'Orchestration'], 'https://docker.com/certification', false, '2025', 'Associate', '82%'),
('6', 'Certified Kubernetes Administrator', 'Cloud Native Computing Foundation', '2022', 'CKA-2022-006', '/placeholder.svg?height=400&width=600', 'Kubernetes cluster administration and management certification. This hands-on certification validates the ability to perform the responsibilities of Kubernetes administrators.', ARRAY['Kubernetes', 'Container Orchestration', 'DevOps', 'Linux'], 'https://cncf.io/certification', true, '2025', 'Professional', '89%');

-- Insert default projects
INSERT INTO projects (id, title, description, "shortDescription", technologies, "githubUrl", "liveUrl", category, featured, duration, "teamSize", image, published) VALUES
('1', 'E-Commerce Platform', 'Full-stack e-commerce solution with React, Node.js, and MongoDB', 'Modern e-commerce platform with advanced features', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'], 'https://github.com/username/ecommerce', 'https://ecommerce-demo.com', 'Full Stack', true, '3 months', 'Solo Project', '/placeholder.svg?height=300&width=400', true),
('2', 'Task Management App', 'Collaborative task management with real-time updates', 'Team collaboration made simple', ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'], 'https://github.com/username/taskmanager', 'https://taskmanager-demo.com', 'Web App', true, '2 months', '2 developers', '/placeholder.svg?height=300&width=400', true),
('3', 'AI Chat Application', 'Intelligent chatbot with natural language processing', 'AI-powered customer support solution', ARRAY['Python', 'FastAPI', 'OpenAI', 'React', 'WebSocket'], 'https://github.com/username/aichat', 'https://aichat-demo.com', 'AI/ML', true, '4 months', '3 developers', '/placeholder.svg?height=300&width=400', true),
('4', 'Portfolio Website', 'Responsive portfolio with admin panel', 'Dynamic portfolio with CMS', ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase'], 'https://github.com/username/portfolio', 'https://portfolio-demo.com', 'Frontend', false, '1 month', 'Solo Project', '/placeholder.svg?height=300&width=400', true),
('5', 'Weather Dashboard', 'Real-time weather data with interactive maps', 'Comprehensive weather tracking', ARRAY['Vue.js', 'D3.js', 'Weather API', 'Mapbox'], 'https://github.com/username/weather', 'https://weather-demo.com', 'Data Visualization', false, '6 weeks', 'Solo Project', '/placeholder.svg?height=300&width=400', true),
('6', 'Social Media Dashboard', 'Analytics dashboard for social media management', 'Social media analytics made easy', ARRAY['React', 'Chart.js', 'Node.js', 'MongoDB'], 'https://github.com/username/social-dashboard', 'https://social-demo.com', 'Analytics', false, '2.5 months', 'Solo Project', '/placeholder.svg?height=300&width=400', true),
('7', 'Fitness Tracker App', 'Mobile fitness tracking with workout plans', 'Your personal fitness companion', ARRAY['React Native', 'Firebase', 'Redux', 'Chart.js'], 'https://github.com/username/fitness-tracker', 'https://fitness-demo.com', 'Mobile App', false, '3.5 months', '2 developers', '/placeholder.svg?height=300&width=400', true),
('8', 'Recipe Sharing Platform', 'Community-driven recipe sharing and rating', 'Discover and share amazing recipes', ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'Cloudinary'], 'https://github.com/username/recipe-platform', 'https://recipe-demo.com', 'Social Platform', false, '4 months', '3 developers', '/placeholder.svg?height=300&width=400', true);

-- Insert default about data
INSERT INTO about_data (id, name, title, description, location, email, phone, experience, projects, clients, coffee, "updatedAt") VALUES
('1', 'Amitesh', 'Full Stack Developer', 'I''m a passionate full-stack developer with over 5 years of experience creating digital solutions that make a difference. I specialize in modern web technologies and love turning complex problems into simple, beautiful designs.', 'New York, NY', 'your.email@example.com', '+1 (555) 123-4567', '5+', '100+', '50+', '1000+', NOW()::TEXT);
