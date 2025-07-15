export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  readTime: number
  tags: string[]
  category: string
  image: string
  featured: boolean
  published: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "My Journey Through Google's Technical Interview Process",
    slug: "google-technical-interview-experience",
    excerpt:
      "A detailed walkthrough of my experience interviewing at Google, including the preparation strategy, interview rounds, and key learnings that helped me succeed.",
    content: `# My Journey Through Google's Technical Interview Process

## Introduction

Landing a job at Google has been a dream of mine for years. After months of preparation and multiple interview rounds, I'm excited to share my experience and the strategies that helped me succeed.

## Preparation Phase

### Data Structures and Algorithms
I spent 3 months focusing on:
- **Arrays and Strings**: Mastered sliding window, two pointers
- **Trees and Graphs**: BFS, DFS, and tree traversals
- **Dynamic Programming**: Started with basic problems and built up complexity
- **System Design**: Studied scalable architectures and distributed systems

### Resources Used
- LeetCode Premium (solved 300+ problems)
- Cracking the Coding Interview
- System Design Interview by Alex Xu
- Mock interviews with peers

## Interview Rounds

### Phone Screen (45 minutes)
The phone screen focused on a medium-level coding problem involving tree traversal. The interviewer was friendly and provided hints when I got stuck.

**Key Tips:**
- Think out loud
- Ask clarifying questions
- Start with a brute force approach

### On-site Interviews (5 rounds)

#### Round 1: Coding (45 minutes)
Problem: Design a data structure for a social media feed
- Discussed trade-offs between different approaches
- Implemented a solution using hash maps and priority queues

#### Round 2: Coding (45 minutes)
Problem: Graph algorithms and shortest path
- Used Dijkstra's algorithm
- Optimized for space complexity

#### Round 3: System Design (45 minutes)
Design a URL shortener like bit.ly
- Discussed scalability, database design, and caching strategies
- Covered load balancing and geographic distribution

#### Round 4: Behavioral (30 minutes)
- Leadership examples
- Conflict resolution
- Why Google?

#### Round 5: Googleyness (30 minutes)
- Cultural fit questions
- Problem-solving approach
- Collaboration examples

## Key Learnings

### Technical Preparation
1. **Consistency is key**: Daily practice for 2-3 hours
2. **Quality over quantity**: Focus on understanding patterns
3. **Mock interviews**: Practice with real people, not just coding

### During Interviews
1. **Communication**: Explain your thought process clearly
2. **Collaboration**: Treat the interviewer as a teammate
3. **Adaptability**: Be ready to pivot when given feedback

### Behavioral Preparation
1. **STAR method**: Structure your answers (Situation, Task, Action, Result)
2. **Specific examples**: Have concrete stories ready
3. **Research**: Know Google's values and recent projects

## Common Mistakes to Avoid

- Jumping into coding without understanding the problem
- Not considering edge cases
- Ignoring the interviewer's hints
- Not asking about requirements and constraints

## Final Thoughts

The Google interview process is challenging but fair. They're looking for strong problem-solving skills, good communication, and cultural fit. The key is thorough preparation and staying calm during the interviews.

Remember, even if you don't get the offer, the preparation and experience are valuable for your career growth.

## Resources for Preparation

- [LeetCode](https://leetcode.com)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [Behavioral Interview Guide](https://www.amazon.com/Behavioral-Interviews-Everyone-Questions-Answers/dp/0998120448)

Good luck with your interviews!`,
    author: "Amitesh",
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-15",
    readTime: 8,
    tags: ["Interview", "Google", "Career", "Technical Interview"],
    category: "Interview Experience",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    published: true,
  },
  {
    id: "2",
    title: "Building Scalable React Applications: A Complete Guide",
    slug: "building-scalable-react-applications",
    excerpt:
      "Learn how to structure and build React applications that can scale from small projects to enterprise-level solutions. Covers architecture patterns, state management, and performance optimization.",
    content: `# Building Scalable React Applications: A Complete Guide

## Introduction

As React applications grow in complexity, maintaining clean, scalable code becomes crucial. This guide covers essential patterns and practices for building React apps that can scale.

## Project Structure

### Feature-Based Organization
\`\`\`
src/
├── components/
│   ├── ui/
│   └── common/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── profile/
├── hooks/
├── services/
├── utils/
└── types/
\`\`\`

## State Management

### Context vs Redux vs Zustand
- **Context**: Great for theme, auth state
- **Redux**: Complex state with time-travel debugging
- **Zustand**: Lightweight alternative to Redux

## Performance Optimization

### Code Splitting
\`\`\`jsx
const LazyComponent = lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### Memoization
- Use React.memo for components
- useMemo for expensive calculations
- useCallback for function references

## Testing Strategy

### Testing Pyramid
1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Full user workflows

## Deployment and CI/CD

### Best Practices
- Automated testing in CI pipeline
- Environment-specific configurations
- Performance monitoring
- Error tracking with Sentry

## Conclusion

Building scalable React applications requires thoughtful architecture, proper state management, and continuous optimization. Start with these patterns and adapt them to your specific needs.`,
    author: "Amitesh",
    publishedAt: "2024-01-10",
    updatedAt: "2024-01-10",
    readTime: 12,
    tags: ["React", "JavaScript", "Architecture", "Performance"],
    category: "Technical Tutorial",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    published: true,
  },
  {
    id: "3",
    title: "Mastering TypeScript: From Basics to Advanced Patterns",
    slug: "mastering-typescript-advanced-patterns",
    excerpt:
      "Deep dive into TypeScript's advanced features including generics, conditional types, mapped types, and how to leverage them for better code quality and developer experience.",
    content: `# Mastering TypeScript: From Basics to Advanced Patterns

## Why TypeScript?

TypeScript adds static typing to JavaScript, catching errors at compile time and improving developer experience with better IDE support.

## Advanced Type Patterns

### Conditional Types
\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };
\`\`\`

### Mapped Types
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

### Utility Types
- \`Pick<T, K>\`: Select specific properties
- \`Omit<T, K>\`: Exclude specific properties
- \`Record<K, T>\`: Create object type with specific keys

## Real-World Examples

### API Client with Type Safety
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }
}

const client = new ApiClient();
const user = await client.get<User>('/api/users/1');
// user is now typed as User
\`\`\`

## Best Practices

1. **Start strict**: Enable strict mode from the beginning
2. **Use interfaces**: For object shapes and contracts
3. **Leverage inference**: Let TypeScript infer types when possible
4. **Generic constraints**: Use extends for better type safety

## Conclusion

TypeScript's type system is powerful and can significantly improve code quality. Start with basics and gradually adopt advanced patterns as your understanding grows.`,
    author: "Amitesh",
    publishedAt: "2024-01-05",
    updatedAt: "2024-01-05",
    readTime: 10,
    tags: ["TypeScript", "JavaScript", "Programming", "Web Development"],
    category: "Technical Tutorial",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    published: true,
  },
  {
    id: "4",
    title: "My Experience with Amazon's Leadership Principles Interview",
    slug: "amazon-leadership-principles-interview",
    excerpt:
      "How I prepared for and navigated Amazon's unique behavioral interview process focused on their 16 leadership principles. Includes specific examples and preparation strategies.",
    content: `# My Experience with Amazon's Leadership Principles Interview

## Understanding Amazon's Leadership Principles

Amazon's interview process heavily focuses on their 16 leadership principles. Each principle represents a core value that guides decision-making at Amazon.

## Key Principles I Encountered

### Customer Obsession
**Question**: "Tell me about a time you went above and beyond for a customer."

**My Response**: I shared a story about redesigning our user onboarding flow after analyzing user feedback, resulting in 40% higher completion rates.

### Ownership
**Question**: "Describe a situation where you took ownership of a problem that wasn't directly your responsibility."

### Dive Deep
**Question**: "Tell me about a time you had to dig deep into data to solve a problem."

## Preparation Strategy

### STAR Method
- **Situation**: Set the context
- **Task**: Explain your responsibility
- **Action**: Describe what you did
- **Result**: Share the outcome with metrics

### Story Bank
I prepared 20+ stories covering different principles:
- Leadership examples
- Technical challenges
- Team conflicts
- Customer-focused decisions

## Interview Experience

The behavioral rounds were intense but fair. Interviewers asked follow-up questions to understand my thought process and decision-making.

## Key Takeaways

1. **Be specific**: Use concrete examples with metrics
2. **Show growth**: Explain what you learned
3. **Demonstrate impact**: Quantify your results
4. **Be authentic**: Don't fabricate stories

## Conclusion

Amazon's leadership principles aren't just interview topics—they're deeply embedded in the company culture. Understanding and embodying these principles is crucial for success.`,
    author: "Amitesh",
    publishedAt: "2023-12-20",
    updatedAt: "2023-12-20",
    readTime: 6,
    tags: ["Interview", "Amazon", "Leadership", "Career"],
    category: "Interview Experience",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    published: true,
  },
  {
    id: "5",
    title: "Building a Full-Stack Application with Next.js and Supabase",
    slug: "fullstack-nextjs-supabase-tutorial",
    excerpt:
      "Step-by-step guide to building a modern full-stack application using Next.js 14, Supabase for backend services, and implementing authentication, real-time features, and deployment.",
    content: `# Building a Full-Stack Application with Next.js and Supabase

## Project Overview

We'll build a task management application with real-time updates, user authentication, and a modern UI.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel

## Setting Up the Project

### Initialize Next.js Project
\`\`\`bash
npx create-next-app@latest task-manager --typescript --tailwind --app
cd task-manager
\`\`\`

### Install Dependencies
\`\`\`bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
\`\`\`

## Supabase Configuration

### Database Schema
\`\`\`sql
-- Users table (handled by Supabase Auth)
-- Tasks table
create table tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  completed boolean default false,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table tasks enable row level security;

-- Policies
create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);
\`\`\`

## Implementation

### Supabase Client
\`\`\`typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
\`\`\`

### Authentication
\`\`\`typescript
// components/auth/login-form.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error:', error.message)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  )
}
\`\`\`

## Deployment

### Environment Variables
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### Deploy to Vercel
\`\`\`bash
npm run build
vercel --prod
\`\`\`

## Conclusion

This stack provides a powerful foundation for modern web applications with minimal backend setup. Supabase handles authentication, database, and real-time features, while Next.js provides an excellent developer experience.

## Next Steps
- Add file uploads with Supabase Storage
- Implement email notifications
- Add advanced filtering and search
- Set up monitoring and analytics`,
    author: "Amitesh",
    publishedAt: "2023-12-15",
    updatedAt: "2023-12-15",
    readTime: 15,
    tags: ["Next.js", "Supabase", "Full-Stack", "Tutorial"],
    category: "Technical Tutorial",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    published: true,
  },
]

export const blogCategories = [
  "All",
  "Interview Experience",
  "Technical Tutorial",
  "Career Advice",
  "Web Development",
  "Programming",
]

export const getFeaturedPosts = () => blogPosts.filter((post) => post.featured && post.published)
export const getPublishedPosts = () => blogPosts.filter((post) => post.published)
export const getPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug)
export const getPostsByCategory = (category: string) =>
  category === "All" ? getPublishedPosts() : blogPosts.filter((post) => post.category === category && post.published)
