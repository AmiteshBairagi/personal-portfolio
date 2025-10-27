"use client";
import Image from "next/image";

export default function UpdatedHero() {
  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen bg-[#f8f8f8] text-[#111] overflow-hidden">
      {/* Navbar */}
      <header className="absolute top-0 w-full flex justify-between items-center px-12 py-6 text-sm font-medium">
        <div className="flex gap-8">
          <a href="#">About Me</a>
          <a href="#">Portfolio</a>
          <a href="#">Services</a>
          <a href="#">Blog</a>
        </div>
        <a
          href="#"
          className="border border-black px-4 py-2 rounded-full hover:bg-black hover:text-white transition"
        >
          Book A Call ↗
        </a>
      </header>

      {/* Left side content */}
      <section className="relative z-10 flex flex-col items-start text-left px-12 max-w-4xl w-full mt-20">
        <div className="mb-8 space-x-10 text-gray-600 text-sm">
          <span className="inline-block">
            <span className="text-black font-semibold text-xl">+200</span>{" "}
            <br /> Project completed
          </span>
          <span className="inline-block">
            <span className="text-black font-semibold text-xl">+50</span> <br /> Startup raised
          </span>
        </div>

        <h1 className="text-[120px] font-light leading-none tracking-tight mb-4">
          Hello
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          — It’s <span className="text-black font-medium">Amitesh</span>, a creative developer
        </p>

        <p className="text-sm text-gray-500">Scroll down ↓</p>
      </section>

      {/* Floating image */}
      <div className="absolute right-0 bottom-0 md:right-20 md:bottom-0">
        <div className="relative">
          <Image
            src="/new-hero-image-removebg-preview.png"
            alt="Amitesh portrait"
            width={350}
            height={350}
            className="object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* Vertical labels */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 rotate-[-90deg] text-xs tracking-widest text-gray-500">
        Product designer
      </div>
      <div className="absolute bottom-6 left-10 text-xs text-gray-500">2024</div>
    </main>
  );
}
