import axios from "axios"

/**
 * Shared Axios instance for client-side API calls to Spring Boot backend.
 *
 * – `NEXT_PUBLIC_API_URL` should point to your Spring Boot server
 *   (defaults to http://localhost:8080 if undefined).
 * – Add interceptors here if you need auth headers, logging, etc.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
})

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred"
    console.error("API Error:", message)
    return Promise.reject(new Error(message))
  },
)
