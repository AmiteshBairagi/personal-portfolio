"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = ["All", "About Me", "Goals", "Hobbies", "Photography"];

export default function MoreAboutMe() {
  const [activeTab, setActiveTab] = useState("All");

  const renderContent = (tab: string) => {
    switch (tab) {
      case "About Me":
        return (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-cyan-400">About Me</h2>
            <p className="text-slate-300">
              I’m Amitesh Bairagi — a passionate software developer who loves blending logic and creativity. 
              My journey began with curiosity about how things work, evolving into a career in tech.
            </p>
          </div>
        );
      case "Goals":
        return (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-cyan-400">My Goals</h2>
            <p className="text-slate-300">
              To become a full-stack architect and build digital products that truly help people.
              I also want to mentor young developers and contribute to open-source.
            </p>
          </div>
        );
      case "Hobbies":
        return (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-cyan-400">My Hobbies</h2>
            <ul className="list-disc list-inside text-slate-300">
              <li>🎸 Playing Guitar</li>
              <li>📚 Reading tech & motivation books</li>
              <li>✈️ Exploring new destinations</li>
            </ul>
          </div>
        );
      case "Photography":
        return (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-cyan-400">My Photography</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <img src="/images/photo1.jpg" className="rounded-xl shadow-lg" alt="Nature" />
              <img src="/images/photo2.jpg" className="rounded-xl shadow-lg" alt="Travel" />
              <img src="/images/photo3.jpg" className="rounded-xl shadow-lg" alt="City" />
            </div>
          </div>
        );
      case "All":
      default:
        return (
          <div className="space-y-12">
            {tabs
              .filter((t) => t !== "All")
              .map((t) => (
                <div key={t}>{renderContent(t)}</div>
              ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6">
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
