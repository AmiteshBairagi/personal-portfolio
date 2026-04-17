"use client";

import { motion } from "framer-motion";
import { User, Code2, Rocket, Lightbulb, Coffee, Terminal } from "lucide-react";

export default function AboutMeSection() {
  const coreValues = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Clean Code",
      description: "Believes in writing code that machines can execute and humans can understand.",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovative Thinking",
      description: "Constantly exploring new patterns and technologies to solve complex problems.",
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Fast Learner",
      description: "Quick to adapt to new environments and master emerging industry standards.",
      color: "from-purple-500/20 to-pink-500/20",
    },
  ];

  const philosophy = [
    { label: "01", title: "Problem First", text: "I approach every project by first understanding the core problem, not just the technical requirements." },
    { label: "02", title: "User Centric", text: "Code is a tool to serve users. If the UX isn't intuitive, the tech doesn't matter." },
    { label: "03", title: "Continuous Iteration", text: "Software is never finished, only released. I value feedback and constant improvement." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-20 max-w-5xl mx-auto"
    >
      {/* Header Bio */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <User size={48} />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Hey, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Amitesh Bairagi</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                A full-stack developer based in India, dedicated to building digital experiences that are both functionally robust and visually delightful. I specialize in bridging the gap between complex backend logic and seamless frontend design.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Values Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {coreValues.map((value, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={`p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${value.color} backdrop-blur-sm group transition-all duration-300`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              {value.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {value.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tech Philosophy Section */}
      <motion.div variants={itemVariants} className="space-y-10">
        <div className="flex items-center gap-4">
          <Terminal className="text-cyan-500 w-8 h-8" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Tech Philosophy</h3>
          <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {philosophy.map((item, i) => (
            <div key={i} className="space-y-4">
              <span className="text-5xl font-black text-slate-200/70 dark:text-slate-800/50 block mb-2">{item.label}</span>
              <h4 className="text-xl font-bold text-cyan-500 dark:text-cyan-400">{item.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Now Section (Small Bento Style) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex items-start gap-6">
          <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500">
            <Coffee size={24} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-2 text-lg">Current Status</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sipping dark roast coffee while architecting high-performance distributed systems with Spring Boot and Next.js.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl flex items-start gap-6">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Rocket size={24} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-2 text-lg">Next Goal</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Deep-diving into Generative AI integration and mastering advanced system design patterns for massive scalability.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.p 
        variants={itemVariants} 
        className="text-center text-slate-500 text-sm italic py-10"
      >
        "I build because I am curious. I code because I am a creator."
      </motion.p>
    </motion.div>
  );
}
