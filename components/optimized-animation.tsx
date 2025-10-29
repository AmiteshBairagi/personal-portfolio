"use client"

import type React from "react"

import { useRef, useEffect, useState, memo, JSX } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { fadeIn, animationConfig } from "@/lib/animation-utils"

interface OptimizedAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  variants?: any
  threshold?: number
  once?: boolean
  disabled?: boolean
  tag?: keyof JSX.IntrinsicElements
}

export default memo(function OptimizedAnimation({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  variants = fadeIn,
  threshold = 0.1,
  once = true,
  disabled = false,
  tag = "div",
}: OptimizedAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Skip animations if reduced motion is preferred or animations are disabled
  const shouldAnimate = !prefersReducedMotion && !disabled && animationConfig.shouldAnimate

  useEffect(() => {
    if (!shouldAnimate || !ref.current) {
      setIsInView(true)
      return
    }

    // Use IntersectionObserver for better performance than framer-motion's whileInView
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px 100px 0px", // Start animations slightly before they come into view
      },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldAnimate, threshold, once])

  // Apply hardware acceleration
  const hardwareAcceleration = {
    willChange: "transform",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
  }

  const MotionTag = motion[tag as keyof typeof motion]

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="hidden"
      variants={variants}
      style={hardwareAcceleration}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </MotionTag>
  )
})
