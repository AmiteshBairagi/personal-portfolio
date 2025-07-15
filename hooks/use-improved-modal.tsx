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

interface UseImprovedModalProps {
  isOpen: boolean
  triggerRef?: RefObject<HTMLElement>
  preferredPosition?: "center" | "below" | "above" | "left" | "right" | "auto"
  offset?: number
  minMargin?: number
  allowFullscreen?: boolean
}

interface ViewportInfo {
  width: number
  height: number
  scrollTop: number
  scrollLeft: number
}

export function useImprovedModal({
  isOpen,
  triggerRef,
  preferredPosition = "center",
  offset = 16,
  minMargin = 20,
  allowFullscreen = true,
}: UseImprovedModalProps) {
  const [position, setPosition] = useState<Position>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [actualPosition, setActualPosition] = useState<string>("center")
  const modalRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Get viewport information
  const getViewportInfo = useCallback((): ViewportInfo => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    }
  }, [])

  // Check if mobile
  const checkMobile = useCallback(() => {
    const viewport = getViewportInfo()
    setIsMobile(viewport.width < 768)
  }, [getViewportInfo])

  // Calculate optimal position
  const calculatePosition = useCallback(() => {
    if (!isOpen) return

    const viewport = getViewportInfo()

    // On mobile or fullscreen, use full viewport
    if (isMobile || isFullscreen) {
      setPosition({
        top: viewport.scrollTop + minMargin,
        left: viewport.scrollLeft + minMargin,
        right: minMargin,
        bottom: minMargin,
        width: `${viewport.width - minMargin * 2}px`,
        height: `${viewport.height - minMargin * 2}px`,
        maxWidth: "none",
        maxHeight: "none",
      })
      setActualPosition(isFullscreen ? "fullscreen" : "mobile")
      return
    }

    // Desktop positioning
    const modalWidth = Math.min(800, viewport.width - minMargin * 2)
    const modalHeight = Math.min(600, viewport.height - minMargin * 2)

    // Center positioning (default)
    const centerPosition = {
      top: viewport.scrollTop + Math.max(minMargin, (viewport.height - modalHeight) / 2),
      left: viewport.scrollLeft + Math.max(minMargin, (viewport.width - modalWidth) / 2),
      width: `${modalWidth}px`,
      height: `${modalHeight}px`,
      maxWidth: `${modalWidth}px`,
      maxHeight: `${modalHeight}px`,
    }

    // If no trigger or center preferred, use center
    if (!triggerRef?.current || preferredPosition === "center") {
      setPosition(centerPosition)
      setActualPosition("center")
      return
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()

    // Calculate available space in each direction
    const spaceAbove = triggerRect.top
    const spaceBelow = viewport.height - triggerRect.bottom
    const spaceLeft = triggerRect.left
    const spaceRight = viewport.width - triggerRect.right

    let bestPosition = preferredPosition
    let newPosition: Position = {}

    // Auto-determine best position if needed
    if (preferredPosition === "auto") {
      const positions = [
        { name: "below", space: spaceBelow, required: modalHeight + offset },
        { name: "above", space: spaceAbove, required: modalHeight + offset },
        { name: "right", space: spaceRight, required: modalWidth + offset },
        { name: "left", space: spaceLeft, required: modalWidth + offset },
      ]

      const viablePositions = positions.filter((p) => p.space >= p.required)
      bestPosition =
        viablePositions.length > 0 ? (viablePositions.sort((a, b) => b.space - a.space)[0].name as any) : "center"
    }

    // Calculate position based on best position
    switch (bestPosition) {
      case "below":
        if (spaceBelow >= modalHeight + offset) {
          const availableHeight = Math.min(modalHeight, spaceBelow - offset - minMargin)
          newPosition = {
            top: triggerRect.bottom + viewport.scrollTop + offset,
            left: Math.max(
              viewport.scrollLeft + minMargin,
              Math.min(
                triggerRect.left + viewport.scrollLeft + triggerRect.width / 2 - modalWidth / 2,
                viewport.scrollLeft + viewport.width - modalWidth - minMargin,
              ),
            ),
            width: `${modalWidth}px`,
            height: `${availableHeight}px`,
            maxWidth: `${modalWidth}px`,
            maxHeight: `${availableHeight}px`,
          }
          setActualPosition("below")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "above":
        if (spaceAbove >= modalHeight + offset) {
          const availableHeight = Math.min(modalHeight, spaceAbove - offset - minMargin)
          newPosition = {
            top: Math.max(
              viewport.scrollTop + minMargin,
              triggerRect.top + viewport.scrollTop - availableHeight - offset,
            ),
            left: Math.max(
              viewport.scrollLeft + minMargin,
              Math.min(
                triggerRect.left + viewport.scrollLeft + triggerRect.width / 2 - modalWidth / 2,
                viewport.scrollLeft + viewport.width - modalWidth - minMargin,
              ),
            ),
            width: `${modalWidth}px`,
            height: `${availableHeight}px`,
            maxWidth: `${modalWidth}px`,
            maxHeight: `${availableHeight}px`,
          }
          setActualPosition("above")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "right":
        if (spaceRight >= modalWidth + offset) {
          const availableWidth = Math.min(modalWidth, spaceRight - offset - minMargin)
          newPosition = {
            top: Math.max(
              viewport.scrollTop + minMargin,
              Math.min(
                triggerRect.top + viewport.scrollTop + triggerRect.height / 2 - modalHeight / 2,
                viewport.scrollTop + viewport.height - modalHeight - minMargin,
              ),
            ),
            left: triggerRect.right + viewport.scrollLeft + offset,
            width: `${availableWidth}px`,
            height: `${modalHeight}px`,
            maxWidth: `${availableWidth}px`,
            maxHeight: `${modalHeight}px`,
          }
          setActualPosition("right")
        } else {
          newPosition = centerPosition
          setActualPosition("center")
        }
        break

      case "left":
        if (spaceLeft >= modalWidth + offset) {
          const availableWidth = Math.min(modalWidth, spaceLeft - offset - minMargin)
          newPosition = {
            top: Math.max(
              viewport.scrollTop + minMargin,
              Math.min(
                triggerRect.top + viewport.scrollTop + triggerRect.height / 2 - modalHeight / 2,
                viewport.scrollTop + viewport.height - modalHeight - minMargin,
              ),
            ),
            left: Math.max(
              viewport.scrollLeft + minMargin,
              triggerRect.left + viewport.scrollLeft - availableWidth - offset,
            ),
            width: `${availableWidth}px`,
            height: `${modalHeight}px`,
            maxWidth: `${availableWidth}px`,
            maxHeight: `${modalHeight}px`,
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

    setPosition(newPosition)
  }, [isOpen, isFullscreen, isMobile, triggerRef, preferredPosition, offset, minMargin, getViewportInfo])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (allowFullscreen) {
      setIsFullscreen((prev) => !prev)
    }
  }, [allowFullscreen])

  // Set up event listeners
  useEffect(() => {
    if (!isOpen) return

    checkMobile()
    calculatePosition()

    let scrollTimeout: NodeJS.Timeout
    let resizeTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(calculatePosition, 16)
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        checkMobile()
        calculatePosition()
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      clearTimeout(resizeTimeout)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [isOpen, calculatePosition, checkMobile])

  return {
    position,
    isFullscreen,
    toggleFullscreen,
    calculatePosition,
    actualPosition,
    modalRef,
    isMobile,
  }
}
