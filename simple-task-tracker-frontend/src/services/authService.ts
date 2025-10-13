import { createClient } from '@supabase/supabase-js'
import apiClient from './api'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Sign up new user
export const signup = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/signup', {
    email,
    password,
    name,
  })

  const { user, session } = response.data

  if (session?.access_token) {
    localStorage.setItem('auth_token', session.access_token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  return {
    user,
    token: session?.access_token || '',
  }
}

// Login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  })

  const { user, session } = response.data

  if (session?.access_token) {
    localStorage.setItem('auth_token', session.access_token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  return {
    user,
    token: session?.access_token || '',
  }
}

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }
}

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token')
}
