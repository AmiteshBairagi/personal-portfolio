// "use client"

// import { memo, useMemo } from "react"
// import { motion } from "framer-motion"
// import { Github, Linkedin, Twitter, Mail, ArrowDown, Sparkles, BookOpen } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import OptimizedAnimation from "@/components/optimized-animation"
// import OptimizedFloatingAnimation from "@/components/optimized-floating-animation"
// import { fadeIn, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animation-utils"

// const socialIcons = [
//   { icon: Github, href: "#", label: "GitHub", color: "hover:bg-gray-600" },
//   { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-500" },
//   { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-cyan-500" },
//   { icon: Mail, href: "#", label: "Email", color: "hover:bg-purple-500" },
// ]

// const skills = ["React", "Node.js", "TypeScript", "Python", "Next.js", "MongoDB"]

// const SocialIcon = memo(({ social, index }: { social: (typeof socialIcons)[0]; index: number }) => (
//   <motion.a
//     key={social.label}
//     href={social.href}
//     initial={{ opacity: 0, scale: 0 }}
//     animate={{ opacity: 1, scale: 1 }}
//     transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 100 }}
//     whileHover={{ scale: 1.1, y: -2 }}
//     className={`w-9 lg:w-10 h-9 lg:h-10 bg-slate-800/60 border border-slate-600/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all backdrop-blur-sm ${social.color}`}
//     style={{ willChange: "transform" }}
//   >
//     <social.icon className="w-4 h-4" />
//   </motion.a>
// ))

// SocialIcon.displayName = "SocialIcon"

// const SkillTag = memo(({ skill, index }: { skill: string; index: number }) => (
//   <OptimizedAnimation
//     delay={0.2 + index * 0.1}
//     variants={fadeIn}
//     className="px-3 lg:px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-full text-xs lg:text-sm text-slate-200 backdrop-blur-sm hover:border-cyan-400/50 hover:bg-slate-700/60 transition-all cursor-default"
//   >
//     {skill}
//   </OptimizedAnimation>
// ))

// SkillTag.displayName = "SkillTag"

// // Static background elements to reduce repaints
// const BackgroundElements = memo(() => (
//   <div className="absolute inset-0 overflow-hidden">
//     {/* Grid Pattern - Using CSS background instead of DOM elements */}
//     <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

//     {/* Decorative Elements - Using CSS instead of animations where possible */}
//     <div className="absolute top-20 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
//     <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
//     <div className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>

//     {/* Optimized floating orbs */}
//     <div className="absolute top-10 left-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl transform-gpu">
//       <OptimizedFloatingAnimation amplitude={20} frequency={0.05}>
//         <div className="w-full h-full" />
//       </OptimizedFloatingAnimation>
//     </div>

//     <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform-gpu">
//       <OptimizedFloatingAnimation amplitude={30} frequency={0.04} phase={2}>
//         <div className="w-full h-full" />
//       </OptimizedFloatingAnimation>
//     </div>

//     <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 transform-gpu">
//       <OptimizedFloatingAnimation amplitude={15} frequency={0.06} phase={4}>
//         <div className="w-full h-full" />
//       </OptimizedFloatingAnimation>
//     </div>
//   </div>
// ))

// BackgroundElements.displayName = "BackgroundElements"

// export default memo(function OptimizedHeroSection() {
//   // Memoize content sections to prevent unnecessary re-renders
//   const headingContent = useMemo(
//     () => (
//       <OptimizedAnimation variants={fadeInLeft} delay={0.2} className="space-y-4 lg:space-y-6">
//         <div className="space-y-2">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-black bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-none tracking-tight">
//             AMITESH
//           </h1>
//           <div className="flex items-center space-x-4">
//             <div className="h-1 w-16 lg:w-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"></div>
//             <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-light">Full Stack Developer</p>
//           </div>
//         </div>

//         <p className="text-base lg:text-lg text-slate-400 max-w-lg leading-relaxed">
//           Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and
//           turning ideas into reality.
//         </p>

