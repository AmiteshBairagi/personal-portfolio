"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSkillsData } from "@/hooks/use-skills-data"
import { Loader2, Wifi, WifiOff } from "lucide-react"

const SkillsSection = () => {
  const { skillsData, isLoading, error } = useSkillsData()
  const [selectedCategory, setSelectedCategory] = useState("Frontend")
  const [selectedSkill, setSelectedSkill] = useState<any>(null)

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
            <div className="flex flex-row lg:flex-col gap-1 lg:gap-2 lg:space-y-2 lg:space-x-0 sticky top-24 pb-2 lg:pb-0">
              <div className="hidden lg:block bg-gradient-to-r from-gray-900 via-primary-700 to-gray-700 rounded-md font-semibold text-xs lg:text-base h-[40px] p-2 pl-6">Select Category</div>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 lg:px-4 lg:py-3 rounded-xl font-semibold transition-all duration-300 shadow-sm border-2 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer group
                    ${selectedCategory === category
                      ? "bg-gradient-to-r from-gray-900 via-primary-700 to-gray-700 text-white border-primary-500 shadow-lg"
                      : "bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-700 hover:bg-gradient-to-r hover:from-cyan-100 hover:via-purple-100 hover:to-pink-100 hover:border-primary-400"}
                  `}
                  style={{ minWidth: '80px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-base font-bold group-hover:text-cyan-600 group-hover:dark:text-cyan-400 transition-colors">
                      {category}
                    </span>
                    {/* <span className="md:hidden ml-2 text-[10px] lg:text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 text-gray-700 dark:text-gray-900 font-semibold">
                      {skillsData[category]?.length || 0}
                    </span> */}
                  </div>
                  <div className="text-xs lg:text-sm opacity-75 mt-1 group-hover:text-pink-600 group-hover:dark:text-pink-400 transition-colors">
                    {skillsData[category]?.length || 0} skills
                  </div>
                </motion.button>
              ))}
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
                className="grid md:grid-cols-3 gap-6"
              >
                {skillsData[selectedCategory]?.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <Card className="h-full bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 dark:from-dark-800 dark:via-dark-900 dark:to-dark-950 border-2 border-transparent hover:border-primary-500/60 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                      <CardContent className="p-6 space-y-4">
                        {/* Skill Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-primary-400 dark:via-primary-500 dark:to-pink-400">
                            {skill.name}
                          </h3>
                          <Badge className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white shadow-md border-none">
                            {skill.level}%
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <Progress value={skill.level} className="h-2 bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200" />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-cyan-600 dark:text-cyan-400">Proficiency</span>
                            <span className="font-semibold text-pink-600 dark:text-pink-400">{skill.experience}</span>
                          </div>
                        </div>

                        {/* Projects Count */}
                        <div className="text-sm text-gray-700 dark:text-gray-200">
                          Used in{" "}
                          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-primary-400 dark:via-primary-500 dark:to-pink-400">
                            {skill.projects?.length || 0} projects
                          </span>
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

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold gradient-text mb-2">{selectedSkill.name}</h3>
                    <div className="text-4xl font-bold text-primary-500">{selectedSkill.level}%</div>
                    <div className="text-gray-600 dark:text-gray-300">{selectedSkill.experience} experience</div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Projects Used In:</h4>
                    <div className="space-y-2">
                      {selectedSkill.projects?.map((project: string) => (
                        <div key={project} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-300">{project}</span>
                        </div>
                      )) || <p className="text-gray-500 dark:text-gray-400">No projects listed</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}


export default SkillsSection