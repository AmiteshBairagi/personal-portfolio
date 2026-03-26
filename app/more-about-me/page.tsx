"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ThemeProvider } from "@/contexts/theme-context";
import Navbar from "@/components/Navbar";
import MyPhotograpy from "./MyPhotograpy";
import MyHobbies from "./MyHobbies";
import MyGoals from "./MyGoals";
import MyEducationJourney from "./MyEducationJourney";
import Friends from "./Friends"
import AboutMeSection from "./AboutMeSection";

const tabs = ["About Me", "Goals", "Hobbies", "Photography", "Education Journey", "Friends"];

export default function MoreAboutMe() {
  const [activeTab, setActiveTab] = useState("About Me");

  const renderContent = (tab: string) => {
    switch (tab) {
      case "About Me":
        return (
          <AboutMeSection />
        );
      case "Goals":
        return (
          <MyGoals/>
        );
      case "Hobbies":
        return (
          <MyHobbies/>
        );
      case "Photography":
        return (
          <MyPhotograpy/>
        );
      case "Education Journey":
        return(
          <MyEducationJourney/>
        );
      case "Friends":
        return (
          <Friends/>
        );
      default:
        return (
          <div className="space-y-12">
            Select a tab
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-900 text-white pb-12 px-6 relative">
        <Navbar />
        <div className="pt-28 md:pt-24"></div>

      {/* Tabs - Horizontally Scrollable */}
      <div className="relative mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap
                ${
                  activeTab === tab
                    ? "bg-cyan-500 text-white border-cyan-500"
                    : "border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Scroll Arrow Hint - Mobile Only */}
        <motion.div
          className="absolute right-6 top-1/2 transform -translate-y-1/2 md:hidden"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {renderContent(activeTab)}
        </motion.div>
      </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
