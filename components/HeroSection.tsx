"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ArrowDown } from "lucide-react"
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import Link from "next/link"
import { ReactTyped } from "react-typed"


const HeroSection = () => {

  const skills = ["Java","C","C++","Python","NextJs","HTML","CSS", "Spring Boot", "React", "PostgreSQL", "MySQL", "MongoDB"]
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
      className="min-h-[100dvh] relative overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center"
    >
      {/* Absolute Ambient Lighting & Grids */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle geometric dot grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,116,144,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.08)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)]"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[100px] sm:blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/4 translate-y-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] sm:blur-[150px]"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">


          {/* Enhanced content section with better spacing */}
          <div className="order-2 lg:order-1 w-full z-10 lg:col-span-7 lg:text-left lg:pr-6">

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-white/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm self-start"
            >
              <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Available for Work</span>
            </motion.div>

            {/* Enhanced heading with better typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-5 text-center lg:text-left"
            >
              <div className="space-y-4">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium tracking-[0.3em] uppercase text-xs sm:text-sm">Hello World</h3>
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                  I'm{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] block sm:inline mt-2 sm:mt-0">
                    Amitesh Bairagi
                  </span>
                </h1>
                <ReactTyped
                  className="text-xl sm:text-2xl text-cyan-600 dark:text-cyan-400/90 font-medium h-8 block"
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

              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {description}
              </p>
            </motion.div>

            {/* Enhanced action buttons with better sizing and high end premium styles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-5"
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
                  <span>🙈​</span> View My Work
                </motion.button>
              </Link>

              <Link href="/blogs" className="w-full sm:w-auto block">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium transition-all text-sm sm:text-base shadow-lg shadow-purple-500/25 border border-white/10 flex items-center justify-center gap-2"
                >
                  <span>💡</span> Blogs & Articles
                </motion.button>
              </Link>
            </motion.div>

            {/* Enhanced social links with glassmorphic bubbles */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 pt-5 lg:hidden"
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
                    className="w-10 sm:w-12 h-10 sm:h-12 bg-white/80 dark:bg-slate-800/75 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/70 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all shadow-lg"
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
              className="pt-2 lg:hidden"
            >
              {/* Mobile: Scrolling carousel, Desktop: Grid */}
              <div className="lg:hidden -mx-4 sm:mx-0">
                {/* Mobile skills carousel - scrolling from right to left */}
                <div className="overflow-hidden bg-gradient-to-r from-slate-50 via-slate-50/0 to-slate-50 dark:from-slate-950 dark:via-slate-950/0 dark:to-slate-950 relative">
                  <motion.div
                    animate={{ x: ["60%", "-100%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5 + skills.length,
                      ease: "linear",
                    }}
                    className="flex gap-2 sm:gap-3 whitespace-nowrap px-4"
                  >
                    {/* First set of skills */}
                    {skills.map((skill, index) => (
                      <motion.div
                        key={`${skill}-${index}`}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/50 rounded-xl text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:text-cyan-500 dark:hover:text-cyan-400 flex-shrink-0"
                      >
                        {skill}
                      </motion.div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {skills.map((skill, index) => (
                      <motion.div
                        key={`${skill}-${index}-duplicate`}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/50 rounded-xl text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:text-cyan-500 dark:hover:text-cyan-400 flex-shrink-0"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Desktop: Static grid layout */}
              <div className="hidden lg:flex flex-wrap gap-2 sm:gap-3 justify-start">
                {skills.map((skill, index) => (
                  <motion.div
                    key={`${skill}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2, borderColor: "rgba(6,182,212,0.5)", backgroundColor: "rgba(6,182,212,0.1)" }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/70 dark:border-slate-700/50 rounded-xl text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:text-cyan-500 dark:hover:text-cyan-400"
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
              className="text-center lg:text-left pt-6 lg:pt-8"
            >
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 flex items-center justify-center lg:justify-start">
                <ArrowDown className="w-3 h-3 mr-2 animate-bounce text-cyan-500" />
                Scroll to explore my work
              </p>
            </motion.div>
          </div>

          {/* Desktop-only layout panel */}
          <div className="hidden lg:flex lg:col-span-5 w-full">
            <div className="w-full rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-[0_30px_90px_-70px_rgba(15,23,42,0.8)]">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Focus Areas</p>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-2">Building reliable, elegant products</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Projects", value: "15+" },
                    { label: "Years", value: "3+" },
                    { label: "Tech Stack", value: "10+" },
                    { label: "Certs", value: "5+" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/60 p-4">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Tech Stack</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-950/60 px-3 py-1 text-xs text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Connect</p>
                  <div className="flex items-center gap-3 mt-3">
                    {socialIcons.map((social, index) => (
                      <motion.a
                        key={`${social.label}-desktop-${index}`}
                        href={social.href}
                        whileHover={{ scale: 1.08, y: -2 }}
                        className="w-10 h-10 rounded-full border border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-cyan-500"
                      >
                        <social.icon className="w-4 h-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
