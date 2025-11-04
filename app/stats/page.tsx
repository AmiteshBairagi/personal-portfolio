

import React from 'react'

const page = () => {
  return (
    <div>
      Coming Soon
    </div>
  )
}

export default page








// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { ArrowLeft, Trophy, Target, Code, Award } from "lucide-react"
// import Link from "next/link"
// import { ThemeProvider } from "@/contexts/theme-context"

// // Mock data - In real implementation, this would come from APIs
// const codingStats = {
//   leetcode: {
//     totalSolved: 450,
//     easy: 180,
//     medium: 220,
//     hard: 50,
//     ranking: 15420,
//     streak: 45,
//     badges: ["50 Days Badge", "100 Problems", "SQL Badge"],
//     recentSubmissions: [
//       { problem: "Two Sum", difficulty: "Easy", status: "Accepted", date: "2024-01-15" },
//       { problem: "Binary Tree Inorder", difficulty: "Medium", status: "Accepted", date: "2024-01-14" },
//       { problem: "Merge K Sorted Lists", difficulty: "Hard", status: "Accepted", date: "2024-01-13" },
//     ],
//   },
//   geeksforgeeks: {
//     totalSolved: 320,
//     score: 1850,
//     rank: 2340,
//     streak: 30,
//     badges: ["Problem Setter", "Monthly Challenge Winner", "Interview Ready"],
//     categories: {
//       Arrays: 85,
//       Strings: 65,
//       Trees: 45,
//       "Dynamic Programming": 35,
//       Graphs: 40,
//       Others: 50,
//     },
//   },
//   codechef: {
//     rating: 1654,
//     stars: 3,
//     globalRank: 8920,
//     countryRank: 1240,
//     contests: 25,
//     badges: ["3 Star Coder", "Contest Regular", "Problem Solver"],
//     recentContests: [
//       { name: "January Long Challenge", rank: 1205, rating: "+45" },
//       { name: "December Cook-Off", rank: 890, rating: "+32" },
//       { name: "November Lunchtime", rank: 1450, rating: "-15" },
//     ],
//   },
//   github: {
//     totalRepos: 45,
//     totalCommits: 1250,
//     contributions: 890,
//     followers: 120,
//     following: 85,
//     languages: {
//       JavaScript: 35,
//       Python: 25,
//       TypeScript: 20,
//       Java: 15,
//       Others: 5,
//     },
//     streak: 67,
//   },
// }

// export default function StatsPage() {
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Simulate API loading
//     const timer = setTimeout(() => setIsLoading(false), 1500)
//     return () => clearTimeout(timer)
//   }, [])

//   if (isLoading) {
//     return (
//       <ThemeProvider>
//         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600 dark:text-gray-300">Loading coding stats...</p>
//           </div>
//         </div>
//       </ThemeProvider>
//     )
//   }

//   return (
//     <ThemeProvider>
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <main className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             {/* Header */}
//             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
//               <Link
//                 href="/"
//                 className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to Portfolio
//               </Link>

//               <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
//                 Coding <span className="gradient-text">Statistics</span>
//               </h1>
//               <p className="text-lg text-gray-600 dark:text-gray-300">
//                 My performance across various coding platforms and competitive programming sites
//               </p>
//             </motion.div>

//             {/* LeetCode Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="mb-12"
//             >
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
//                 <Code className="w-6 h-6 mr-2 text-orange-500" />
//                 LeetCode
//               </h2>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-primary-500 mb-2">{codingStats.leetcode.totalSolved}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Problems Solved</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-yellow-500 mb-2">{codingStats.leetcode.ranking}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Global Ranking</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-green-500 mb-2">{codingStats.leetcode.streak}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Day Streak</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-blue-500 mb-2">{codingStats.leetcode.badges.length}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Badges Earned</div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="grid md:grid-cols-2 gap-6">
//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardHeader>
//                     <CardTitle>Problem Distribution</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <div className="flex justify-between mb-2">
//                         <span className="text-green-500">Easy</span>
//                         <span>{codingStats.leetcode.easy}</span>
//                       </div>
//                       <Progress
//                         value={(codingStats.leetcode.easy / codingStats.leetcode.totalSolved) * 100}
//                         className="h-2"
//                       />
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-2">
//                         <span className="text-yellow-500">Medium</span>
//                         <span>{codingStats.leetcode.medium}</span>
//                       </div>
//                       <Progress
//                         value={(codingStats.leetcode.medium / codingStats.leetcode.totalSolved) * 100}
//                         className="h-2"
//                       />
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-2">
//                         <span className="text-red-500">Hard</span>
//                         <span>{codingStats.leetcode.hard}</span>
//                       </div>
//                       <Progress
//                         value={(codingStats.leetcode.hard / codingStats.leetcode.totalSolved) * 100}
//                         className="h-2"
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardHeader>
//                     <CardTitle>Recent Submissions</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-3">
//                       {codingStats.leetcode.recentSubmissions.map((submission, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
//                         >
//                           <div>
//                             <div className="font-medium text-gray-900 dark:text-white">{submission.problem}</div>
//                             <div className="text-sm text-gray-600 dark:text-gray-300">{submission.date}</div>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Badge
//                               className={`${
//                                 submission.difficulty === "Easy"
//                                   ? "bg-green-500"
//                                   : submission.difficulty === "Medium"
//                                     ? "bg-yellow-500"
//                                     : "bg-red-500"
//                               } text-white`}
//                             >
//                               {submission.difficulty}
//                             </Badge>
//                             <Badge className="bg-green-500 text-white">{submission.status}</Badge>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </motion.div>

