"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";

const photos = [
  {
    id: 1,
    src: "/my-photography/morning-bird.jpg",
    alt: "Sunset over mountains",
    caption: "Golden hour vibes 🌄",
  },
  {
    id: 2,
    src: "/my-photography/sunset-aesthetic.jpg",
    alt: "Forest trail",
    caption: "Lost in nature 🍃",
  },
  {
    id: 3,
    src: "/my-photography/rainfall.jpg",
    alt: "City at night",
    caption: "Lights never sleep 🌃",
  },
  {
    id: 4,
    src: "/my-photography/rail-track.jpg",
    alt: "Waves at the beach",
    caption: "Peaceful chaos 🌊",
  },
  {
    id: 5,
    src: "/my-photography/zac-durant-_6HzPU9Hyfg-unsplash.jpg",
    alt: "Bird in flight",
    caption: "Freedom in motion 🕊️",
  },
  {
    id: 6,
    src: "/my-photography/sajad-nori-VT0qb7y9Cfk-unsplash.jpg",
    alt: "Snowy mountain peak",
    caption: "Cold yet calm ❄️",
  },
  {
    id: 7,
    src: "/my-photography/teodor-drobota-uyyRJA2an4o-unsplash.jpg",
    alt: "Street art wall",
    caption: "Colors of creativity 🎨",
  },
  {
    id: 8,
    src: "/my-photography/zen-sumer-lk3F07BN8T8-unsplash.jpg",
    alt: "Street art wall",
    caption: "Colors of creativity 🎨",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } as const },
};

export default function MyPhotography() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
        >
          My Photography
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          Capturing fleeting moments and distinct perspectives. A visual diary of the world through my lens.
        </motion.p>
      </div>

      {/* Masonry layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            className="break-inside-avoid relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg shadow-black/20"
          >
            {/* Image Wrapper for Ken Burns Effect */}
            <div className="overflow-hidden bg-slate-800">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>
            
            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              
              {/* Top-right Interaction Icon */}
              <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
                <Maximize2 className="w-5 h-5 text-cyan-400" />
              </div>

              {/* Caption Content sliding up */}
              <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <div className="w-8 h-1 bg-cyan-500 mb-3 rounded-full"></div>
                <p className="text-lg font-semibold text-white drop-shadow-md">
                  {photo.caption}
                </p>
                <p className="text-sm text-cyan-300 mt-1 drop-shadow-sm opacity-80">
                  View Full Image
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="text-center text-slate-500 mt-12 text-sm italic"
      >
        "Photography is the story I fail to put into words."
      </motion.p>
    </section>
  );
}
