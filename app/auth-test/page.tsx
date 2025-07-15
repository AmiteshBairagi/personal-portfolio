"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function AuthTestContent() {
  const { isAuthenticated, loading, login, logout } = useAuth()

  const testLogin = async () => {
    const result = await login("admin", "admin123")
    console.log("Test login result:", result)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Auth Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white">
            <p>Loading: {loading.toString()}</p>
            <p>Authenticated: {isAuthenticated.toString()}</p>
            <p>LocalStorage: {typeof window !== "undefined" ? localStorage.getItem("adminAuth") : "N/A"}</p>
          </div>

          <div className="space-y-2">
            <Button onClick={testLogin} className="w-full">
              Test Login
            </Button>
            <Button onClick={logout} variant="outline" className="w-full">
              Test Logout
            </Button>
          </div>

          <div className="text-xs text-slate-400">
            <p>Expected credentials:</p>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthTestPage() {
  return (
    <AuthProvider>
      <AuthTestContent />
    </AuthProvider>
  )
}
