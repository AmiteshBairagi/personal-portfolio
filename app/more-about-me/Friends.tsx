"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Friends() {
  const friendGroups = [
    {
      title: "Childhood Friends",
      friends: [
        { name: "Rohit", img: "/friends/rohit.jpg", role: "Partner in Crime" },
        { name: "Karan", img: "/friends/karan.jpg", role: "Neighborhood Ninja" },
        { name: "Saurabh", img: "/friends/saurabh.jpg", role: "Gaming Buddy" },
      ],
    },
    {
      title: "School Friends",
      friends: [
        { name: "Ankit", img: "/friends/ankit.jpg", role: "Benchmate" },
        { name: "Pooja", img: "/friends/pooja.jpg", role: "Notes Savior" },
        { name: "Ritika", img: "/friends/ritika.jpg", role: "Gossip Queen" },
      ],
    },
    {
      title: "College Friends",
      friends: [
        { name: "Vivek", img: "/friends/vivek.jpg", role: "Project Carrier" },
        { name: "Sneha", img: "/friends/sneha.jpg", role: "Canteen Buddy" },
        { name: "Rahul", img: "/friends/rahul.jpg", role: "Late Night Coder" },
      ],
    },
  ];

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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } as const },
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4 inline-flex items-center gap-3"
        >
          My Friends <Sparkles className="w-8 h-8 text-cyan-400" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          The amazing people who have been part of my journey through different phases of life.
        </motion.p>
      </div>

      <div className="space-y-20">
        {friendGroups.map((group, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-wide">
                {group.title}
              </h3>
              <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent flex-1"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.friends.map((friend, j) => (
                <motion.div
                  key={j}
                  variants={cardVariants}
                  className="group relative"
                >
                  {/* Glowing background boundary */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                  
                  {/* Card Content */}
                  <div className="relative bg-white dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
                    
                    {/* Avatar Wrap */}
                    <div className="relative w-32 h-32 mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 animate-spin-slow" style={{ padding: "3px" }}>
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full"></div>
                      </div>
                      
                      <div className="absolute inset-[3px] rounded-full overflow-hidden">
                        <Image
                          src={friend.img}
                          alt={friend.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                      {friend.name}
                    </h4>
                    <p className="text-sm font-medium text-cyan-600 dark:text-cyan-500/80 bg-cyan-500/10 px-3 py-1 rounded-full">
                      {friend.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
