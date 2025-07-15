"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface ScrollState {
  scrollY: number
  scrollDirection: "up" | "down" | null
  isScrolling: boolean
}

export function useSmoothScroll() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: typeof window !== "undefined" ? window.scrollY : 0,
    scrollDirection: null,
    isScrolling: false,
  })

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0)
  const ticking = useRef(false)
  const scrollTimeout = useRef<number>()
  const rafId = useRef<number>()

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY

    // Only update state if scroll position has changed significantly (by at least 5px)
    // This reduces unnecessary state updates
    if (Math.abs(currentScrollY - lastScrollY.current) >= 5) {
      const direction = currentScrollY > lastScrollY.current ? "down" : "up"

      setScrollState({
        scrollY: currentScrollY,
        scrollDirection: direction,
        isScrolling: true,
      })

      lastScrollY.current = currentScrollY
    }

    ticking.current = false

    // Clear existing timeout
    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current)
    }

    // Set isScrolling to false after scrolling stops
    scrollTimeout.current = window.setTimeout(() => {
      setScrollState((prev) => ({ ...prev, isScrolling: false }))
    }, 100)
  }, [])

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      // Use requestAnimationFrame for better performance
      rafId.current = requestAnimationFrame(() => {
        updateScrollState()
      })
      ticking.current = true
    }
  }, [updateScrollState])

  useEffect(() => {
    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)

      if (scrollTimeout.current) {
        window.clearTimeout(scrollTimeout.current)
      }

      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [handleScroll])

  return scrollState
}
