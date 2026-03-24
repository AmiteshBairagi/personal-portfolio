"use client";

import { motion } from "framer-motion";
import { hobbiesData } from "./hobbiesData";
import { Heart } from "lucide-react";

export default function MyHobbies() {
  const bentoClasses = [
    "md:col-span-2 md:row-span-2 bg-gradient-to-br from-violet-600/90 to-indigo-700/90", // 0: Photography (Big)
    "md:col-span-1 md:row-span-1 bg-gradient-to-br from-pink-500/90 to-rose-600/90",     // 1: Guitar
    "md:col-span-1 md:row-span-1 bg-gradient-to-br from-amber-500/90 to-orange-600/90",   // 2: Traveling
    "md:col-span-1 md:row-span-1 bg-gradient-to-br from-emerald-500/90 to-teal-600/90",   // 3: Gaming
    "md:col-span-1 md:row-span-1 bg-gradient-to-br from-cyan-600/90 to-blue-700/90",      // 4: Tech Blogs
    "md:col-span-1 md:row-span-1 bg-gradient-to-br from-fuchsia-600/90 to-purple-700/90"  // 5: Fitness
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 90 } as const },
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-500 mb-4 inline-flex items-center gap-3 justify-center w-full"
        >
          My Hobbies <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          Beyond the code, this is how I like to unwind, express creativity, and keep myself moving.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 auto-rows-[240px] gap-6"
      >
        {hobbiesData.map((hobby, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`group relative rounded-3xl p-8 overflow-hidden border border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-end ${bentoClasses[i]}`}
          >
            {/* Dynamic Glassmorphism Background Pattern */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating Icon */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              className={`absolute top-6 right-6 text-6xl drop-shadow-2xl ${i === 0 ? 'text-8xl top-10 right-10' : ''}`}
            >
              {hobby.icon}
            </motion.div>

            <div className="relative z-10">
              <h3 className={`font-bold text-white mb-2 drop-shadow-md ${i === 0 ? 'text-4xl mb-4' : 'text-2xl'}`}>
                {hobby.title}
              </h3>
              <p className={`text-white/80 font-medium leading-relaxed drop-shadow-sm ${i === 0 ? 'text-lg max-w-md' : 'text-sm'}`}>
                {hobby.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
