"use client"

import React, { useEffect, useCallback, type RefObject } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEnhancedModal } from "@/hooks/use-enhanced-modal"
import { cn } from "@/lib/utils"

interface EnhancedModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  centered?: boolean
  triggerRef?: RefObject<HTMLElement>
  className?: string
  headerActions?: React.ReactNode
  footerActions?: React.ReactNode
  allowFullscreen?: boolean
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
}

export function EnhancedModal({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  centered = true,
  triggerRef,
  className,
  headerActions,
  footerActions,
  allowFullscreen = false,
  showCloseButton = true,
  closeOnBackdropClick = false,
  closeOnEscape = true,
}: EnhancedModalProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  const { position, isAnimating, modalRef } = useEnhancedModal({
    isOpen,
    size: isFullscreen ? "full" : size,
    centered,
    triggerRef,
  })

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case "Escape":
          if (closeOnEscape) {
            event.preventDefault()
            onClose()
          }
          break
        case "F11":
          if (allowFullscreen) {
            event.preventDefault()
            setIsFullscreen((prev) => !prev)
          }
          break
        case "Tab":
          // Trap focus within modal
          const modal = modalRef.current
          if (!modal) return

          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault()
              lastElement?.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault()
              firstElement?.focus()
            }
          }
          break
      }
    },
    [isOpen, onClose, closeOnEscape, allowFullscreen],
  )

  // Set up event listeners
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener("keydown", handleKeyDown)

    // Prevent body scroll - more robust approach
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const originalPosition = document.body.style.position

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Apply scroll lock
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.position = "relative"

    // Also prevent scrolling on html element
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)

      // Restore original styles
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      document.body.style.position = originalPosition
      document.documentElement.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  // Handle backdrop click - disable closing on backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    // Remove the backdrop click closing functionality
    // Modal can only be closed via Cancel button or X button
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // Add after the existing useEffect for event listeners
  useEffect(() => {
    if (!isOpen) return

    // Prevent scroll on touch devices
    const preventScroll = (e: TouchEvent) => {
      // Allow scrolling within the modal
      const target = e.target as Element
      const modal = modalRef.current
      if (modal && modal.contains(target)) {
        return
      }
      e.preventDefault()
    }

    const preventWheel = (e: WheelEvent) => {
      // Allow scrolling within the modal
      const target = e.target as Element
      const modal = modalRef.current
      if (modal && modal.contains(target)) {
        return
      }
      e.preventDefault()
    }

    // Add passive: false to ensure preventDefault works
    document.addEventListener("touchmove", preventScroll, { passive: false })
    document.addEventListener("wheel", preventWheel, { passive: false })

    return () => {
      document.removeEventListener("touchmove", preventScroll)
      document.removeEventListener("wheel", preventWheel)
    }
  }, [isOpen])

  if (!mounted) return null

  // Calculate proper heights
  const headerHeight = 80 // Header height with padding
  const footerHeight = footerActions ? 88 : 0 // Footer height with padding
  const contentHeight = position.height - headerHeight - footerHeight

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className={cn(
              "fixed z-50 bg-slate-800 border border-slate-600/50 shadow-2xl rounded-xl overflow-hidden",
              "backdrop-blur-md bg-slate-800/95 flex flex-col",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
              className,
            )}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              height: position.height,
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-600/50 bg-slate-800/80 backdrop-blur-sm flex-shrink-0">
              <h2 id="modal-title" className="text-xl font-semibold text-white truncate pr-4">
                {title}
              </h2>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {headerActions}
                {allowFullscreen && (
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                )}
                {showCloseButton && (
                  <Button
                    onClick={onClose}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6" style={{ minHeight: contentHeight > 0 ? `${contentHeight - 48}px` : "auto" }}>
                  {children}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            {footerActions && (
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-600/50 bg-slate-800/80 backdrop-blur-sm flex-shrink-0">
                {footerActions}
              </div>
            )}

            {/* Resize indicator */}
            <div className="absolute bottom-2 right-2 w-4 h-4 opacity-30 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-3 h-0.5 bg-slate-500 transform rotate-45"></div>
              <div className="absolute bottom-1 right-0 w-2 h-0.5 bg-slate-500 transform rotate-45"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