//             {/* GeeksforGeeks Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mb-12"
//             >
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
//                 <Target className="w-6 h-6 mr-2 text-green-500" />
//                 GeeksforGeeks
//               </h2>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-primary-500 mb-2">
//                       {codingStats.geeksforgeeks.totalSolved}
//                     </div>
//                     <div className="text-gray-600 dark:text-gray-300">Problems Solved</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-green-500 mb-2">{codingStats.geeksforgeeks.score}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Total Score</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-yellow-500 mb-2">{codingStats.geeksforgeeks.rank}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Global Rank</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-blue-500 mb-2">{codingStats.geeksforgeeks.streak}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Day Streak</div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card className="bg-white dark:bg-dark-800">
//                 <CardHeader>
//                   <CardTitle>Problem Categories</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid md:grid-cols-2 gap-4">
//                     {Object.entries(codingStats.geeksforgeeks.categories).map(([category, count]) => (
//                       <div key={category} className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-700 dark:text-gray-300">{category}</span>
//                           <span className="font-semibold">{count}</span>
//                         </div>
//                         <Progress value={(count / codingStats.geeksforgeeks.totalSolved) * 100} className="h-2" />
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* CodeChef Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="mb-12"
//             >
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
//                 <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
//                 CodeChef
//               </h2>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-primary-500 mb-2">{codingStats.codechef.rating}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Current Rating</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-yellow-500 mb-2">{codingStats.codechef.stars}★</div>
//                     <div className="text-gray-600 dark:text-gray-300">Star Rating</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-green-500 mb-2">{codingStats.codechef.globalRank}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Global Rank</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-blue-500 mb-2">{codingStats.codechef.contests}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Contests</div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card className="bg-white dark:bg-dark-800">
//                 <CardHeader>
//                   <CardTitle>Recent Contest Performance</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     {codingStats.codechef.recentContests.map((contest, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
//                       >
//                         <div>
//                           <div className="font-medium text-gray-900 dark:text-white">{contest.name}</div>
//                           <div className="text-sm text-gray-600 dark:text-gray-300">Rank: {contest.rank}</div>
//                         </div>
//                         <Badge
//                           className={`${contest.rating.startsWith("+") ? "bg-green-500" : "bg-red-500"} text-white`}
//                         >
//                           {contest.rating}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             {/* GitHub Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="mb-12"
//             >
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
//                 <Award className="w-6 h-6 mr-2 text-gray-700 dark:text-gray-300" />
//                 GitHub
//               </h2>

//               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-primary-500 mb-2">{codingStats.github.totalRepos}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Repositories</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-green-500 mb-2">{codingStats.github.totalCommits}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Total Commits</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-yellow-500 mb-2">{codingStats.github.contributions}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Contributions</div>
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-white dark:bg-dark-800">
//                   <CardContent className="p-6 text-center">
//                     <div className="text-3xl font-bold text-blue-500 mb-2">{codingStats.github.streak}</div>
//                     <div className="text-gray-600 dark:text-gray-300">Day Streak</div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <Card className="bg-white dark:bg-dark-800">
//                 <CardHeader>
//                   <CardTitle>Language Distribution</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {Object.entries(codingStats.github.languages).map(([language, percentage]) => (
//                       <div key={language} className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-gray-700 dark:text-gray-300">{language}</span>
//                           <span className="font-semibold">{percentage}%</span>
//                         </div>
//                         <Progress value={percentage} className="h-2" />
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>
//         </main>
//       </div>
//     </ThemeProvider>
//   )
// }
