"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/DashboardPage"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AuthPage from "./pages/AuthPage"
import { getCurrentSession, clearSession } from "./utils/auth"

type View = "landing" | "auth" | "dashboard"
export type AuthMode = "login" | "signup"

interface User {
  id: string
  email: string
  name: string
  profilePicture?: string
  createdAt: number
}

const App: React.FC = () => {
  const [view, setView] = useState<View>("landing")
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const session = getCurrentSession()
    if (session) {
      setUser(session)
      setIsLoggedIn(true)
      setView("dashboard")
    }
  }, [])

  const handleNavigateToAuth = useCallback((mode: AuthMode) => {
    setAuthMode(mode)
    setView("auth")
  }, [])

  const handleLoginSuccess = useCallback((userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    setView("dashboard")
  }, [])

  const handleLogout = useCallback(() => {
    clearSession()
    setUser(null)
    setIsLoggedIn(false)
    setView("landing")
  }, [])

  const handleGetStarted = useCallback(() => {
    setAuthMode("signup")
    setView("auth")
  }, [])

  const handleBackToLanding = useCallback(() => {
    setView("landing")
  }, [])

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:bg-gray-900 dark:text-white">
      {view !== "dashboard" && (
        <Header isLoggedIn={isLoggedIn} onNavigateToAuth={handleNavigateToAuth} onLogout={handleLogout} />
      )}
      <main className="flex-grow flex flex-col">
        {view === "landing" && <LandingPage onGetStarted={handleGetStarted} />}
        {view === "auth" && (
          <AuthPage
            mode={authMode}
            onLoginSuccess={handleLoginSuccess}
            onSwitchMode={setAuthMode}
            onBack={handleBackToLanding}
          />
        )}
        {view === "dashboard" && user && <DashboardPage user={user} onLogout={handleLogout} />}
      </main>
      {view === "landing" && <Footer />}
    </div>
  )
}

export default App
