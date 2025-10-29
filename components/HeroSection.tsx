"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ArrowDown, Sparkles, Router } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ReactTyped } from "react-typed"


const HeroSection = () => {

  const skills = ["React", "Node.js", "TypeScript", "Python", "Next.js", "MongoDB"]
  const description = "Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and turning ideas into reality."


  // Use heroData with fallbacks
  const socialIcons = [
    {
      icon: Github,
      href: "#",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
    },
    {
      icon: Mail,
      href: "#",
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
      className="min-h-screen relative overflow-hidden py-4 sm:py-10 lg:py-16 bg-gray-50 dark:bg-dark-950"
    >

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Enhanced layout with better space utilization */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center justify-center min-h-[calc(85vh-5rem)] sm:min-h-[calc(85vh-3rem)] lg:min-h-[85vh]">

            {/* Show hero image only on large screens */}
            <div className="absolute bottom-0 right-0 md:bottom-0 md:right-40 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 80, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.5,
                  ease: [0.25, 1, 0.5, 1],
                }}
                whileHover={{
                  rotateY: 10,
                  rotateX: -5,
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
                style={{ transformOrigin: "center bottom" }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Image
                    src="/new-hero-image-removebg-preview.png"
                    alt="Amitesh portrait"
                    width={450}
                    height={450}
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </div>


            {/* Enhanced content section with better spacing */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-5 lg:space-y-8 w-full">
              {/* Enhanced heading with better typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 sm:space-y-4 lg:space-y-6 text-center lg:text-left"
              >
                <div className="space-y-2">
                  <h3>Hello World ...</h3>
                  <p className="text-4xl sm:text-5xl">
                    I'm{" "}
                    <span className="font-bold text-cyan-500 text-xl sm:text-4xl">
                      Amitesh Bairagi
                    </span>
                  </p>
                  <ReactTyped
                    className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium"
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

                <p className="text-sm sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed mt-2">
                  {description}
                </p>
              </motion.div>

              {/* Enhanced action buttons with better sizing */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  onClick={handleDownloadResume}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-xs sm:text-sm lg:text-sm shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>📖</span> <Link href="https://drive.google.com/file/d/1Wcio_BmvUzE1uZTsj4IwEWwgyZJn3Z-m/view?usp=drivesdk" target="_blank" rel="noopener noreferrer">Resume</Link> 
                </motion.button>

                <motion.button
                  onClick={handleViewWork}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-xs sm:text-sm lg:text-sm shadow-md hover:shadow-lg cursor-pointer"
                >
                  View My Work
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors text-xs sm:text-sm lg:text-sm shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>📖</span> <Link href="/interview-experience">Interview Experiences</Link>
                </motion.button>

                
              </motion.div>

              {/* Enhanced social links with better prominence */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-5"
              >
                <span className="text-sm sm:text-base lg:text-base text-gray-500 dark:text-gray-400 flex items-center font-medium">
                  <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                  Connect
                </span>
                <div className="flex space-x-4">
                  {socialIcons.map((social, index) => (
                    <motion.a
                      key={`${social.label}-${index}`}
                      href={social.href}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      whileHover={{ scale: 1.15, y: -3 }}
                      className="w-8 sm:w-9 lg:w-9 xl:w-10 h-8 sm:h-9 lg:h-9 xl:h-10 bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700/80 transition-all shadow-md hover:shadow-lg"
                    >
                      <social.icon className="w-3 sm:w-4 lg:w-4 h-3 sm:h-4 lg:h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced skills section with better layout */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-3"
              >
                <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={`${skill}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50 rounded-full text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700/80 transition-all cursor-default shadow-sm hover:shadow-md"                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>

              </motion.div>

              {/* Additional call-to-action section to fill space */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 }}
                className="text-center lg:text-left pt-2"
              >
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start">
                  <ArrowDown className="w-3 h-3 mr-2 animate-bounce" />
                  Scroll to explore my work
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
