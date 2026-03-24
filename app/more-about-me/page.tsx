"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-6 relative md:pt-16">
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 p-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200 backdrop-blur-sm group"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 
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
  );
}
