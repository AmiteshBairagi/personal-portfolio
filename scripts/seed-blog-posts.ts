import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { BlogPost } from "../lib/blog-types"

// Sample blog posts data
const samplePosts: BlogPost[] = [
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
  // Add more sample posts as needed
]

// Directory where blog posts will be stored
const BLOG_DIR = path.join(process.cwd(), "content/blog")

// Ensure the blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true })
}

// Create blog posts
samplePosts.forEach((post) => {
  const filePath = path.join(BLOG_DIR, `${post.slug}.md`)

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Blog post "${post.title}" already exists, skipping...`)
    return
  }

  // Create frontmatter
  const frontmatter = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readTime: post.readTime,
    tags: post.tags,
    category: post.category,
    image: post.image,
    featured: post.featured,
    published: post.published,
  }

  // Create the markdown file content with frontmatter
  const fileContent = matter.stringify(post.content, frontmatter)

  // Write to file
  fs.writeFileSync(filePath, fileContent)
  console.log(`Created blog post: ${post.title}`)
})

console.log("Blog posts seeding completed!")
