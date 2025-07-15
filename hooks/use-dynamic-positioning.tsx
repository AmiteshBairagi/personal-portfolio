"use client"

import { useState, useEffect, useCallback, useRef, type RefObject } from "react"

interface Position {
  top?: number
  left?: number
  right?: number
  bottom?: number
  transform?: string
  maxWidth?: string
  maxHeight?: string
  width?: string
  height?: string
}

interface Dimensions {
  width: number
  height: number
}

interface UseDynamicPositioningProps {
  isOpen: boolean
  triggerRef?: RefObject<HTMLElement>
  preferredPosition?: "center" | "below" | "above" | "left" | "right" | "auto"
  offset?: number
  minMargin?: number
  modalDimensions?: Dimensions
  preventOverlap?: boolean
  zIndex?: number
}

interface ViewportInfo {
  width: number
  height: number
  scrollTop: number
  scrollLeft: number
}

export function useDynamicPositioning({
  isOpen,
  triggerRef,
  preferredPosition = "auto",
  offset = 12,
  minMargin = 20,
  modalDimensions,
  preventOverlap = true,
  zIndex = 50,
}: UseDynamicPositioningProps) {
  const [position, setPosition] = useState<Position>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actualPosition, setActualPosition] = useState<string>("center")
  const modalRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Get viewport information
  const getViewportInfo = useCallback((): ViewportInfo => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    }
  }, [])

  // Get modal dimensions
  const getModalDimensions = useCallback((): Dimensions => {
    if (modalDimensions) return modalDimensions

    const viewport = getViewportInfo()

    // Default responsive dimensions
    let width: number
    let height: number

    if (viewport.width < 640) {
      // Mobile
      width = Math.min(viewport.width - minMargin * 2, 380)
      height = Math.min(viewport.height - minMargin * 2, 600)
    } else if (viewport.width < 1024) {
      // Tablet
      width = Math.min(viewport.width - minMargin * 2, 600)
      height = Math.min(viewport.height - minMargin * 2, 700)
    } else {
      // Desktop
      width = Math.min(viewport.width - minMargin * 2, 800)
      height = Math.min(viewport.height - minMargin * 2, 800)
    }

    return { width, height }
  }, [modalDimensions, minMargin, getViewportInfo])

  // Check for overlapping elements
  const checkForOverlaps = useCallback(
    (rect: DOMRect): boolean => {
      if (!preventOverlap) return false

      // Check for navigation bars, headers, and other fixed elements
      const fixedElements = document.querySelectorAll('[data-fixed], .fixed, [style*="position: fixed"]')

      for (const element of fixedElements) {
        const elementRect = element.getBoundingClientRect()

        // Check if rectangles overlap
        if (
          !(
            rect.right < elementRect.left ||
            rect.left > elementRect.right ||
            rect.bottom < elementRect.top ||
            rect.top > elementRect.bottom
          )
        ) {
          return true
        }
      }

      return false
    },
    [preventOverlap],
  )

  // Calculate optimal position
  const calculatePosition = useCallback(() => {
    if (!isOpen) return

    const viewport = getViewportInfo()
    const modalDims = getModalDimensions()

    // Fullscreen mode
    if (isFullscreen) {
      setPosition({
        top: viewport.scrollTop + minMargin,
        left: viewport.scrollLeft + minMargin,
        right: minMargin,
        bottom: minMargin,
        maxWidth: "none",
        maxHeight: "none",
        width: `${viewport.width - minMargin * 2}px`,
        height: `${viewport.height - minMargin * 2}px`,
      })
      setActualPosition("fullscreen")
      return
    }

    // Center positioning (fallback)
    const centerPosition = {
      top: viewport.scrollTop + Math.max(minMargin, (viewport.height - modalDims.height) / 2),
      left: viewport.scrollLeft + Math.max(minMargin, (viewport.width - modalDims.width) / 2),
      width: `${modalDims.width}px`,
      height: `${modalDims.height}px`,
      maxWidth: `${modalDims.width}px`,
      maxHeight: `${modalDims.height}px`,
    }

    // If no trigger or center preferred, use center
    if (!triggerRef?.current || preferredPosition === "center") {
      setPosition(centerPosition)
      setActualPosition("center")
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()

    // Convert to document coordinates
    const triggerTop = triggerRect.top + viewport.scrollTop
    const triggerBottom = triggerRect.bottom + viewport.scrollTop
    const triggerLeft = triggerRect.left + viewport.scrollLeft
    const triggerRight = triggerRect.right + viewport.scrollLeft
    const triggerCenterX = triggerLeft + triggerRect.width / 2
    const triggerCenterY = triggerTop + triggerRect.height / 2

    // Calculate available space in each direction
    const spaceAbove = triggerRect.top
    const spaceBelow = viewport.height - triggerRect.bottom
    const spaceLeft = triggerRect.left
    const spaceRight = viewport.width - triggerRect.right

    // Determine best position
    let bestPosition = preferredPosition
    let newPosition: Position = {}

    if (preferredPosition === "auto") {
      // Auto-determine best position based on available space
      const positions = [
        { name: "below", space: spaceBelow, required: modalDims.height + offset },
        { name: "above", space: spaceAbove, required: modalDims.height + offset },
        { name: "right", space: spaceRight, required: modalDims.width + offset },
        { name: "left", space: spaceLeft, required: modalDims.width + offset },
      ]

      const viablePositions = positions.filter((p) => p.space >= p.required)
      bestPosition =
        viablePositions.length > 0 ? (viablePositions.sort((a, b) => b.space - a.space)[0].name as any) : "center"
    }

    switch (bestPosition) {
      case "below":
        if (spaceBelow >= modalDims.height + offset) {
          newPosition = {
            top: triggerBottom + offset,
            left: Math.max(
              viewport.scrollLeft + minMargin,
              Math.min(
                triggerCenterX - modalDims.width / 2,
                viewport.scrollLeft + viewport.width - modalDims.width - minMargin,
              ),
            ),
            width: `${modalDims.width}px`,
            height: `${Math.min(modalDims.height, spaceBelow - offset - minMargin)}px`,
          }
          setActualPosition("below")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "above":
        if (spaceAbove >= modalDims.height + offset) {
          newPosition = {
            top: Math.max(viewport.scrollTop + minMargin, triggerTop - modalDims.height - offset),
            left: Math.max(
              viewport.scrollLeft + minMargin,
              Math.min(
                triggerCenterX - modalDims.width / 2,
                viewport.scrollLeft + viewport.width - modalDims.width - minMargin,
              ),
            ),
            width: `${modalDims.width}px`,
            height: `${Math.min(modalDims.height, spaceAbove - offset - minMargin)}px`,
          }
          setActualPosition("above")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "right":
        if (spaceRight >= modalDims.width + offset) {
          newPosition = {
            top: Math.max(
              viewport.scrollTop + minMargin,
              Math.min(
                triggerCenterY - modalDims.height / 2,
                viewport.scrollTop + viewport.height - modalDims.height - minMargin,
              ),
            ),
            left: triggerRight + offset,
            width: `${Math.min(modalDims.width, spaceRight - offset - minMargin)}px`,
            height: `${modalDims.height}px`,
          }
          setActualPosition("right")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "left":
        if (spaceLeft >= modalDims.width + offset) {
          newPosition = {
            top: Math.max(
              viewport.scrollTop + minMargin,
              Math.min(
                triggerCenterY - modalDims.height / 2,
                viewport.scrollTop + viewport.height - modalDims.height - minMargin,
              ),
            ),
            left: Math.max(viewport.scrollLeft + minMargin, triggerLeft - modalDims.width - offset),
            width: `${Math.min(modalDims.width, spaceLeft - offset - minMargin)}px`,
            height: `${modalDims.height}px`,
          }
          setActualPosition("left")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      default:
        newPosition = centerPosition
        setActualPosition("center")
    }

    // Check for overlaps and adjust if necessary
    if (preventOverlap && newPosition.top !== undefined && newPosition.left !== undefined) {
      const testRect = new DOMRect(newPosition.left, newPosition.top, modalDims.width, modalDims.height)

      if (checkForOverlaps(testRect)) {
        // If overlap detected, use center position
        newPosition = centerPosition
        setActualPosition("center")
      }
    }

    setPosition(newPosition)
  }, [
    isOpen,
    isFullscreen,
    triggerRef,
    preferredPosition,
    offset,
    minMargin,
    getViewportInfo,
    getModalDimensions,
    checkForOverlaps,
  ])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Set up event listeners and observers
  useEffect(() => {
    if (!isOpen) return

    calculatePosition()

    // Throttled scroll and resize handlers
    let scrollTimeout: NodeJS.Timeout
    let resizeTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(calculatePosition, 16) // ~60fps
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculatePosition, 100)
    }

    // Set up resize observer for modal content changes
    if (modalRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        calculatePosition()
      })
      resizeObserverRef.current.observe(modalRef.current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      clearTimeout(resizeTimeout)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [isOpen, calculatePosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return {
    position,
    isFullscreen,
    toggleFullscreen,
    calculatePosition,
    actualPosition,
    modalRef,
    zIndex,
  }
}
