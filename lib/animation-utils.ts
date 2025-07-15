"use client"

import type { Variants } from "framer-motion"

// Performance-optimized variants with hardware acceleration
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

// Optimized animation settings
export const animationConfig = {
  // Use passive listeners for better scroll performance
  usePassiveEvents: true,

  // Reduce motion based on user preference
  respectReduceMotion: true,

  // Optimize for 60fps
  frameRate: 60,

  // Throttle animations during scroll
  scrollThrottle: 16, // ~60fps

  // Disable animations for users who prefer reduced motion
  shouldAnimate: typeof window !== "undefined" ? !window.matchMedia("(prefers-reduced-motion: reduce)").matches : true,
}

// Optimized scroll-triggered animation hook
export function useOptimizedAnimation() {
  return {
    initial: "hidden",
    whileInView: animationConfig.shouldAnimate ? "visible" : "hidden",
    viewport: {
      once: true,
      margin: "-100px 0px",
      amount: 0.2,
    },
  }
}

// Hardware-accelerated transform helper
export function getHardwareAcceleratedStyle() {
  return {
    willChange: "transform",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
  }
}
