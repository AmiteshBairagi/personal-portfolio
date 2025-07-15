// "use client"

// import type React from "react"

// import { useRef, useState, useEffect, memo } from "react"
// import { motion } from "framer-motion"

// interface OptimizedSectionProps {
//   children: React.ReactNode
//   className?: string
//   id?: string
//   threshold?: number
//   rootMargin?: string
//   animationDelay?: number
// }

// export default memo(function OptimizedSection({
//   children,
//   className = "",
//   id,
//   threshold = 0.1,
//   rootMargin = "0px",
//   animationDelay = 0,
// }: OptimizedSectionProps) {
//   const [isVisible, setIsVisible] = useState(false)
//   const sectionRef = useRef<HTMLElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true)
//           // Disconnect after first intersection for performance
//           observer.disconnect()
//         }
//       },
//       {
//         threshold,
//         rootMargin,
//       },
//     )

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current)
//     }

//     return () => observer.disconnect()
//   }, [threshold, rootMargin])

//   return (
//     <motion.section
//       ref={sectionRef}
//       id={id}
//       className={className}
//       initial={{ opacity: 0, y: 50 }}
//       animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//       transition={{ duration: 0.6, delay: animationDelay }}
//     >
//       {isVisible ? children : <div style={{ height: "100vh" }} />}
//     </motion.section>
//   )
// })
