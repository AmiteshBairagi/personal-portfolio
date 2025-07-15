// "use client"

// import { useEffect, useRef } from "react"

// interface PerformanceMetrics {
//   fps: number
//   memoryUsage?: number
//   renderTime: number
// }

// export function usePerformanceMonitor(enabled = false) {
//   const metricsRef = useRef<PerformanceMetrics>({ fps: 60, renderTime: 0 })
//   const frameCountRef = useRef(0)
//   const lastTimeRef = useRef(performance.now())
//   const animationFrameRef = useRef<number>()

//   useEffect(() => {
//     if (!enabled) return

//     const measurePerformance = () => {
//       const now = performance.now()
//       const delta = now - lastTimeRef.current

//       if (delta >= 1000) {
//         metricsRef.current.fps = Math.round((frameCountRef.current * 1000) / delta)
//         frameCountRef.current = 0
//         lastTimeRef.current = now

//         // Memory usage (if available)
//         if ("memory" in performance) {
//           metricsRef.current.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576 // MB
//         }

//         // Log performance issues
//         if (metricsRef.current.fps < 30) {
//           console.warn("Low FPS detected:", metricsRef.current.fps)
//         }
//       }

//       frameCountRef.current++
//       animationFrameRef.current = requestAnimationFrame(measurePerformance)
//     }

//     animationFrameRef.current = requestAnimationFrame(measurePerformance)

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current)
//       }
//     }
//   }, [enabled])

//   return metricsRef.current
// }
