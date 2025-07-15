// "use client"

// import { useState, useEffect } from "react"
// import { certificationsDataService, type Certification } from "@/lib/data/certifications-data"

// export function useCertificationsData() {
//   const [data, setData] = useState<Certification[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const refetch = async () => {
//     try {
//       setLoading(true)
//       const freshData = await certificationsDataService.getData()
//       setData(freshData || [])
//       setError(null)
//     } catch (err) {
//       setError("Failed to load certifications data")
//       console.error("Error fetching certifications data:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     // Initial data load
//     refetch()

//     // Subscribe to data changes
//     const unsubscribe = certificationsDataService.subscribe(() => {
//       refetch()
//     })

//     return () => {
//       unsubscribe()
//     }
//   }, [])

//   const addCertification = async (cert: Omit<Certification, "id">) => {
//     try {
//       const result = await certificationsDataService.addItem({
//         ...cert,
//         id: Date.now().toString(),
//       } as Certification)

//       if (result.success) {
//         await refetch()
//         return { success: true }
//       } else {
//         setError(result.error || "Failed to add certification")
//         return { success: false, error: result.error }
//       }
//     } catch (err) {
//       const errorMsg = "Failed to add certification"
//       setError(errorMsg)
//       console.error("Error adding certification:", err)
//       return { success: false, error: errorMsg }
//     }
//   }

//   const updateCertification = async (id: string, updates: Partial<Certification>) => {
//     try {
//       const result = await certificationsDataService.updateItem(id, updates)

//       if (result.success) {
//         await refetch()
//         return { success: true }
//       } else {
//         setError(result.error || "Failed to update certification")
//         return { success: false, error: result.error }
//       }
//     } catch (err) {
//       const errorMsg = "Failed to update certification"
//       setError(errorMsg)
//       console.error("Error updating certification:", err)
//       return { success: false, error: errorMsg }
//     }
//   }

//   const deleteCertification = async (id: string) => {
//     try {
//       const result = await certificationsDataService.deleteItem(id)

//       if (result.success) {
//         await refetch()
//         return { success: true }
//       } else {
//         setError(result.error || "Failed to delete certification")
//         return { success: false, error: result.error }
//       }
//     } catch (err) {
//       const errorMsg = "Failed to delete certification"
//       setError(errorMsg)
//       console.error("Error deleting certification:", err)
//       return { success: false, error: errorMsg }
//     }
//   }

//   return {
//     data: data || [],
//     loading,
//     error,
//     refetch,
//     addCertification,
//     updateCertification,
//     deleteCertification,
//   }
// }
