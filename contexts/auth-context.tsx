"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { authStore } from "@/lib/auth-store"

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const hasInitialized = useRef(false)

  useEffect(() => {
    if (hasInitialized.current) return

    hasInitialized.current = true

    const initialAuth = authStore.init()
    setIsAuthenticated(initialAuth)
    setLoading(false)

    const unsubscribe = authStore.subscribe((auth) => {
      setIsAuthenticated(auth)
    })

    return unsubscribe
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (username.trim() === CREDENTIALS.username && password === CREDENTIALS.password) {
        authStore.setAuth(true)
        setLoading(false)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error) {
      setLoading(false)
      return { success: false, error: "Login failed" }
    }
  }

  const logout = () => {
    authStore.setAuth(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
