"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Download,
  Send,
} from "lucide-react"
import { useContactRealTime } from "@/hooks/use-contact-real-time"

const ContactSection = () => {
  const { contactData, loading, error} = useContactRealTime()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fallback data when no contact data exists
  const fallbackData = {
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    location: "Your City, Country",
    github_url: "https://github.com/username",
    linkedin_url: "https://linkedin.com/in/username",
    twitter_url: "https://twitter.com/username",
    website_url: "https://yourwebsite.com",
    resume_url: "/resume.pdf",
    bio: "Get in touch to discuss opportunities and collaborations.",
    availability_status: "available" as const,
  }

  const currentData = contactData || fallbackData

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      alert("Message sent successfully!")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: currentData.email,
      href: `mailto:${currentData.email}`,
      color: "text-red-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: currentData.phone || "Not provided",
      href: currentData.phone ? `tel:${currentData.phone}` : undefined,
      color: "text-green-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: currentData.location || "Not provided",
      color: "text-blue-400",
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: currentData.github_url,
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: currentData.linkedin_url,
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: currentData.twitter_url,
      color: "hover:text-blue-400",
    },
    {
      icon: Globe,
      label: "Website",
      href: currentData.website_url,
      color: "hover:text-purple-500",
    },
  ].filter((link) => link.href)



 

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {loading ? "Loading contact information..." : currentData.bio}
          </p>

          
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Let's Connect</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{loading ? "Loading..." : currentData.bio}</p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Info Cards */}
            {!loading && (
              <div className="space-y-4">
                {contactItems.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="block"
                  >
                    {info.href ? (
                      <a href={info.href}>
                        <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all duration-300 hover:border-primary-500/50">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                                <info.icon className="w-6 h-6 text-primary-500" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{info.label}</div>
                                <div className="text-gray-600 dark:text-gray-300">{info.value}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ) : (
                      <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
                              <info.icon className="w-6 h-6 text-primary-500" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">{info.label}</div>
                              <div className="text-gray-600 dark:text-gray-300">{info.value}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Social Links */}
            {!loading && socialLinks.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`w-12 h-12 bg-white dark:bg-dark-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 ${social.color} transition-colors shadow-md hover:shadow-lg`}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Download */}
            {!loading && currentData.resume_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a href={currentData.resume_url} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Message</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="w-full"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="w-full"
                      placeholder="Project Discussion"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={5}
                      className="w-full"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection