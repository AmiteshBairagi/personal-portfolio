"use client";
import Image from "next/image";

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

export default function MyPhotography() {
  return (
    <section className="min-h-screen bg-slate-900 text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-cyan-400">
        My Photography
      </h2>

      {/* Masonry layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative overflow-hidden rounded-xl group"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={400}
              className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center rounded-xl">
              <p className="text-sm text-slate-100 p-3 text-center">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-slate-400 mt-8 text-sm">
        Click on any image to explore the full story behind the shot 📷
      </p>
    </section>
  );
}
