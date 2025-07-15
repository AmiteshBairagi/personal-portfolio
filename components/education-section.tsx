"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award } from "lucide-react"
import Image from "next/image"
import { useEducationData } from "@/hooks/use-education-data"

export default function EducationSection() {
  const { data: educationData, loading, error } = useEducationData()

  if (loading) {
    return (
      <section id="education" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="education" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-500 dark:text-red-400">Failed to load education data</p>
          </div>
        </div>
      </section>
    )
  }

  if (!educationData || educationData.length === 0) {
    return (
      <section id="education" className="py-20 bg-gray-50 dark:bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400">No education data available</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="education" className="py-20 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My <span className="gradient-text">Education</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My academic journey and the foundations that shaped my technical expertise
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationData.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:border-primary-500/50">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={edu.image || "/placeholder.svg?height=300&width=400"}
                    alt={edu.institution}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Badge */}
                  {edu.type && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary-500 text-white">{edu.type}</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  {/* Degree */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {edu.degree}
                  </h3>

                  {/* Institution */}
                  <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-400">{edu.institution}</h4>

                  {/* Duration and Grade */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.duration}
                    </div>
                    {edu.grade && (
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {edu.grade}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
