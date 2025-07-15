"use client"

import { useState, useEffect, useCallback } from "react"
import { contactDataManager, type ContactData, type ContactFormData } from "@/lib/data/contact-data-manager"

export function useContactRealTime() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  // Load initial data
  const loadContactData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactDataManager.getContactData()
      setContactData(data)
      setLastSyncTime(new Date())
    } catch (err) {
      console.error("Error loading contact data:", err)
      setError(err instanceof Error ? err.message : "Failed to load contact data")
    } finally {
      setLoading(false)
    }
  }, [])

  // Create contact data
  const createContact = useCallback(async (formData: ContactFormData): Promise<ContactData> => {
    try {
      setError(null)
      const newContact = await contactDataManager.createContactData(formData)
      setContactData(newContact)
      setLastSyncTime(new Date())
      return newContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create contact"
      setError(errorMessage)
      throw err
    }
  }, [])

  // Update contact data
  const updateContact = useCallback(async (formData: ContactFormData): Promise<ContactData> => {
    try {
      setError(null)
      const updatedContact = await contactDataManager.updateContactData(formData)
      setContactData(updatedContact)
      setLastSyncTime(new Date())
      return updatedContact
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update contact"
      setError(errorMessage)
      throw err
    }
  }, [])

  // Delete contact data
  const deleteContact = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await contactDataManager.deleteContactData(id)
      setContactData(null)
      setLastSyncTime(new Date())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete contact"
      setError(errorMessage)
      throw err
    }
  }, [])

  // Refresh data manually
  const refreshData = useCallback(async () => {
    await loadContactData()
  }, [loadContactData])

  // Clear cache
  const clearCache = useCallback(() => {
    contactDataManager.clearCache()
    loadContactData()
  }, [loadContactData])

  // Get cache status
  const getCacheStatus = useCallback(() => {
    return contactDataManager.getCacheStatus()
  }, [])

  // Set up real-time subscription and network monitoring
  useEffect(() => {
    // Load initial data
    loadContactData()

    // Set up real-time subscription
    const unsubscribe = contactDataManager.subscribeToChanges((data) => {
      setContactData(data)
      setLastSyncTime(new Date())
    })

    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true)
      loadContactData() // Refresh data when coming back online
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial network status
    setIsOnline(navigator.onLine)

    return () => {
      unsubscribe()
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [loadContactData])

  return {
    contactData,
    loading,
    error,
    isOnline,
    lastSyncTime,
    createContact,
    updateContact,
    deleteContact,
    refreshData,
    clearCache,
    getCacheStatus,
  }
}
