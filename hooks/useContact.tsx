"use client"

import { useState, useEffect, useCallback } from "react"
import { contactManager, type ContactData, type ContactFormData } from "@/lib/data/contactService"

export function useContact() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  const loadContactData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await contactManager.getContactData()
      setContactData(data)
      // setLastSyncTime(new Date())
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
      const newContact = await contactManager.createContactData(formData)
      //setContactData(newContact)
      // setLastSyncTime(new Date())
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
      const updatedContact = await contactManager.updateContactData(formData)
      setContactData(updatedContact)
      // setLastSyncTime(new Date())
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
      await contactManager.deleteContactData(id)
      setContactData(null)
      // setLastSyncTime(new Date())
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

  useEffect(() => {
    loadContactData()

  }, [loadContactData])

  return {
    contactData,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    refreshData,
  }
}
