// "use client"

// import React, { useEffect, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { X, Maximize2, Minimize2 } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface SimpleModalProps {
//   isOpen: boolean
//   onClose: () => void
//   title: string
//   children: React.ReactNode
//   className?: string
//   headerActions?: React.ReactNode
//   footerActions?: React.ReactNode
//   size?: "sm" | "md" | "lg" | "xl" | "full"
// }

// const sizeClasses = {
//   sm: "max-w-md",
//   md: "max-w-2xl",
//   lg: "max-w-4xl",
//   xl: "max-w-6xl",
//   full: "max-w-[95vw]",
// }

// export function SimpleModal({
//   isOpen,
//   onClose,
//   title,
//   children,
//   className,
//   headerActions,
//   footerActions,
//   size = "lg",
// }: SimpleModalProps) {
//   const [isFullscreen, setIsFullscreen] = React.useState(false)

//   // Handle keyboard events
//   const handleKeyDown = useCallback(
//     (event: KeyboardEvent) => {
//       if (!isOpen) return

//       if (event.key === "Escape") {
//         event.preventDefault()
//         onClose()
//       }
//     },
//     [isOpen, onClose],
//   )

//   // Set up keyboard event listeners
//   useEffect(() => {
//     if (!isOpen) return

//     document.addEventListener("keydown", handleKeyDown)

//     // Prevent body scroll
//     const originalOverflow = document.body.style.overflow
//     document.body.style.overflow = "hidden"

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown)
//       document.body.style.overflow = originalOverflow
//     }
//   }, [isOpen, handleKeyDown])

//   if (!isOpen) return null

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-200"
//         onClick={(e) => {
//           e.preventDefault()
//           e.stopPropagation()
//           onClose()
//         }}
//         aria-hidden="true"
//       />

//       {/* Modal Container - Always centered */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none overflow-hidden">
//         <div
//           className={cn(
//             "relative bg-slate-800 border border-slate-600 shadow-2xl rounded-lg overflow-hidden flex flex-col pointer-events-auto",
//             "w-full transition-all duration-200 ease-out",
//             "focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900",
//             isFullscreen ? "h-full max-w-none" : `max-h-[90vh] ${sizeClasses[size]}`,
//             className,
//           )}
//           onClick={(e) => e.stopPropagation()}
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="modal-title"
//           tabIndex={-1}
//         >
//           {/* Header - Fixed */}
//           <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-600 bg-slate-800 shrink-0">
//             <h2 id="modal-title" className="text-lg sm:text-xl text-white font-semibold truncate pr-4">
//               {title}
//             </h2>
//             <div className="flex items-center space-x-2 shrink-0">
//               {headerActions}
//               <Button
//                 onClick={toggleFullscreen}
//                 size="sm"
//                 variant="outline"
//                 className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
//                 aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//               >
//                 {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
//               </Button>
//               <Button
//                 onClick={onClose}
//                 size="sm"
//                 variant="outline"
//                 className="border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
//                 aria-label="Close modal"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Content - Scrollable */}
//           <div className="flex-1 overflow-hidden">
//             <div className="h-full overflow-y-auto overflow-x-hidden">
//               <div className="p-4 sm:p-6">{children}</div>
//             </div>
//           </div>

//           {/* Footer - Fixed */}
//           {footerActions && (
//             <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t border-slate-600 bg-slate-800 shrink-0">
//               {footerActions}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }
