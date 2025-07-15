"use client"

import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Admin panel error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="bg-slate-800/60 border-slate-600/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Component Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">
                Something went wrong loading this section. Please try refreshing the page.
              </p>
              <div className="space-x-4">
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Reload Page
                </Button>
              </div>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-slate-500 cursor-pointer">Error Details</summary>
                  <pre className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-red-400 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
