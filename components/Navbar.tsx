"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/theme-context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Code, ArrowDown } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Certifications", href: "#certifications" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "#contact" },
  { name: "Stats", href: "/stats" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-[2px] translate-y-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-dark-900">
                <Image
                  src="/navbar_pic.jpeg"
                  alt="Amitesh portrait"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full scale-[1.15] object-[center_20%]"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-start relative">
              <span className="text-xl font-bold gradient-text">
                DevPortfolio
              </span>
              {/* Amitesh rainbow name, absolutely positioned, tiny font, no navbar height increase */}
              <span
                className="absolute left-1 top-full mt-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap"
                style={{ lineHeight: "1", height: "10px" }}
              >
                <span style={{ color: "#FF0000" }}>𝒜</span>
                <span style={{ color: "#FF7F00" }}>𝓂</span>
                <span style={{ color: "#1b797d" }}>𝒾</span>
                <span style={{ color: "#00FF00" }}>𝓉</span>
                <span style={{ color: "#0000FF" }}>𝑒</span>
                <span style={{ color: "#8a61a8" }}>𝓈</span>
                <span style={{ color: "#9400D3" }}>𝒽</span>
                <span style={{ color: "#FF0000" }}> </span>
                <span style={{ color: "#FF7F00" }}>𝐵</span>
                <span style={{ color: "#5e5e05" }}>𝒶</span>
                <span style={{ color: "#00FF00" }}>𝒾</span>
                <span style={{ color: "#0000FF" }}>𝓇</span>
                <span style={{ color: "#593b6f" }}>𝒶</span>
                <span style={{ color: "#9400D3" }}>𝑔</span>
                <span style={{ color: "#FF0000" }}>𝒾</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0.5">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="relative px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800/60 transition-all duration-300 group">
                  {item.name}
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary-400 to-accent-400 rounded-full group-hover:w-3/4 transition-all duration-300" />
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
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-9 h-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
            <Link
              href="https://drive.google.com/file/d/1Wcio_BmvUzE1uZTsj4IwEWwgyZJn3Z-m/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto block"
            >
              <Button
                variant="ghost"
                className="h-8 px-3 rounded-full bg-cyan-50 text-slate-900 border border-cyan-200 hover:bg-cyan-100 hover:shadow-md dark:bg-gradient-to-r dark:from-gray-900 dark:via-primary-700 dark:to-gray-700 dark:text-white dark:border-transparent dark:hover:from-gray-900 dark:hover:via-primary-700 dark:hover:to-gray-700 hover:scale-[1.02]"
              >
                CV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-dark-700 overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-primary-500/10 hover:pl-5 transition-all duration-300">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
