"use client"

import { useState, useEffect, useCallback, useRef, type RefObject } from "react"

interface ModalPosition {
  top: number
  left: number
  width: number
  height: number
  transform?: string
}

interface UseEnhancedModalProps {
  isOpen: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
  centered?: boolean
  triggerRef?: RefObject<HTMLElement>
}

interface ViewportDimensions {
  width: number
  height: number
  scrollTop: number
  scrollLeft: number
}

export function useEnhancedModal({ isOpen, size = "lg", centered = true, triggerRef }: UseEnhancedModalProps) {
  const [position, setPosition] = useState<ModalPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Get viewport dimensions
  const getViewportDimensions = useCallback((): ViewportDimensions => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollTop: window.pageYOffset || document.documentElement.scrollTop,
      scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    }
  }, [])

  // Get modal dimensions based on size
  const getModalDimensions = useCallback(
    (viewport: ViewportDimensions) => {
      const padding = 40 // Minimum padding from viewport edges
      const maxWidth = viewport.width - padding * 2
      const maxHeight = viewport.height - padding * 2

      const sizeMap = {
        sm: { width: Math.min(400, maxWidth), height: Math.min(350, maxHeight) },
        md: { width: Math.min(600, maxWidth), height: Math.min(500, maxHeight) },
        lg: { width: Math.min(800, maxWidth), height: Math.min(650, maxHeight) },
        xl: { width: Math.min(1000, maxWidth), height: Math.min(750, maxHeight) },
        full: { width: maxWidth, height: maxHeight },
      }

      return sizeMap[size]
    },
    [size],
  )

  // Calculate optimal position
  const calculatePosition = useCallback(() => {
    if (!isOpen) return;

    const viewport = getViewportDimensions();
    const modalDims = getModalDimensions(viewport);

    let newPosition: ModalPosition;

    // Clamp function to keep modal within viewport
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

    if (centered || !triggerRef?.current) {
      // Center the modal, but if modal is taller than viewport, stick to top: 40px
      let top;
      if (modalDims.height + 80 > viewport.height) {
        top = 40;
      } else {
        top = (viewport.height - modalDims.height) / 2;
      }
      let left = (viewport.width - modalDims.width) / 2;
      // Clamp left so modal never goes out of viewport horizontally
      left = clamp(left, 20, viewport.width - modalDims.width - 20);
      newPosition = {
        top,
        left,
        width: modalDims.width,
        height: modalDims.height,
      };
    } else {
      // Position relative to trigger element
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const triggerTop = triggerRect.top + viewport.scrollTop;
      const triggerLeft = triggerRect.left + viewport.scrollLeft;

      // Try to position below the trigger, but adjust if it goes off-screen
      let top = triggerTop + triggerRect.height + 10;
      let left = triggerLeft;

      // Adjust if modal goes off the right edge
      if (left + modalDims.width > viewport.scrollLeft + viewport.width - 20) {
        left = viewport.scrollLeft + viewport.width - modalDims.width - 20;
      }

      // Adjust if modal goes off the left edge
      if (left < viewport.scrollLeft + 20) {
        left = viewport.scrollLeft + 20;
      }

      // Adjust if modal goes off the bottom edge
      if (top + modalDims.height > viewport.scrollTop + viewport.height - 20) {
        top = triggerTop - modalDims.height - 10;
      }

      // If still off-screen, center it
      if (top < viewport.scrollTop + 20) {
        top = (viewport.height - modalDims.height) / 2;
        left = (viewport.width - modalDims.width) / 2;
        // Clamp again
        top = clamp(top, 20, viewport.height - modalDims.height - 20);
        left = clamp(left, 20, viewport.width - modalDims.width - 20);
      }

      newPosition = {
        top,
        left,
        width: modalDims.width,
        height: modalDims.height,
      };
    }

    setPosition(newPosition);
  }, [isOpen, centered, triggerRef, getViewportDimensions, getModalDimensions]);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      calculatePosition()

      // Focus management
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) as HTMLElement
          firstFocusable?.focus()
        }
        setIsAnimating(false)
      }, 150)

      return () => clearTimeout(timer)
    } else {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen, calculatePosition])

  // Handle window resize and scroll
  useEffect(() => {
    if (!isOpen) return

    let resizeTimeout: NodeJS.Timeout
    let scrollTimeout: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculatePosition, 100)
    }

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(calculatePosition, 16)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearTimeout(resizeTimeout)
      clearTimeout(scrollTimeout)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isOpen, calculatePosition])

  return {
    position,
    isAnimating,
    modalRef,
    calculatePosition,
  }
}
