'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  rateLimit, 
  validateEmail, 
  validatePassword, 
  sanitizeInput, 
  hashPassword, 
  verifyPassword,
  generateCSRFToken,
  validateCSRFToken,
  logSecurityEvent,
  SecurityError
} from '@/lib/security'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  type: 'admin' | 'customer'
  createdAt: string
  isEmailVerified: boolean
  lastLogin?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  csrfToken: string
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export function useSecureAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    csrfToken: ''
  })

  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  // Generate session ID for CSRF protection
  const [sessionId] = useState(() => 
    typeof window !== 'undefined' 
      ? `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : ''
  )

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      // Generate CSRF token
      const csrfToken = generateCSRFToken(sessionId)

      // Check for existing user session
      const userData = localStorage.getItem('user')
      const sessionToken = localStorage.getItem('sessionToken')
      
      if (userData && sessionToken) {
        const user = JSON.parse(userData)
        
        // Validate session (in production, verify with server)
        if (isValidSession(sessionToken)) {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            csrfToken
          })
          return
        } else {
          // Invalid session, clear storage
          localStorage.removeItem('user')
          localStorage.removeItem('sessionToken')
        }
      }

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        csrfToken
      })

    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        csrfToken: generateCSRFToken(sessionId)
      })
    }
  }, [sessionId])

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Input validation and sanitization
      const email = sanitizeInput(credentials.email.toLowerCase())
      const password = credentials.password

      if (!validateEmail(email)) {
        throw new SecurityError('Geçersiz e-posta adresi', 'validation')
      }

      if (!password || password.length < 6) {
        throw new SecurityError('Geçersiz şifre', 'validation')
      }

      // Rate limiting check
      const clientIP = 'demo-ip' // In production, get real IP
      const limitResult = rateLimit(clientIP, 'login')
      
      if (!limitResult.success) {
        setIsLocked(true)
        setTimeout(() => setIsLocked(false), 15 * 60 * 1000) // 15 minutes
        throw new SecurityError('Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.', 'rate_limit', 429)
      }

      // CSRF token validation
      if (!validateCSRFToken(sessionId, authState.csrfToken)) {
        throw new SecurityError('Güvenlik doğrulaması başarısız', 'csrf', 403)
      }

      setAuthState(prev => ({ ...prev, isLoading: true }))

      // Demo authentication logic
      let user: User | null = null

      if (email === 'admin@saldunyasi.com' && password === 'admin123') {
        user = {
          id: 'admin_1',
          email,
          name: 'Admin User',
          type: 'admin',
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
          lastLogin: new Date().toISOString()
        }
      } else if (email && password.length >= 6) {
        user = {
          id: `user_${Date.now()}`,
          email,
          name: 'Demo User',
          type: 'customer',
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
          lastLogin: new Date().toISOString()
        }
      }

      if (!user) {
        setLoginAttempts(prev => prev + 1)
        
        if (loginAttempts >= 4) {
          setIsLocked(true)
          setTimeout(() => {
            setIsLocked(false)
            setLoginAttempts(0)
          }, 15 * 60 * 1000)
        }

        logSecurityEvent({
          type: 'invalid_login',
          ip: clientIP,
          details: { email, attempts: loginAttempts + 1 }
        })

        throw new SecurityError('E-posta veya şifre hatalı', 'authentication', 401)
      }

      // Generate session token
      const sessionToken = generateSessionToken(user.id)

      // Store user data securely
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('sessionToken', sessionToken)

      // Reset login attempts on successful login
      setLoginAttempts(0)

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        csrfToken: generateCSRFToken(sessionId)
      })

      toast.success('Giriş başarılı!')
      return true

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      
      if (error instanceof SecurityError) {
        toast.error(error.message)
      } else {
        console.error('Login error:', error)
        toast.error('Giriş sırasında bir hata oluştu')
      }
      
      return false
    }
  }, [authState.csrfToken, sessionId, loginAttempts])

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      // Input validation and sanitization
      const firstName = sanitizeInput(data.firstName)
      const lastName = sanitizeInput(data.lastName)
      const email = sanitizeInput(data.email.toLowerCase())
      const phone = sanitizeInput(data.phone)
      const password = data.password
      const confirmPassword = data.confirmPassword

      // Validation
      if (!firstName || firstName.length < 2) {
        throw new SecurityError('Ad en az 2 karakter olmalıdır')
      }

      if (!lastName || lastName.length < 2) {
        throw new SecurityError('Soyad en az 2 karakter olmalıdır')
      }

      if (!validateEmail(email)) {
        throw new SecurityError('Geçersiz e-posta adresi')
      }

      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        throw new SecurityError(passwordValidation.errors[0])
      }

      if (password !== confirmPassword) {
        throw new SecurityError('Şifreler eşleşmiyor')
      }

      if (!data.acceptTerms) {
        throw new SecurityError('Kullanım koşullarını kabul etmelisiniz')
      }

      // Rate limiting
      const clientIP = 'demo-ip'
      const limitResult = rateLimit(clientIP, 'register')
      
      if (!limitResult.success) {
        throw new SecurityError('Çok fazla kayıt denemesi. Lütfen daha sonra tekrar deneyin.', 'rate_limit', 429)
      }

      // CSRF validation
      if (!validateCSRFToken(sessionId, authState.csrfToken)) {
        throw new SecurityError('Güvenlik doğrulaması başarısız', 'csrf', 403)
      }

      setAuthState(prev => ({ ...prev, isLoading: true }))

      // Demo registration - in production, save to database
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        name: `${firstName} ${lastName}`,
        type: 'customer',
        createdAt: new Date().toISOString(),
        isEmailVerified: false,
        lastLogin: new Date().toISOString()
      }

      // Generate session token
      const sessionToken = generateSessionToken(user.id)

      // Store user data
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('sessionToken', sessionToken)

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        csrfToken: generateCSRFToken(sessionId)
      })

      toast.success('Kayıt başarılı! Hoş geldiniz!')
      return true

    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      
      if (error instanceof SecurityError) {
        toast.error(error.message)
      } else {
        console.error('Registration error:', error)
        toast.error('Kayıt sırasında bir hata oluştu')
      }
      
      return false
    }
  }, [authState.csrfToken, sessionId])

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      // Clear storage
      localStorage.removeItem('user')
      localStorage.removeItem('sessionToken')

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        csrfToken: generateCSRFToken(sessionId)
      })

      toast.success('Çıkış yapıldı')

    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Çıkış yapılırken bir hata oluştu')
    }
  }, [sessionId])

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new SecurityError('Oturum açmanız gerekiyor', 'authentication', 401)
      }

      // CSRF validation
      if (!validateCSRFToken(sessionId, authState.csrfToken)) {
        throw new SecurityError('Güvenlik doğrulaması başarısız', 'csrf', 403)
      }

      const updatedUser = { ...authState.user, ...updates }
      
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }))

      toast.success('Profil güncellendi')
      return true

    } catch (error) {
      if (error instanceof SecurityError) {
        toast.error(error.message)
      } else {
        console.error('Profile update error:', error)
        toast.error('Profil güncellenirken bir hata oluştu')
      }
      
      return false
    }
  }, [authState, sessionId])

  // Helper functions
  function isValidSession(token: string): boolean {
    // In production, validate with server
    return token && token.length > 10
  }

  function generateSessionToken(userId: string): string {
    // In production, use secure token generation
    return `session_${userId}_${Date.now()}_${Math.random().toString(36)}`
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    isLocked,
    loginAttempts,
    refreshAuth: initializeAuth
  }
}
