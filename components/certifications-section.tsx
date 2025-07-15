"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Building, X, CheckCircle, Globe, Wifi, WifiOff } from "lucide-react"
import { useDynamicModalPosition } from "@/hooks/use-dynamic-modal-position"
import { useCertificationsRealTime } from "@/hooks/use-certifications-real-time"
import type { CertificationItem } from "@/lib/data/certifications-data-manager"

export default function CertificationsSection() {
  const { data: certificationsData, loading, error, isOnline, lastSyncTime } = useCertificationsRealTime()

  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null)
  const [showAll, setShowAll] = useState(false)

  const displayedCerts = showAll ? certificationsData : certificationsData.slice(0, 4)
  const { isReady } = useDynamicModalPosition(!!selectedCert)

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Professional":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "Associate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "Expert":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const getValidityStatus = (validUntil: string) => {
    if (validUntil === "Lifetime") return { status: "lifetime", color: "text-green-400" }

    const currentYear = new Date().getFullYear()
    const expiryYear = Number.parseInt(validUntil)

    if (expiryYear > currentYear + 1) return { status: "valid", color: "text-green-400" }
    if (expiryYear > currentYear) return { status: "expiring", color: "text-yellow-400" }
    return { status: "expired", color: "text-red-400" }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedCert(null)
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Loading state
  if (loading && certificationsData.length === 0) {
    return (
      <section id="certifications" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading certifications...</p>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error && certificationsData.length === 0) {
    return (
      <section id="certifications" className="py-20 bg-white dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading certifications: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              My <span className="gradient-text">Certifications</span>
            </h2>

            {/* Connection Status Indicator */}
            <div className="ml-4 flex items-center space-x-2">
              {isOnline ? (
                <div className="flex items-center text-green-500" title="Connected - Real-time updates enabled">
                  <Wifi className="w-4 h-4" />
                </div>
              ) : (
                <div className="flex items-center text-red-500" title="Offline - Using cached data">
                  <WifiOff className="w-4 h-4" />
                </div>
              )}
              {lastSyncTime && (
                <span
                  className="text-xs text-gray-500 dark:text-gray-400"
                  title={`Last synced: ${lastSyncTime.toLocaleString()}`}
                >
                  {isOnline ? "Live" : "Cached"}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional certifications that validate my expertise and commitment to continuous learning
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayedCerts.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => setSelectedCert(cert)}
            >
              <Card className="h-full bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:border-primary-500/50">
                {/* Certificate Image */}
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                  {cert.image && cert.image !== "/placeholder.svg?height=400&width=600" ? (
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className="w-12 h-12 text-primary-500" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {cert.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary-500 text-white text-xs">Featured</Badge>
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getLevelColor(cert.level)} text-white text-xs border-0`}>{cert.level}</Badge>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>

                  {/* Issuer */}
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Building className="w-3 h-3" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                    <Calendar className="w-3 h-3" />
                    <span>{cert.date}</span>
                  </div>

                  {/* Skills Preview */}
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2 py-0">
                        {skill}
                      </Badge>
                    ))}
                    {cert.skills.length > 2 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        +{cert.skills.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* See All Certifications Button */}
        {!showAll && certificationsData.length > 4 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center">
            <Button
              onClick={() => setShowAll(true)}
              size="lg"
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              See All Certifications ({certificationsData.length})
            </Button>
          </motion.div>
        )}

        {/* Enhanced Certification Modal */}
        <AnimatePresence>
          {selectedCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={handleBackdropClick}
              />

              {/* Modal Container */}
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
                style={{
                  minHeight: "400px",
                  minWidth: "320px",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header with Certificate Image */}
                <div className="relative h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-primary-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden flex-shrink-0">
                  {/* Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-10 bg-repeat"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                  />

                  {/* Certificate Visual */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedCert.image && selectedCert.image !== "/placeholder.svg?height=400&width=600" ? (
                      <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border border-white/30 shadow-2xl">
                        <img
                          src={selectedCert.image || "/placeholder.svg"}
                          alt={selectedCert.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                          <Award className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" />
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-bounce"></div>
                      </div>
                    )}
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${getLevelColor(selectedCert.level)} text-white border-0 px-2 py-1 sm:px-3 text-xs`}
                    >
                      {selectedCert.level} Level
                    </Badge>
                  </div>

                  {/* Validity Status */}
                  <div className="absolute top-4 right-16">
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 sm:px-3 rounded-full bg-black/20 backdrop-blur-sm ${getValidityStatus(selectedCert.valid_until).color}`}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {selectedCert.valid_until === "Lifetime"
                          ? "Lifetime Valid"
                          : `Valid until ${selectedCert.valid_until}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* Title and Issuer */}
                    <div className="text-center space-y-2">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {selectedCert.title}
                      </h2>
                      <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-base sm:text-lg font-medium">{selectedCert.issuer}</span>
                      </div>
                    </div>

                    {/* Certificate Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Left Column */}
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
                              <span className="text-gray-600 dark:text-gray-400">Valid Until:</span>
                              <span className={`font-medium ${getValidityStatus(selectedCert.valid_until).color}`}>
                                {selectedCert.valid_until}
                              </span>
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

                      {/* Right Column */}
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

                        {selectedCert.featured && (
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center space-x-2 mb-2">
                              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">
                                Featured Certification
                              </h4>
                            </div>
                            <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                              This certification is highlighted as one of my key professional achievements.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                        About This Certification
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                        {selectedCert.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        asChild
                        className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 text-sm sm:text-base"
                      >
                        <a href={selectedCert.verification_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 mr-2" />
                          Verify Certificate
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCert(null)}
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