//         {/* Call-to-Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <Button
//             asChild
//             size="lg"
//             className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
//           >
//             <Link href="#projects">View My Work</Link>
//           </Button>
//           <Button
//             asChild
//             size="lg"
//             variant="outline"
//             className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 backdrop-blur-sm"
//           >
//             <Link href="/blog">
//               <BookOpen className="w-4 h-4 mr-2" />
//               Read My Blog
//             </Link>
//           </Button>
//         </div>
//       </OptimizedAnimation>
//     ),
//     [],
//   )

//   const skillsSection = useMemo(
//     () => (
//       <OptimizedAnimation variants={staggerContainer} className="flex flex-wrap gap-2 lg:gap-3">
//         {skills.map((skill, index) => (
//           <SkillTag key={skill} skill={skill} index={index} />
//         ))}
//       </OptimizedAnimation>
//     ),
//     [],
//   )

//   const socialSection = useMemo(
//     () => (
//       <OptimizedAnimation variants={fadeIn} delay={0.6} className="flex items-center space-x-4">
//         <span className="text-xs lg:text-sm text-slate-500 flex items-center">
//           <Sparkles className="w-3 h-3 mr-2" />
//           Connect with me
//         </span>
//         <div className="flex space-x-3">
//           {socialIcons.map((social, index) => (
//             <SocialIcon key={social.label} social={social} index={index} />
//           ))}
//         </div>
//       </OptimizedAnimation>
//     ),
//     [],
//   )

//   return (
//     <section
//       id="home"
//       className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
//     >
//       <BackgroundElements />

//       <div className="relative z-10 h-full flex items-center">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//           <div className="grid lg:grid-cols-12 gap-8 items-center">
//             {/* Left Side - Text Content */}
//             <div className="lg:col-span-7 space-y-6 lg:space-y-8">
//               {headingContent}
//               {skillsSection}
//               {socialSection}
//             </div>

//             {/* Right Side - Image */}
//             <div className="lg:col-span-5 relative mt-8 lg:mt-0">
//               <OptimizedAnimation variants={fadeInRight} delay={0.4} className="relative">
//                 {/* Enhanced Glow Effect Behind Image - Using CSS instead of animation */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 rounded-full blur-3xl scale-110"></div>

//                 {/* Image Container */}
//                 <div className="relative z-10 transform-gpu">
//                   <Image
//                     src="/profile-photo-nobg.png"
//                     alt="Amitesh - Full Stack Developer"
//                     width={500}
//                     height={500}
//                     className="w-full h-auto max-h-[60vh] lg:max-h-[70vh] object-contain drop-shadow-2xl"
//                     priority
//                     sizes="(max-width: 768px) 100vw, 50vw"
//                     loading="eager"
//                   />
//                 </div>

//                 {/* Enhanced Floating Elements - Using CSS transforms for better performance */}
//                 <OptimizedFloatingAnimation
//                   amplitude={8}
//                   frequency={0.08}
//                   className="absolute -top-4 -right-4 lg:-top-8 lg:-right-8 w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center transform-gpu"
//                 >
//                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
//                 </OptimizedFloatingAnimation>

//                 <OptimizedFloatingAnimation
//                   amplitude={10}
//                   frequency={0.06}
//                   phase={2}
//                   className="absolute -bottom-2 -left-4 lg:-bottom-4 lg:-left-8 w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full backdrop-blur-sm border border-purple-400/30 transform-gpu"
//                 />
//               </OptimizedAnimation>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Scroll Indicator - Using CSS animation instead of JS animation */}
//       <div
//         className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fade-in"
//         style={{ animationDelay: "1s", animationFillMode: "forwards" }}
//       >
//         <div className="flex flex-col items-center space-y-2 text-slate-400">
//           <span className="text-xs uppercase tracking-wider">Scroll Down</span>
//           <div className="animate-bounce">
//             <ArrowDown className="w-4 h-4" />
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// })
