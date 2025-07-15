// "use client"

// import { useState, useEffect, useRef } from "react"

// interface PerformanceMonitorProps {
//   enabled?: boolean
// }

// export default function PerformanceMonitor({ enabled = false }: PerformanceMonitorProps) {
//   const [fps, setFps] = useState<number>(60)
//   const [memory, setMemory] = useState<number | null>(null)
//   const [layoutShifts, setLayoutShifts] = useState<number>(0)

//   const frameCountRef = useRef(0)
//   const lastTimeRef = useRef(performance.now())
//   const rafIdRef = useRef<number>()

//   useEffect(() => {
//     if (!enabled) return

//     // FPS counter
//     const measureFps = (timestamp: number) => {
//       frameCountRef.current++

//       const elapsed = timestamp - lastTimeRef.current

//       if (elapsed >= 1000) {
//         setFps(Math.round((frameCountRef.current * 1000) / elapsed))
//         frameCountRef.current = 0
//         lastTimeRef.current = timestamp

//         // Memory usage (if available)
//         if ("memory" in performance) {
//           setMemory((performance as any).memory.usedJSHeapSize / (1024 * 1024))
//         }
//       }

//       rafIdRef.current = requestAnimationFrame(measureFps)
//     }

//     rafIdRef.current = requestAnimationFrame(measureFps)

//     // Layout shift observer
//     if ("PerformanceObserver" in window) {
//       try {
//         const layoutShiftObserver = new PerformanceObserver((list) => {
//           for (const entry of list.getEntries()) {
//             if (entry.entryType === "layout-shift" && !(entry as any).hadRecentInput) {
//               setLayoutShifts((prev) => prev + (entry as any).value)
//             }
//           }
//         })

//         layoutShiftObserver.observe({ type: "layout-shift", buffered: true })

//         return () => {
//           layoutShiftObserver.disconnect()
//           if (rafIdRef.current) {
//             cancelAnimationFrame(rafIdRef.current)
//           }
//         }
//       } catch (e) {
//         console.error("PerformanceObserver error:", e)
//       }
//     }

//     return () => {
//       if (rafIdRef.current) {
//         cancelAnimationFrame(rafIdRef.current)
//       }
//     }
//   }, [enabled])

//   if (!enabled) return null

//   return (
//     <div className="fixed bottom-4 left-4 z-50 bg-black/70 text-white p-2 rounded-lg text-xs font-mono">
//       <div className={`${fps < 30 ? "text-red-400" : fps < 50 ? "text-yellow-400" : "text-green-400"}`}>FPS: {fps}</div>
//       {memory !== null && (
//         <div className={`${memory > 100 ? "text-red-400" : memory > 50 ? "text-yellow-400" : "text-green-400"}`}>
//           Memory: {memory.toFixed(1)} MB
//         </div>
//       )}
//       <div
//         className={`${layoutShifts > 0.1 ? "text-red-400" : layoutShifts > 0.05 ? "text-yellow-400" : "text-green-400"}`}
//       >
//         CLS: {layoutShifts.toFixed(3)}
//       </div>
//     </div>
//   )
// }
