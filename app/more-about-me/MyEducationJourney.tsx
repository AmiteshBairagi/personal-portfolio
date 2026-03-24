"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Briefcase } from "lucide-react";

const educationData = [
  {
    id: 1,
    title: "Bachelor of Technology in Computer Science",
    institution: "Your University Name",
    duration: "2019 - 2023",
    description:
      "Graduated with distinction. Specialized in Software Engineering and Artificial Intelligence. Led the university technical club and organized multiple hackathons.",
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "AWS Certified Solutions Architect",
    institution: "Amazon Web Services",
    duration: "2023",
    description:
      "Demonstrated advanced technical skills and experience in designing distributed applications and systems on the AWS platform.",
    icon: <Award className="w-6 h-6 text-white" />,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 3,
    title: "Full Stack Web Development Bootcamp",
    institution: "Tech Academy",
    duration: "2021",
    description:
      "Intensive 6-month bootcamp covering the MERN stack (MongoDB, Express, React, Node.js), system design, and agile methodologies.",
    icon: <BookOpen className="w-6 h-6 text-white" />,
    color: "from-green-400 to-emerald-600",
  },
  {
    id: 4,
    title: "High School (Science & Mathematics)",
    institution: "Your High School",
    duration: "2017 - 2019",
    description:
      "Completed with 95% aggregate. Vice Captain of the school coding team and winner of the State Level Science Exhibition.",
    icon: <Briefcase className="w-6 h-6 text-white" />,
    color: "from-purple-500 to-pink-500",
  },
];

export default function MyEducationJourney() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 relative">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
        >
          My Educational Journey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400"
        >
          A timeline of my academic background and major certifications.
        </motion.p>
      </div>

      <div className="relative">
        {/* Central glowing line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-[1px] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>

        <div className="space-y-12">
          {educationData.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 ml-10 md:ml-0`}
              >
                {/* Node */}
                <div
                  className={`absolute left-[-40px] md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full p-1 bg-slate-900 border-2 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 hidden md:flex`}
                >
                  <div
                    className={`w-full h-full rounded-full shadow-lg flex items-center justify-center bg-gradient-to-br ${item.color}`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Mobile Icon (absolute positioned over the line for mobile) */}
                <div className="absolute left-[-34px] w-10 h-10 rounded-full md:hidden flex items-center justify-center bg-gradient-to-br z-10 shadow-lg border-2 border-slate-900 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`}></div>
                  <div className="relative z-10 scale-75">{item.icon}</div>
                </div>

                {/* Content Card container */}
                <div
                  className={`w-full md:w-1/2 ${
                    isEven ? "md:pr-12 text-left md:text-right" : "md:pl-12 text-left"
                  }`}
                >
                  <div className="group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:-translate-y-1 hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden">
                    {/* Abstract background flare */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl group-hover:from-cyan-400/20 transition-all duration-500"></div>

                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 bg-slate-900/60 border border-slate-700 text-cyan-400 text-xs font-semibold rounded-full mb-4 shadow-inner">
                        {item.duration}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <h4 className="text-md font-medium text-slate-400 mb-3 flex items-center gap-2 md:justify-end">
                        <span className="md:hidden inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
                        {item.institution}
                        <span className="hidden md:inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
