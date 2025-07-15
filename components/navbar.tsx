// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useTheme } from "@/contexts/theme-context"
// import { Button } from "@/components/ui/button"
// import { Moon, Sun, Menu, X, Code, User, GraduationCap, Briefcase, Award, MessageCircle, BarChart3 } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// const navItems = [
//   { name: "Home", href: "#home", icon: User },
//   { name: "About", href: "#about", icon: User },
//   { name: "Education", href: "#education", icon: GraduationCap },
//   { name: "Projects", href: "#projects", icon: Briefcase },
//   { name: "Skills", href: "#skills", icon: Code },
//   { name: "Certifications", href: "#certifications", icon: Award },
//   { name: "Contact", href: "#contact", icon: MessageCircle },
//   { name: "Stats", href: "/stats", icon: BarChart3 },
// ]

// export default function Navbar() {
//   const { theme, toggleTheme } = useTheme()
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20)
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled ? "bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
//               <Code className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-xl font-bold gradient-text">DevPortfolio</span>
//           </motion.div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="flex items-center space-x-1">
//               {navItems.map((item) => (
//                 <Link key={item.name} href={item.href}>
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
//                   >
//                     {item.name}
//                   </motion.div>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Theme Toggle and Mobile Menu Button */}
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={toggleTheme}
//               className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-dark-800"
//             >
//               <motion.div
//                 initial={false}
//                 animate={{ rotate: theme === "dark" ? 0 : 180 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//               </motion.div>
//             </Button>

//             {/* Mobile menu button */}
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden w-9 h-9"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-dark-700"
//           >
//             <div className="px-4 py-2 space-y-1">
//               {navItems.map((item) => (
//                 <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
//                   <motion.div
//                     whileHover={{ x: 10 }}
//                     className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
//                   >
//                     <item.icon className="w-4 h-4" />
//                     <span>{item.name}</span>
//                   </motion.div>
//                 </Link>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   )
// }
