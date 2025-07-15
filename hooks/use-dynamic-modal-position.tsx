"use client"

import { useState, useEffect, useCallback } from "react"

export function useDynamicModalPosition(isOpen: boolean) {
  const [isReady, setIsReady] = useState(false)

  const updatePosition = useCallback(() => {
    if (!isOpen) return

    // Simple delay to ensure proper positioning
    setTimeout(() => {
      setIsReady(true)
    }, 50)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setIsReady(false)
      updatePosition()

      const handleResize = () => {
        updatePosition()
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    } else {
      setIsReady(false)
    }
  }, [isOpen, updatePosition])

  return { isReady }
}
