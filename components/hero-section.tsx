"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail, ArrowDown, Sparkles } from "lucide-react"
import Image from "next/image"
import { useHeroData } from "@/hooks/use-hero-data"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

const HeroSection = () => {
  const { heroData, lastUpdate } = useHeroData()
  const [renderKey, setRenderKey] = useState(0)
  const router = useRouter()
  const initialRenderRef = useRef(true)

  // Only update render key when data actually changes, not on initial load
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    if (heroData && lastUpdate) {
      setRenderKey((prev) => prev + 1)
    }
  }, [heroData, lastUpdate])

  // Navigation functions
  const handleViewWork = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleReadBlogs = () => {
    router.push("/blog")
  }

  // Use heroData with fallbacks
  const socialIcons = [
    {
      icon: Github,
      href: heroData?.social_links?.github ||  "#",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: heroData?.social_links?.linkedin || "#",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: heroData?.social_links?.twitter  || "#",
      label: "Twitter",
    },
    {
      icon: Mail,
      href: heroData?.social_links?.email  || "#",
      label: "Email",
    },
  ]

  const skills = heroData?.skills || ["React", "Node.js", "TypeScript", "Python", "Next.js", "MongoDB"]
  const name = heroData?.name || "Amitesh"
  const title = heroData?.title || "Full Stack Developer"
  const description =
    heroData?.description ||
    "Crafting digital experiences with modern technologies. Passionate about clean code, innovative solutions, and turning ideas into reality."

  // Use the hero image from database or fallback - stable reference
  const heroImage = heroData?.heroImage || "/new-hero-image.jpg"

  return (
    <section
      id="home"
      className="min-h-screen relative overflow-hidden py-6 sm:py-12 lg:py-20 bg-gray-50 dark:bg-dark-950"
    >
      

      {/* Additional background elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute top-1/4 right-8 w-16 h-16 border border-dashed border-gray-600/20 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-8 w-12 h-12 bg-gray-800/10 rounded-full"
        ></motion.div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center pt-16 sm:pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Enhanced layout with better space utilization */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center justify-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-screen">
            {/* Enhanced image section with better sizing */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-none mx-auto lg:mx-0 lg:ml-0 lg:-mt-8 xl:-mt-12 2xl:-mt-16 lg:-ml-8 xl:-ml-12 2xl:-ml-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Enhanced Image Container - Perfectly Centered Circular Design */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10"
                >
                  {/* Circular Image Container with Perfect Centering */}
                  <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] 2xl:w-[460px] 2xl:h-[460px] mx-auto lg:mx-0">
                    {/* Circular Border with Gradient */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 via-transparent to-purple-500/20 p-1">
                      <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800/50 p-2">
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                          {/* Perfectly Centered Image with Optimized Positioning */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              <Image
                                src={heroImage || "/placeholder.svg"}
                                alt={`${name} - ${title}`}
                                fill
                                className="object-cover"
                                style={{
                                  objectPosition: "center 20%",
                                  transform: "scale(1.3)",
                                }}
                                priority
                                unoptimized
                                sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 320px, (max-width: 1280px) 380px, (max-width: 1536px) 420px, 460px"
                              />
                            </div>
                          </div>

                          {/* Enhanced Inner Shadow for Perfect Depth */}
                          <div className="absolute inset-0 rounded-full shadow-inner bg-gradient-to-t from-black/8 via-transparent to-white/5"></div>

                          {/* Additional centering overlay for fine-tuning */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-black/5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Ring Effect - Perfectly Centered */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30 dark:border-cyan-400/20"
                      style={{
                        borderRadius: "50%",
                        transform: "scale(1.05)",
                        transformOrigin: "center center",
                      }}
                    />

                    {/* Perfect Circle Verification Ring (invisible but ensures perfect circle) */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        aspectRatio: "1 / 1",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </motion.div>

                {/* Enhanced floating elements - repositioned for circular layout */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 md:-top-8 md:-right-8 lg:-top-10 lg:-right-10 xl:-top-12 xl:-right-12 w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 bg-gray-200 dark:bg-gray-800/80 rounded-full border border-gray-300 dark:border-gray-700/50 flex items-center justify-center shadow-lg"
                >
                  <div className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 xl:w-4 h-2 sm:h-2.5 md:h-3 lg:h-3.5 xl:h-4 bg-cyan-400 rounded-full animate-pulse"></div>
                </motion.div>

                <motion.div
                  animate={{ y: [8, -8, 8] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 md:-bottom-8 md:-left-8 lg:-bottom-10 lg:-left-10 xl:-bottom-12 xl:-left-12 w-6 sm:w-7 md:w-8 lg:w-10 xl:w-12 h-6 sm:h-7 md:h-8 lg:h-10 xl:h-12 bg-gray-200 dark:bg-gray-800/80 rounded-full border border-gray-300 dark:border-gray-700/50 shadow-lg"
                ></motion.div>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute top-1/4 -left-6 sm:-left-8 md:-left-10 lg:-left-12 xl:-left-14 w-6 sm:w-8 md:w-10 lg:w-12 xl:w-14 h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 border-2 border-dashed border-gray-400 dark:border-gray-600/40 rounded-full"
                ></motion.div>

                {/* Additional Circular Accent Elements */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute top-1/3 -right-8 sm:-right-10 md:-right-12 lg:-right-14 xl:-right-16 w-4 sm:w-5 md:w-6 lg:w-7 xl:w-8 h-4 sm:h-5 md:h-6 lg:h-7 xl:h-8 bg-purple-400/20 rounded-full"
                ></motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="absolute bottom-1/3 -left-8 sm:-left-10 md:-left-12 lg:-left-14 xl:-left-16 w-3 sm:w-4 md:w-5 lg:w-6 xl:w-7 h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 border border-cyan-300/30 rounded-full"
                ></motion.div>
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
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                    {name}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <div className="h-1 sm:h-1.5 w-10 sm:w-14 lg:w-16 xl:w-20 bg-cyan-400 rounded-full"></div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 font-light">
                      {title}
                    </p>
                  </div>
                </div>

                <p className="text-sm sm:text-base lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
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
                  onClick={handleViewWork}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors text-sm sm:text-base lg:text-base shadow-lg hover:shadow-xl cursor-pointer"
                >
                  View My Work
                </motion.button>
                <motion.button
                  onClick={handleReadBlogs}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors border border-gray-700 dark:border-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-base shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>📖</span> Read My Blog
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
                  Connect with me
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
                      className="w-10 sm:w-11 lg:w-11 xl:w-12 h-10 sm:h-11 lg:h-11 xl:h-12 bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700/80 transition-all shadow-md hover:shadow-lg"
                    >
                      <social.icon className="w-4 sm:w-5 lg:w-5 h-4 sm:h-5 lg:h-5" />
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
                  {skills.slice(0, 4).map((skill, index) => (
                    <motion.div
                      key={`${skill}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50 rounded-full text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700/80 transition-all cursor-default shadow-sm hover:shadow-md"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>

                {/* Second row of skills for better space utilization */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start">
                  {skills.slice(4).map((skill, index) => (
                    <motion.div
                      key={`${skill}-${index + 4}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700/50 rounded-full text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-600/50 hover:bg-gray-300 dark:hover:bg-gray-700/80 transition-all cursor-default shadow-sm hover:shadow-md"
                    >
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
