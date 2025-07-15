-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Amitesh',
    published_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_time INTEGER NOT NULL DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100) NOT NULL DEFAULT 'Technical Tutorial',
    image TEXT DEFAULT '/placeholder.svg?height=400&width=600',
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_display_order ON blog_posts(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_active ON blog_posts(is_active);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
DROP POLICY IF EXISTS "Enable read access for all users" ON blog_posts;
CREATE POLICY "Enable read access for all users" ON blog_posts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON blog_posts;
CREATE POLICY "Enable insert for authenticated users only" ON blog_posts
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON blog_posts;
CREATE POLICY "Enable update for authenticated users only" ON blog_posts
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON blog_posts;
CREATE POLICY "Enable delete for authenticated users only" ON blog_posts
    FOR DELETE USING (true);

-- Insert sample blog posts
INSERT INTO blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    author, 
    published_at, 
    category, 
    tags, 
    featured, 
    published, 
    display_order, 
    image
) VALUES 
(
    'Mastering React Hooks: A Complete Guide',
    'mastering-react-hooks-complete-guide',
    'React Hooks revolutionized how we write React components. Learn the most important hooks and how to use them effectively in your applications.',
    '# Mastering React Hooks: A Complete Guide

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components. In this comprehensive guide, we will explore the most important hooks and how to use them effectively.

## What are React Hooks?

React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They were introduced in React 16.8 and have become the standard way to write React components.

## Essential Hooks

### useState Hook

The `useState` hook allows you to add state to functional components:

```javascript
import React, { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
