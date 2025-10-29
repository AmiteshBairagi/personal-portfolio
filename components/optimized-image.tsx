"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

// export default function OptimizedImage({
//   src,
//   alt,
//   width,
//   height,
//   className = "",
//   priority = false,
//   fill = false,
//   sizes,
//   placeholder = "empty",
//   blurDataURL,
// }: OptimizedImageProps) {
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [isInView, setIsInView] = useState(false)
//   const imgRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true)
//           observer.disconnect()
//         }
//       },
//       {
//         threshold: 0.1,
//         rootMargin: "50px",
//       },
//     )

//     if (imgRef.current) {
//       observer.observe(imgRef.current)
//     }

//     return () => observer.disconnect()
//   }, [])

//   const shouldLoad = priority || isInView

//   return (
//     <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
//       {/* Skeleton loader */}
//       {!isLoaded && (
//         <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
//       )}

//       {shouldLoad && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: isLoaded ? 1 : 0 }}
//           transition={{ duration: 0.3 }}
//           className="relative w-full h-full"
//         >
//           <Image
//             src={src || "/placeholder.svg"}
//             alt={alt}
//             width={width}
//             height={height}
//             fill={fill}
//             sizes={sizes}
//             priority={priority}
//             placeholder={placeholder}
//             blurDataURL={blurDataURL}
//             className="object-cover"
//             onLoad={() => setIsLoaded(true)}
//             quality={85}
//           />
//         </motion.div>
//       )}
//     </div>
//   )
// }
