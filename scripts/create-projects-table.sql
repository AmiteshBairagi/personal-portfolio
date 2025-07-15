-- Create the projects table with all necessary fields
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  duration TEXT,
  team_size TEXT,
  image TEXT,
  problem_statement TEXT,
  solution TEXT,
  challenges TEXT,
  features TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
CREATE POLICY "Enable read access for all users" ON projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON projects;
CREATE POLICY "Enable insert for authenticated users only" ON projects
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON projects;
CREATE POLICY "Enable update for authenticated users only" ON projects
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON projects;
CREATE POLICY "Enable delete for authenticated users only" ON projects
    FOR DELETE USING (true);

-- Insert default projects data
INSERT INTO projects (
  id, title, description, short_description, technologies, github_url, live_url, 
  category, featured, duration, team_size, image, problem_statement, solution, 
  challenges, features, published, display_order
) VALUES 
(
  '1',
  'E-Commerce Platform',
  'A comprehensive full-stack e-commerce solution built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard. The platform is designed to handle high traffic and provides a seamless shopping experience across all devices.',
  'Modern e-commerce platform with advanced features',
  ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS', 'Express', 'Redis', 'Socket.io'],
  'https://github.com/username/ecommerce',
  'https://ecommerce-demo.com',
  'Full Stack',
  true,
  '3 months',
  'Solo Project',
  '/placeholder.svg?height=300&width=400',
  'Small businesses needed an affordable, feature-rich e-commerce solution that could compete with major platforms.',
  'Built a comprehensive platform with inventory management, payment processing, and analytics dashboard.',
  'Implementing real-time inventory updates and handling high-traffic scenarios during sales events.',
  ARRAY['Real-time inventory', 'Payment processing', 'Admin dashboard', 'Order tracking', 'Email notifications'],
  true,
  1
),
(
  '2',
  'Task Management App',
  'A collaborative task management application that enables teams to organize, track, and complete projects efficiently. Built with Next.js and TypeScript, it features real-time updates, project templates, time tracking, file attachments, and comprehensive team analytics.',
  'Team collaboration made simple',
  ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Socket.io', 'NextAuth'],
  'https://github.com/username/taskmanager',
  'https://taskmanager-demo.com',
  'Web App',
  true,
  '2 months',
  '2 developers',
  '/placeholder.svg?height=300&width=400',
  'Teams struggled with scattered communication and lack of project visibility.',
  'Created an intuitive task management system with real-time collaboration features.',
  'Implementing real-time updates across multiple users and maintaining data consistency.',
  ARRAY['Real-time collaboration', 'Project templates', 'Time tracking', 'File attachments', 'Team analytics'],
  true,
  2
),
(
  '3',
  'AI Chat Application',
  'An intelligent chatbot application powered by OpenAI GPT-4, designed to provide 24/7 customer support. The system can understand context, maintain conversation flow, and escalate complex issues to human agents when necessary.',
  'AI-powered customer support solution',
  ARRAY['Python', 'FastAPI', 'OpenAI', 'React', 'WebSocket', 'Redis', 'PostgreSQL'],
  'https://github.com/username/aichat',
  'https://aichat-demo.com',
  'AI/ML',
  true,
  '4 months',
  '3 developers',
  '/placeholder.svg?height=300&width=400',
  'Businesses needed 24/7 customer support without increasing operational costs.',
  'Developed an AI chatbot that handles common queries and escalates complex issues to human agents.',
  'Training the model to understand context and maintain conversation flow across different topics.',
  ARRAY['Natural language processing', 'Context awareness', 'Multi-language support', 'Analytics dashboard', 'Human handoff'],
  true,
  3
),
(
  '4',
  'Portfolio Website',
  'A dynamic portfolio website with an integrated content management system. Built with Next.js and Tailwind CSS, it features smooth animations, SEO optimization, and an admin panel for easy content updates.',
  'Dynamic portfolio with CMS',
  ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'TypeScript'],
  'https://github.com/username/portfolio',
  'https://portfolio-demo.com',
  'Frontend',
  false,
  '1 month',
  'Solo Project',
  '/placeholder.svg?height=300&width=400',
  'Developers needed a way to showcase their work dynamically without manual code updates.',
  'Built a portfolio website with an admin panel for easy content management.',
  'Creating smooth animations while maintaining performance and SEO optimization.',
  ARRAY['Dynamic content', 'Admin panel', 'SEO optimized', 'Responsive design', 'Contact form'],
  true,
  4
),
(
  '5',
  'Weather Dashboard',
  'A comprehensive weather tracking application with interactive maps and detailed forecasts. Built with Vue.js and D3.js, it provides real-time weather data, historical information, and weather alerts.',
  'Comprehensive weather tracking',
  ARRAY['Vue.js', 'D3.js', 'Weather API', 'Mapbox', 'Chart.js', 'Vuex'],
  'https://github.com/username/weather',
  'https://weather-demo.com',
  'Data Visualization',
  false,
  '6 weeks',
  'Solo Project',
  '/placeholder.svg?height=300&width=400',
  'Users needed detailed weather information with visual representations for better understanding.',
  'Created an interactive dashboard with maps, charts, and detailed forecasts.',
  'Handling large datasets and creating smooth map interactions with real-time updates.',
  ARRAY['Interactive maps', '7-day forecast', 'Weather alerts', 'Historical data', 'Location search'],
  true,
  5
),
(
  '6',
  'Social Media Dashboard',
  'An analytics dashboard for social media management that provides unified tracking across multiple platforms. Built with React and Chart.js, it offers real-time data visualization and automated reporting.',
  'Social media analytics made easy',
  ARRAY['React', 'Chart.js', 'Node.js', 'MongoDB', 'Express', 'Social Media APIs'],
  'https://github.com/username/social-dashboard',
  'https://social-demo.com',
  'Analytics',
  false,
  '2.5 months',
  'Solo Project',
  '/placeholder.svg?height=300&width=400',
  'Social media managers needed a unified dashboard to track performance across platforms.',
  'Built a comprehensive analytics dashboard with real-time data visualization.',
  'Integrating multiple social media APIs and handling rate limits efficiently.',
  ARRAY['Multi-platform analytics', 'Real-time charts', 'Automated reports', 'Content scheduling', 'Performance insights'],
  true,
  6
),
(
  '7',
  'Fitness Tracker App',
  'A mobile fitness tracking application with workout plans and progress visualization. Built with React Native and Firebase, it provides comprehensive fitness tracking with social features.',
  'Your personal fitness companion',
  ARRAY['React Native', 'Firebase', 'Redux', 'Chart.js', 'AsyncStorage', 'Push Notifications'],
  'https://github.com/username/fitness-tracker',
  'https://fitness-demo.com',
  'Mobile App',
  false,
  '3.5 months',
  '2 developers',
  '/placeholder.svg?height=300&width=400',
  'Fitness enthusiasts needed a comprehensive app to track workouts and progress.',
  'Developed a mobile app with workout tracking, progress visualization, and social features.',
  'Optimizing performance for real-time workout tracking and offline functionality.',
  ARRAY['Workout tracking', 'Progress charts', 'Social sharing', 'Offline mode', 'Custom workout plans'],
  true,
  7
),
(
  '8',
  'Recipe Sharing Platform',
  'A community-driven recipe sharing platform with rating and commenting features. Built with Next.js and Prisma, it provides advanced search capabilities and social interaction features.',
  'Discover and share amazing recipes',
  ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'Cloudinary', 'Algolia', 'NextAuth'],
  'https://github.com/username/recipe-platform',
  'https://recipe-demo.com',
  'Social Platform',
  false,
  '4 months',
  '3 developers',
  '/placeholder.svg?height=300&width=400',
  'Food enthusiasts needed a platform to share and discover recipes with a community.',
  'Created a social platform for recipe sharing with rating, commenting, and search features.',
  'Implementing efficient search algorithms and managing large amounts of user-generated content.',
  ARRAY['Recipe sharing', 'Advanced search', 'User ratings', 'Photo uploads', 'Community features'],
  true,
  8
)
ON CONFLICT (id) DO NOTHING;
