// "use client"

// import type React from "react"

// import { useRef, useEffect, memo } from "react"
// import { animationConfig } from "@/lib/animation-utils"

// interface FloatingAnimationProps {
//   children: React.ReactNode
//   className?: string
//   amplitude?: number
//   frequency?: number
//   phase?: number
//   disabled?: boolean
// }

// export default memo(function OptimizedFloatingAnimation({
//   children,
//   className = "",
//   amplitude = 10,
//   frequency = 0.15,
//   phase = 0,
//   disabled = false,
// }: FloatingAnimationProps) {
//   const elementRef = useRef<HTMLDivElement>(null)
//   const animationRef = useRef<number>()
//   const startTimeRef = useRef<number>(Date.now())

//   useEffect(() => {
//     // Skip animation if reduced motion is preferred or animations are disabled
//     if (!animationConfig.shouldAnimate || disabled) return

//     const element = elementRef.current
//     if (!element) return

//     // Store original position
//     const originalTransform = window.getComputedStyle(element).transform
//     const isIdentityTransform = originalTransform === "none" || originalTransform === ""

//     let lastTimestamp = 0
//     const minFrameTime = 1000 / animationConfig.frameRate // e.g., 16.67ms for 60fps

//     const animate = (timestamp: number) => {
//       // Throttle to target frame rate
//       if (timestamp - lastTimestamp < minFrameTime) {
//         animationRef.current = requestAnimationFrame(animate)
//         return
//       }

//       lastTimestamp = timestamp

//       const elapsed = (Date.now() - startTimeRef.current) / 1000
//       const yOffset = amplitude * Math.sin(frequency * elapsed + phase)

//       // Use hardware-accelerated transform
//       if (isIdentityTransform) {
//         element.style.transform = `translate3D(0, ${yOffset}px, 0)`
//       } else {
//         element.style.transform = `${originalTransform} translate3D(0, ${yOffset}px, 0)`
//       }

//       animationRef.current = requestAnimationFrame(animate)
//     }

//     // Apply will-change for better performance
//     element.style.willChange = "transform"

//     // Start animation
//     animationRef.current = requestAnimationFrame(animate)

//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current)
//       }

//       // Reset styles
//       if (element) {
//         element.style.transform = originalTransform
//         element.style.willChange = "auto"
//       }
//     }
//   }, [amplitude, frequency, phase, disabled])

//   return (
//     <div ref={elementRef} className={className}>
//       {children}
//     </div>
//   )
// })
