// "use client"

// import type React from "react"

// import { useState, useRef, useMemo, memo } from "react"

// interface VirtualizedListProps<T> {
//   items: T[]
//   itemHeight: number
//   containerHeight: number
//   renderItem: (item: T, index: number) => React.ReactNode
//   overscan?: number
//   className?: string
// }

// function VirtualizedList<T>({
//   items,
//   itemHeight,
//   containerHeight,
//   renderItem,
//   overscan = 5,
//   className = "",
// }: VirtualizedListProps<T>) {
//   const [scrollTop, setScrollTop] = useState(0)
//   const scrollElementRef = useRef<HTMLDivElement>(null)

//   const { startIndex, endIndex, visibleItems } = useMemo(() => {
//     const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
//     const end = Math.min(items.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan)

//     return {
//       startIndex: start,
//       endIndex: end,
//       visibleItems: items.slice(start, end + 1),
//     }
//   }, [scrollTop, itemHeight, containerHeight, items, overscan])

//   const totalHeight = items.length * itemHeight
//   const offsetY = startIndex * itemHeight

//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     setScrollTop(e.currentTarget.scrollTop)
//   }

//   return (
//     <div
//       ref={scrollElementRef}
//       className={`overflow-auto ${className}`}
//       style={{ height: containerHeight }}
//       onScroll={handleScroll}
//     >
//       <div style={{ height: totalHeight, position: "relative" }}>
//         <div style={{ transform: `translateY(${offsetY}px)` }}>
//           {visibleItems.map((item, index) => (
//             <div key={startIndex + index} style={{ height: itemHeight }}>
//               {renderItem(item, startIndex + index)}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default memo(VirtualizedList) as typeof VirtualizedList
