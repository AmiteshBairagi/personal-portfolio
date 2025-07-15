-- Insert Backend Skills
INSERT INTO skills (id, name, level, projects, experience, category) VALUES
('backend_1', 'Node.js', 90, ARRAY['E-Commerce Platform', 'AI Chat App', 'Task Manager API'], '3+ years', 'Backend'),
('backend_2', 'Python', 85, ARRAY['AI Chat App', 'Data Analysis Tools', 'Web Scraper'], '2+ years', 'Backend'),
('backend_3', 'Express.js', 88, ARRAY['E-Commerce Platform', 'Task Manager API', 'Real-time Chat'], '2+ years', 'Backend'),
('backend_4', 'FastAPI', 80, ARRAY['AI Chat App', 'ML Model API', 'Data Processing Service'], '1+ years', 'Backend'),
('backend_5', 'Django', 75, ARRAY['Blog Platform', 'Content Management System'], '1+ years', 'Backend'),
('backend_6', 'NestJS', 70, ARRAY['Enterprise API', 'Microservices Architecture'], '1 year', 'Backend'),
('backend_7', 'GraphQL', 78, ARRAY['Social Media App', 'E-Commerce Platform'], '1+ years', 'Backend'),
('backend_8', 'REST APIs', 92, ARRAY['All Backend Projects'], '3+ years', 'Backend');

-- Insert Database Skills
INSERT INTO skills (id, name, level, projects, experience, category) VALUES
('database_1', 'PostgreSQL', 88, ARRAY['Task Manager', 'AI Chat App', 'E-Commerce Platform'], '2+ years', 'Database'),
('database_2', 'MongoDB', 85, ARRAY['E-Commerce Platform', 'Blog System', 'Real-time Chat'], '2+ years', 'Database'),
('database_3', 'Redis', 75, ARRAY['E-Commerce Platform', 'AI Chat App', 'Caching Layer'], '1+ years', 'Database'),
('database_4', 'Supabase', 80, ARRAY['Portfolio Website', 'Task Manager', 'Real-time Apps'], '1+ years', 'Database'),
('database_5', 'MySQL', 82, ARRAY['Legacy Systems', 'WordPress Sites'], '2+ years', 'Database'),
('database_6', 'Firebase', 78, ARRAY['Mobile Apps', 'Real-time Features'], '1+ years', 'Database'),
('database_7', 'Prisma ORM', 85, ARRAY['Modern Web Apps', 'Type-safe Database Access'], '1+ years', 'Database'),
('database_8', 'SQLite', 70, ARRAY['Mobile Apps', 'Desktop Applications'], '1 year', 'Database');

-- Insert Tools & Others Skills
INSERT INTO skills (id, name, level, projects, experience, category) VALUES
('tools_1', 'Git', 95, ARRAY['All Projects'], '4+ years', 'Tools & Others'),
('tools_2', 'Docker', 80, ARRAY['E-Commerce Platform', 'AI Chat App', 'Microservices'], '1+ years', 'Tools & Others'),
('tools_3', 'AWS', 75, ARRAY['E-Commerce Platform', 'Cloud Deployment'], '1+ years', 'Tools & Others'),
('tools_4', 'Figma', 85, ARRAY['Portfolio', 'Task Manager', 'UI/UX Design'], '2+ years', 'Tools & Others'),
('tools_5', 'VS Code', 98, ARRAY['All Development Projects'], '4+ years', 'Tools & Others'),
('tools_6', 'Postman', 90, ARRAY['API Development', 'Testing'], '3+ years', 'Tools & Others'),
('tools_7', 'Webpack', 72, ARRAY['Build Optimization', 'Module Bundling'], '1+ years', 'Tools & Others'),
('tools_8', 'Jest', 80, ARRAY['Unit Testing', 'Integration Testing'], '2+ years', 'Tools & Others'),
('tools_9', 'GitHub Actions', 75, ARRAY['CI/CD Pipelines', 'Automated Deployment'], '1+ years', 'Tools & Others'),
('tools_10', 'Vercel', 88, ARRAY['Next.js Deployments', 'Static Sites'], '2+ years', 'Tools & Others'),
('tools_11', 'Nginx', 70, ARRAY['Server Configuration', 'Load Balancing'], '1 year', 'Tools & Others'),
('tools_12', 'Linux', 78, ARRAY['Server Management', 'Development Environment'], '2+ years', 'Tools & Others');

-- Update existing Frontend skills if they exist, otherwise insert them
INSERT INTO skills (id, name, level, projects, experience, category) VALUES
('frontend_1', 'React', 95, ARRAY['E-Commerce Platform', 'Task Manager', 'Portfolio'], '3+ years', 'Frontend'),
('frontend_2', 'Next.js', 90, ARRAY['Portfolio Website', 'Task Manager', 'Blog Platform'], '2+ years', 'Frontend'),
('frontend_3', 'TypeScript', 88, ARRAY['Task Manager', 'AI Chat App', 'E-Commerce Platform'], '2+ years', 'Frontend'),
('frontend_4', 'Tailwind CSS', 92, ARRAY['Portfolio', 'E-Commerce Platform', 'Modern UI Components'], '2+ years', 'Frontend'),
('frontend_5', 'Vue.js', 85, ARRAY['Weather Dashboard', 'Admin Panel'], '1+ years', 'Frontend'),
('frontend_6', 'JavaScript', 93, ARRAY['All Frontend Projects'], '4+ years', 'Frontend'),
('frontend_7', 'HTML5', 95, ARRAY['All Web Projects'], '4+ years', 'Frontend'),
('frontend_8', 'CSS3', 90, ARRAY['All Web Projects'], '4+ years', 'Frontend'),
('frontend_9', 'Sass/SCSS', 82, ARRAY['Legacy Projects', 'Component Libraries'], '2+ years', 'Frontend'),
('frontend_10', 'Framer Motion', 78, ARRAY['Portfolio', 'Interactive Animations'], '1+ years', 'Frontend')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  projects = EXCLUDED.projects,
  experience = EXCLUDED.experience,
  category = EXCLUDED.category;
