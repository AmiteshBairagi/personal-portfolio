"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Code, ArrowDown } from "lucide-react"

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Certifications", href: "#certifications" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
  { name: "Stats", href: "/stats" },
]

const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 relative">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-center items-start relative">
              <span className="text-xl font-bold gradient-text">DevPortfolio</span>
              {/* Amitesh rainbow name, absolutely positioned, tiny font, no navbar height increase */}
              <span
                className="absolute left-1 top-full mt-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap"
                style={{ lineHeight: '1', height: '10px' }}
              >
                <span style={{ color: '#FF0000' }}>𝒜</span>
                <span style={{ color: '#FF7F00' }}>𝓂</span>
                <span style={{ color: '#FFFF00' }}>𝒾</span>
                <span style={{ color: '#00FF00' }}>𝓉</span>
                <span style={{ color: '#0000FF' }}>𝑒</span>
                <span style={{ color: '#4B0082' }}>𝓈</span>
                <span style={{ color: '#9400D3' }}>𝒽</span>
                <span style={{ color: '#FF0000' }}> </span>
                <span style={{ color: '#FF7F00' }}>𝐵</span>
                <span style={{ color: '#FFFF00' }}>𝒶</span>
                <span style={{ color: '#00FF00' }}>𝒾</span>
                <span style={{ color: '#0000FF' }}>𝓇</span>
                <span style={{ color: '#4B0082' }}>𝒶</span>
                <span style={{ color: '#9400D3' }}>𝑔</span>
                <span style={{ color: '#FF0000' }}>𝒾</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              className="w-7 h-7 bg-gradient-to-r from-gray-900 via-primary-700 to-gray-700 hover:bg-gradient-to-r hover:from-gray-900 hover:via-primary-700 hover:to-gray-700 hover:scale-[1.02] hover:shadow-lg"            >
              cv
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-dark-700 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <div className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}


export default Navbar