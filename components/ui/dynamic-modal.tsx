"use client"

import type React from "react"
import { forwardRef, useEffect, useCallback, type RefObject } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { useDynamicPositioning } from "@/hooks/use-dynamic-positioning"
import { cn } from "@/lib/utils"

interface DynamicModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  triggerRef?: RefObject<HTMLElement>
  preferredPosition?: "center" | "below" | "above" | "left" | "right" | "auto"
  className?: string
  headerActions?: React.ReactNode
  footerActions?: React.ReactNode
  allowFullscreen?: boolean
  preventOverlap?: boolean
  modalDimensions?: { width: number; height: number }
  onPositionChange?: (position: string) => void
}

export const DynamicModal = forwardRef<HTMLDivElement, DynamicModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      triggerRef,
      preferredPosition = "auto",
      className,
      headerActions,
      footerActions,
      allowFullscreen = true,
      preventOverlap = true,
      modalDimensions,
      onPositionChange,
    },
    ref,
  ) => {
    const { position, isFullscreen, toggleFullscreen, actualPosition, modalRef, zIndex } = useDynamicPositioning({
      isOpen,
      triggerRef,
      preferredPosition,
      preventOverlap,
      modalDimensions,
    })

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (!isOpen) return

        switch (event.key) {
          case "Escape":
            event.preventDefault()
            onClose()
            break
          case "F11":
            if (allowFullscreen) {
              event.preventDefault()
              toggleFullscreen()
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
      [isOpen, onClose, allowFullscreen, toggleFullscreen],
    )

    // Set up keyboard event listeners and focus management
    useEffect(() => {
      if (!isOpen) return

      document.addEventListener("keydown", handleKeyDown)

      // Focus first focusable element
      const modal = modalRef.current
      if (modal) {
        const firstFocusable = modal.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) as HTMLElement
        firstFocusable?.focus()
      }

      // Prevent body scroll
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = originalOverflow
      }
    }, [isOpen, handleKeyDown])

    // Notify position changes
    useEffect(() => {
      if (onPositionChange) {
        onPositionChange(actualPosition)
      }
    }, [actualPosition, onPositionChange])

    if (!isOpen) return null

    const positionStyles: React.CSSProperties = {
      position: "absolute",
      zIndex,
      ...position,
    }

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
          style={{ zIndex: zIndex - 1 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          ref={(node) => {
            modalRef.current = node
            if (typeof ref === "function") {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className={cn(
            "absolute bg-slate-800 border border-slate-600 shadow-2xl rounded-lg overflow-hidden flex flex-col",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900",
            className,
          )}
          style={positionStyles}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-content"
          tabIndex={-1}
        >
          {/* Header - Fixed */}
          <DialogHeader className="flex flex-row items-center justify-between p-4 sm:p-6 border-b border-slate-600 bg-slate-800/95 backdrop-blur-sm shrink-0">
            <DialogTitle id="modal-title" className="text-lg sm:text-xl text-white truncate pr-4">
              {title}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {headerActions}
              {allowFullscreen && (
                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  title={isFullscreen ? "Exit fullscreen (F11)" : "Enter fullscreen (F11)"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              )}
              <Button
                onClick={onClose}
                size="sm"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                aria-label="Close modal"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-hidden" id="modal-content">
            <ScrollArea className="h-full">
              <div className="p-4 sm:p-6">{children}</div>
            </ScrollArea>
          </div>

          {/* Footer - Fixed */}
          {footerActions && (
            <div className="flex justify-end space-x-3 p-4 sm:p-6 border-t border-slate-600 bg-slate-800/95 backdrop-blur-sm shrink-0">
              {footerActions}
            </div>
          )}

          {/* Position indicator for debugging */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded">
              {actualPosition}
            </div>
          )}
        </div>
      </>
    )
  },
)

DynamicModal.displayName = "DynamicModal"
