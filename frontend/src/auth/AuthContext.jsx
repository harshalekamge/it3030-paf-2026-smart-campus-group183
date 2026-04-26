import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const signInWithGoogle = useCallback(() => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      apiBaseUrl: API_BASE_URL,
      isAdmin: user?.role === 'ADMIN',
      isAuthenticated: Boolean(user),
      isLoading,
      logout,
      refreshUser,
      signInWithGoogle,
      user,
    }),
    [isLoading, logout, refreshUser, signInWithGoogle, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
