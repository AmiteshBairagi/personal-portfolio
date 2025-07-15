// "use client"

// import { useState, useEffect, useCallback, useRef } from "react"

// interface ScrollState {
//   scrollY: number
//   scrollDirection: "up" | "down" | null
//   isScrolling: boolean
// }

// export function useOptimizedScroll(throttleMs = 16) {
//   const [scrollState, setScrollState] = useState<ScrollState>({
//     scrollY: 0,
//     scrollDirection: null,
//     isScrolling: false,
//   })

//   const lastScrollY = useRef(0)
//   const ticking = useRef(false)
//   const scrollTimeout = useRef<NodeJS.Timeout>()

//   const updateScrollState = useCallback(() => {
//     const scrollY = window.scrollY
//     const direction = scrollY > lastScrollY.current ? "down" : scrollY < lastScrollY.current ? "up" : null

//     setScrollState({
//       scrollY,
//       scrollDirection: direction,
//       isScrolling: true,
//     })

//     lastScrollY.current = scrollY
//     ticking.current = false

//     // Clear existing timeout
//     if (scrollTimeout.current) {
//       clearTimeout(scrollTimeout.current)
//     }

//     // Set isScrolling to false after scrolling stops
//     scrollTimeout.current = setTimeout(() => {
//       setScrollState((prev) => ({ ...prev, isScrolling: false }))
//     }, 150)
//   }, [])

//   const handleScroll = useCallback(() => {
//     if (!ticking.current) {
//       requestAnimationFrame(updateScrollState)
//       ticking.current = true
//     }
//   }, [updateScrollState])

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll, { passive: true })
//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//       if (scrollTimeout.current) {
//         clearTimeout(scrollTimeout.current)
//       }
//     }
//   }, [handleScroll])

//   return scrollState
// }
