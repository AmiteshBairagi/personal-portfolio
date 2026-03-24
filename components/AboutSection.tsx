"use client"

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

const AboutSection = () => {
  const router = useRouter()

  const images = [
    { src: "/navbar_pic.jpeg", alt: "Profile Photo" },
    { src: "/new-hero-image.jpg", alt: "Hero Photo" },
    { src: "/snu-image.jpg", alt: "SNU Image" },
    { src: "/my-photography/morning-bird.jpg", alt: "Nature Photography" },
    { src: "/my-photography/rail-track.jpg", alt: "Rail Track Photography" },
    { src: "/my-photography/rainfall.jpg", alt: "Rainfall Photography" },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any,
      },
    },
  }

  return (
    <section id="about" className="relative py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-end mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => router.push("/more-about-me")}
              className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-500/25 border border-white/10 hover:shadow-cyan-500/40 hover:-translate-y-1 active:scale-95"
            >
              <span className="text-sm sm:text-base tracking-wide">More About Me</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Big Screen Grid (2 rows, 3 columns) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden md:grid grid-cols-3 gap-6"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                rotateZ: index % 2 === 0 ? 1 : -1,
                transition: { duration: 0.2 } 
              }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.alt}
                </p>
              </div>
              <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="md:hidden -mx-4 px-4 flex overflow-x-auto gap-4 scrollbar-hide snap-x no-scrollbar pb-6"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-none w-[280px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl snap-center"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-4">
                 <p className="text-white text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Mobile Swipe Indicator */}
        <div className="md:hidden flex justify-center mt-2">
           <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: [-24, 24, -24] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as any }}
                className="w-1/2 h-full bg-cyan-500 rounded-full"
              />
           </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection

