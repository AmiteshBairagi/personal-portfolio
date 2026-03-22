"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ArrowDown, Sparkles, Router } from "lucide-react"
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import Image from "next/image"
import Link from "next/link"
import { ReactTyped } from "react-typed"


const HeroSection = () => {

  const skills = ["Java", "Spring Boot", "React", "PostgreSQL", "MySQL", "MongoDB"]
  const description = "Building scalable, real-world software with modern technologies. Focused on clean architecture, performance, and delivering impactful solutions."


  // Use heroData with fallbacks
  const socialIcons = [
    {
      icon: Github,
      href: "https://github.com/AmiteshBairagi?tab=repositories",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/amitesh-bairagi/",
      label: "LinkedIn",
    },
    {
      icon: SiLeetcode,
      href: "https://leetcode.com/u/AmiteshBairagi/",
      label: "Leetcode",
    },
    {
      icon: SiGeeksforgeeks,
      href: "https://www.geeksforgeeks.org/profile/amiteshbairagi?tab=activity",
      label: "GFG",
    },
    {
      icon: Mail,
      href: "#contact",
      label: "Email",
    },
  ]



  const handleViewWork = () => {

  }

  const handleDownloadResume = () => {

  }


  return (
    <section
      id="home"
      className="min-h-[80dvh] relative overflow-hidden py-4 sm:py-4 lg:py-16 bg-slate-950 flex items-center"
    >
      {/* Absolute Ambient Lighting & Grids */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle geometric dot grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/4 translate-y-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[100px] sm:blur-[150px]"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">


          {/* Enhanced content section with better spacing */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8 w-full z-10">

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm self-start"
            >
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-300">Available for Work</span>
            </motion.div>

            {/* Enhanced heading with better typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 text-center lg:text-left"
            >
              <div className="space-y-4">
                <h3 className="text-slate-400 font-medium tracking-wide uppercase text-sm sm:text-base">Hello World ...</h3>
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  I'm{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] block sm:inline mt-2 sm:mt-0">
                    Amitesh Bairagi
                  </span>
                </h1>
                <ReactTyped
                  className="text-xl sm:text-2xl text-cyan-400/90 font-medium h-8 block"
                  strings={[
                    "I’m a Software Engineer",
                    "I’m a Web Developer",
                    "I’m a Problem Solver",
                    "I’m a Guitarist 🎸",
                  ]}
                  typeSpeed={50}
                  backSpeed={30}
                  backDelay={1000}
                  loop
                />
              </div>

              <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed mt-4">
                {description}
              </p>
            </motion.div>

            {/* Enhanced action buttons with better sizing and high end premium styles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
            >
              <Link href="https://drive.google.com/file/d/1Wcio_BmvUzE1uZTsj4IwEWwgyZJn3Z-m/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto block">
                <motion.button
                  onClick={handleDownloadResume}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium transition-all text-sm sm:text-base shadow-lg shadow-amber-500/25 border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>📖</span> View Resume
                </motion.button>
              </Link>

              <Link href="#projects" className="w-full sm:w-auto block">
                <motion.button
                  onClick={handleViewWork}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(30,30,30,0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium transition-all text-sm sm:text-base shadow-lg shadow-cyan-500/25 border border-white/10 flex items-center justify-center gap-2"
                >
                  View My Work
                </motion.button>
              </Link>

              <Link href="/interview-experience" className="w-full sm:w-auto block">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium transition-all text-sm sm:text-base shadow-lg shadow-purple-500/25 border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>💡</span> Interviews
                </motion.button>
              </Link>
            </motion.div>

            {/* Enhanced social links with glassmorphic bubbles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-4"
            >
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={`${social.label}-${index}`}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    whileHover={{ scale: 1.15, y: -4, backgroundColor: "rgba(6,182,212,0.15)", borderColor: "rgba(6,182,212,0.4)" }}
                    className="w-10 sm:w-12 h-10 sm:h-12 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all shadow-lg"
                  >
                    <social.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Enhanced skills section with glowing pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="pt-2"
            >
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                {skills.map((skill, index) => (
                  <motion.div
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2, borderColor: "rgba(6,182,212,0.5)", backgroundColor: "rgba(6,182,212,0.1)" }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-[11px] sm:text-xs font-medium text-slate-300 transition-all cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:text-cyan-400"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional call-to-action section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
              className="text-center lg:text-left pt-6 lg:pt-10"
            >
              <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center lg:justify-start">
                <ArrowDown className="w-3 h-3 mr-2 animate-bounce text-cyan-500" />
                Scroll to explore my work
              </p>
            </motion.div>
          </div>

          {/* Desktop Hero Image (Phase 3: Image & Flairs) */}
          <div className="hidden lg:flex order-1 lg:order-2 lg:col-span-5 relative w-full h-[500px] xl:h-[600px] items-center justify-center -mt-10 xl:-mt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 80, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
              className="relative z-10 w-full max-w-[450px]"
            >
              {/* Image Glow Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl transform scale-90"></div>

              {/* Floating Tech Flair 1 (React) */}
              <motion.div
                animate={{ y: [-15, 15, -15], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-10 -left-10 w-16 h-16 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/10 z-20"
              >
                <Router className="w-8 h-8 text-cyan-400" />
              </motion.div>

              {/* Floating Tech Flair 2 (Node) */}
              <motion.div
                animate={{ y: [15, -15, 15], rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-10 w-14 h-14 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10 z-20"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>

              {/* The actual Image */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10 drop-shadow-[0_20px_50px_rgba(6,182,212,0.3)]"
              >
                <Image
                  src="/new-hero-image-removebg-preview.png"
                  alt="Amitesh portrait"
                  width={450}
                  height={450}
                  className="object-contain w-full h-auto"
                  priority
                />
              </motion.div>

              {/* Decorative Bottom Base */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/40 blur-xl rounded-[100%]"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
