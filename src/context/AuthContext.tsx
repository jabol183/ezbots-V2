'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/auth-helpers-nextjs'

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string, company?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if Supabase credentials are available
const isSupabaseConfigured = () => {
  return (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http') &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  // Only create supabase client if credentials are properly configured
  const supabaseConfigured = isSupabaseConfigured()
  const supabase = supabaseConfigured ? createClientComponentClient() : null

  useEffect(() => {
    // Skip if Supabase is not configured (avoids URL errors)
    if (!supabaseConfigured || !supabase) {
      setIsLoading(false)
      return
    }
    
    const getUser = async () => {
      setIsLoading(true)
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    getUser()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session ? session.user : null)
        setIsLoading(false)
        
        if (session) {
          router.refresh() // Refresh the page to update server-side state
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, supabaseConfigured])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized - check your environment variables')
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string, company?: string) => {
    setIsLoading(true)
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized - check your environment variables')
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company
          }
        }
      })
      
      if (error) {
        throw error
      }
      
      // On successful signup, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized - check your environment variables')
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut
  }
  
  // If Supabase is not configured, show a message instead of blocking the app
  if (!supabaseConfigured && process.env.NODE_ENV === 'development') {
    console.warn('Supabase credentials not configured correctly. Please check your .env.local file.')
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
} 