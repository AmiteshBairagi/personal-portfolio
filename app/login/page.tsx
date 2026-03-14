"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { login, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    }
  }, [isAuthenticated, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!username.trim() || !password) {
      setError("Please enter both username and password")
      return
    }

    const result = await login(username.trim(), password)

    if (result.success) {
      setSuccess(true)
      setUsername("")
      setPassword("")
    } else {
      setError(result.error || "Login failed")
    }
  }

  if (success) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="text-center relative z-10 w-full max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Successful!</h2>
          <p className="text-slate-400">Redirecting to admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </div>

        <Card className="bg-slate-900/60 border-slate-700/50 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20 border border-white/10">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white tracking-tight">
                Admin Login
              </CardTitle>
              <p className="text-slate-400 mt-2">Access the portfolio admin panel</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-950/50 border-slate-700/50 text-white pl-10 focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
                    placeholder="Enter username"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950/50 border-slate-700/50 text-white pl-10 pr-10 focus:border-cyan-500/50 focus:ring-cyan-500/20 placeholder:text-slate-500"
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 border-0 font-medium py-2.5 h-11"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In to Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            This is a demo admin panel. In production, use secure authentication.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </ThemeProvider>
  )
}
