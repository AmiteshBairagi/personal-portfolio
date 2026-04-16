"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSkills } from "@/hooks/useSkills"
import { Loader2, WifiOff, ChevronRight } from "lucide-react"

const SkillsSection = () => {
  const { skillsData, isLoading, error } = useSkills()
  const [selectedCategory, setSelectedCategory] = useState("Frontend")

  // Update selected category if it doesn't exist in current data
  useEffect(() => {
    const categories = Object.keys(skillsData)
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [skillsData, selectedCategory])

  if (isLoading) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-primary-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading skills...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-2 text-red-500 mb-4">
              <WifiOff className="w-6 h-6" />
              <span>Failed to load skills</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  const categories = Object.keys(skillsData)
  if (categories.length === 0) {
    return (
      <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No skills data available.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              My <span className="gradient-text">Skills</span>
            </h2>
            
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technologies I've mastered and the projects where I've applied them
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="flex flex-row lg:flex-col gap-1 lg:gap-2 lg:space-y-2 lg:space-x-0 sticky top-24 pb-2 lg:pb-0 overflow-x-auto lg:overflow-x-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                <div className="hidden lg:block bg-gradient-to-r from-gray-900 via-primary-700 to-gray-700 rounded-md font-semibold text-xs lg:text-base h-[40px] p-2 pl-6">Select Category</div>
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98, y: 1 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 text-left px-3 py-2 lg:px-4 lg:py-3 lg:w-full rounded-xl font-semibold transition-all duration-300 shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer group
                      ${selectedCategory === category
                        ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                        : "bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-white hover:dark:bg-slate-900 hover:border-cyan-400/50 hover:shadow-md"}
                    `}
                    style={{ minWidth: '80px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-base font-bold group-hover:text-slate-900 group-hover:dark:text-white transition-colors">
                        {category}
                      </span>
                      {/* <span className="md:hidden ml-2 text-[10px] lg:text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 text-gray-700 dark:text-gray-900 font-semibold">
                        {skillsData[category]?.length || 0}
                      </span> */}
                    </div>
                    <div className="text-xs lg:text-sm opacity-75 mt-1 group-hover:text-cyan-600 group-hover:dark:text-cyan-300 transition-colors">
                      {skillsData[category]?.length || 0} skills
                    </div>
                  </motion.button>
                ))}
              </div>
              {/* Scroll Arrow Hint - Mobile Only */}
              <motion.div
                className="absolute right-4 lg:hidden top-1/2 transform -translate-y-1/2"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-5 h-5 text-primary-500" />
              </motion.div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
              >
                {skillsData[selectedCategory]?.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_rgba(15,23,42,0.1))] dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_rgba(2,6,23,0.2))] border border-slate-200/70 dark:border-slate-800/80 shadow-lg hover:shadow-xl hover:border-cyan-400/60 transition-all duration-300 rounded-2xl">
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        {/* Skill Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {skill.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {skill.yearsOfExperience} experience
                            </p>
                          </div>
                          <Badge className="bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-100 border border-slate-700">
                            {skill.category}
                          </Badge>
                        </div>

                        {/* Projects */}
                        <div className="space-y-2">
                          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Projects
                          </div>
                          {skill.projects?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {skill.projects.map((project: string) => (
                                <span
                                  key={project}
                                  className="rounded-full bg-slate-900/5 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 px-3 py-1 text-xs border border-slate-200/60 dark:border-slate-700/70"
                                >
                                  {project}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No projects listed yet.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )) || (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No skills in this category yet.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}


export default SkillsSection