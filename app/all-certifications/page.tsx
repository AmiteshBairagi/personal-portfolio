"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Building, Calendar, Eye, X, Globe } from "lucide-react"
import useCertifications from "@/hooks/useCertifications"
import type { CertificationItem } from "@/lib/data/certificationService"
import { useDynamicModalPosition } from "@/hooks/use-dynamic-modal-position"

const AllCertificationsPage = () => {
  const router = useRouter()
  const { data: certificationsData, loading, error } = useCertifications()
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null)
  const { isReady } = useDynamicModalPosition(!!selectedCert)

  const closeModal = () => {
    setSelectedCert(null)
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (loading && certificationsData.length === 0) {
    return (
      <section className="min-h-screen bg-white dark:bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading certifications...</p>
        </div>
      </section>
    )
  }

  if (error && certificationsData.length === 0) {
    return (
      <section className="min-h-screen bg-white dark:bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500 mb-4">Error loading certifications: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-white dark:bg-dark-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              All <span className="gradient-text">Certifications</span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
              A complete list of certifications and achievements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary-500/10 text-primary-500 border border-primary-500/20">
              Total {certificationsData.length}
            </Badge>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.03 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedCert(cert)}
            >
              <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:border-primary-500/50">
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                  {cert.image && cert.image !== "/placeholder.svg?height=400&width=600" ? (
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-12 h-12 text-primary-500" />
                    </div>
                  )}

                  {cert.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary-500 text-white text-xs">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Building className="w-3 h-3" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3 h-3" />
                    <span>{cert.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2 py-0 bg-blue-500">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                    <Eye className="w-3 h-3" />
                    <span>Click to view details</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onPointerDown={closeModal}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: isReady ? 1 : 0,
                  scale: isReady ? 1 : 0.9,
                  y: isReady ? 0 : 20,
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  opacity: { duration: 0.2 },
                }}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={handleModalClick}
                style={{ minHeight: "400px", minWidth: "320px" }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    closeModal()
                  }}
                  aria-label="Close modal"
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/50 pointer-events-none" />
                  <div
                    className="absolute inset-0 opacity-10 bg-repeat pointer-events-none"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                  />

                  <div className="relative z-10 h-full px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left max-w-xl">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                        {selectedCert.title}
                      </h2>
                      <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-white/80">
                        <Building className="w-4 h-4" />
                        <span className="text-sm sm:text-base font-medium">{selectedCert.issuer}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <Badge className="bg-white/15 text-white border border-white/20">{selectedCert.date}</Badge>
                        <Badge className="bg-white/15 text-white border border-white/20">{selectedCert.level}</Badge>
                        {selectedCert.featured && (
                          <Badge className="bg-primary-500 text-white border-0">Featured</Badge>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-[300px] lg:w-[360px] h-36 sm:h-44 lg:h-48 rounded-2xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                      {selectedCert.image && selectedCert.image !== "/placeholder.svg?height=400&width=600" ? (
                        <img
                          src={selectedCert.image}
                          alt={selectedCert.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Award className="w-14 h-14 text-white/80" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center text-sm sm:text-base">
                            <Calendar className="w-4 h-4 mr-2" />
                            Certification Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{selectedCert.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Score:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {selectedCert.exam_score}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                            Credential ID
                          </h4>
                          <p className="text-xs sm:text-sm font-mono bg-white dark:bg-gray-700 p-2 rounded border text-gray-900 dark:text-white break-all">
                            {selectedCert.credential_id}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                            Skills Validated
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCert.skills.map((skill) => (
                              <Badge
                                key={skill}
                                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 px-2 py-1 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                        About This Certification
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        {selectedCert.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 text-sm sm:text-base"
                      >
                        <a href={selectedCert.verification_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          View Certificate
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={closeModal}
                        className="flex-1 border-gray-300 dark:border-gray-600 text-sm sm:text-base"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default AllCertificationsPage
