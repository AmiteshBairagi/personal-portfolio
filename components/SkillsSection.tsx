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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex flex-row lg:flex-col gap-1 lg:gap-2 lg:space-y-2 lg:space-x-0 sticky top-24 pb-2 lg:pb-0">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-1 lg:w-full text-left p-2 lg:p-4 rounded-lg transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary-500 text-white shadow-lg"
                      : "bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                  }`}
                >
                  <div className="font-semibold text-xs lg:text-base">{category}</div>
                  <div className="text-xs lg:text-sm opacity-75">{skillsData[category]?.length || 0} skills</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6"
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
                    <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-300 hover:border-primary-500/50">
                      <CardContent className="p-6 space-y-4">
                        {/* Skill Header */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                          <Badge className="bg-primary-500/10 text-primary-600 dark:text-primary-400">
                            {skill.level}%
                          </Badge>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <Progress value={skill.level} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Proficiency</span>
                            <span>{skill.experience}</span>
                          </div>
                        </div>

                        {/* Projects Count */}
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Used in{" "}
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
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