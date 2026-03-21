"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Download,
  Send,
} from "lucide-react";
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const base_url = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.post(`${base_url}/api/add-lead`, formData);
      if (response.status === 200) {
        setFormData({
          name: "",
          email: "",
          message: "",
        });

        alert("Message Received Successfully");
      }

      alert("Message sent successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: "amitesh.bairagi29@gmail.com",
      href: "mailto:amitesh.bairagi29@gmail.com",
      color: "text-red-400",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "7063830696",
      href: "tel:7063830696",
      color: "text-green-400",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Kolkata,700028",
      color: "text-blue-400",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/AmiteshBairagi?tab=repositories",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/amitesh-bairagi/",
      color: "hover:text-blue-600",
    },
    {
      icon: SiLeetcode,
      label: "Leetcode",
      href: "https://leetcode.com/u/AmiteshBairagi/",
      color: "hover:text-blue-400",
    },
    {
      icon: SiGeeksforgeeks,
      label: "GFG",
      href: "https://www.geeksforgeeks.org/profile/amiteshbairagi?tab=activity",
      color: "hover:text-blue-400",
    },
    {
      icon: Globe,
      label: "Website",
      href: "amitesh.me",
      color: "hover:text-purple-500",
    },
  ];

  const resumeUrl = {
    label: "Resume",
    link: "https://drive.google.com/file/d/1Wcio_BmvUzE1uZTsj4IwEWwgyZJn3Z-m/view",
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Get in touch to discuss opportunities and collaborations.
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Get in touch to discuss opportunities and collaborations.
              </p>
            </div>

            {/* Contact Info Cards */}
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
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {info.label}
                              </div>
                              <div className="text-gray-600 dark:text-gray-300">
                                {info.value}
                              </div>
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
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {info.label}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              {info.value}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Follow Me
              </h4>
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

            {/* Resume Download */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href={resumeUrl.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full"
                        placeholder="Enter Your Name :"
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
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full"
                        placeholder="Give Your Email Address :"
                      />
                    </div>
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
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
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
  );
};

export default ContactSection;
