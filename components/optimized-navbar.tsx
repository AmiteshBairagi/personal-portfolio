"use client"

import { useState, memo, useMemo } from "react"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Code } from "lucide-react"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

// Memoize the nav items to prevent unnecessary re-renders
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

// Memoized nav item component
const NavItem = memo(({ item, onClick }: { item: (typeof navItems)[0]; onClick?: () => void }) => (
  <Link key={item.name} href={item.href} onClick={onClick}>
    <div className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
      {item.name}
    </div>
  </Link>
))

NavItem.displayName = "NavItem"

export default memo(function OptimizedNavbar() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY, scrollDirection } = useSmoothScroll()

  // Compute these values only when dependencies change
  const isScrolled = scrollY > 20
  const shouldHide = scrollDirection === "down" && scrollY > 100 && !isMobileMenuOpen

  // Memoize the navbar classes to prevent unnecessary style recalculations
  const navbarClasses = useMemo(() => {
    return `fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isScrolled ? "bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
    }${shouldHide ? "-translate-y-full" : "translate-y-0"}`
  }, [isScrolled, shouldHide])

  // Memoize the theme icon to prevent unnecessary re-renders
  const themeIcon = useMemo(() => {
    return theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
  }, [theme])

  return (
    <nav className={navbarClasses} style={{ willChange: "transform" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">DevPortfolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 hover:bg-gray-100 dark:hover:bg-dark-800"
            >
              {themeIcon}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Using CSS transitions instead of Framer Motion for better performance */}
      <div
        className={`md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-dark-700 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} onClick={() => setIsMobileMenuOpen(false)} />
          ))}
        </div>
      </div>
    </nav>
  )
})
