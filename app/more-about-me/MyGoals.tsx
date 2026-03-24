"use client";

import { motion } from "framer-motion";
import { goalsData } from "./goalsData";
import { Target } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80 } as const },
};

export default function GoalsMasonry() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4 inline-flex items-center gap-3 justify-center w-full"
        >
          My Missions & Goals <Target className="w-8 h-8 text-emerald-400" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          Continuous learning and building are at the core of my journey. Here’s what I’m actively striving to achieve.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {goalsData.map((goal, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="group relative h-full"
          >
            {/* Animated Gradient Background Glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-md group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            
            {/* Main Card */}
            <div className="relative h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
              
              {/* Top abstract circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-500 group-hover:bg-emerald-500/20"></div>

              {/* Header section */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {goal.icon}
                </div>
                <div className="text-emerald-500/40 group-hover:text-emerald-400 transition-colors duration-300">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                {goal.title}
              </h3>
              
              <div className="h-px w-12 bg-emerald-500/50 mb-4 group-hover:w-24 transition-all duration-500"></div>

              <p className="text-slate-300 leading-relaxed font-light">
                {goal.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
