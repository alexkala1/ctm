import { defineStore } from 'pinia'
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthApiResponse, 
  AuthResult,
  ApiErrorWithMessage 
} from '~/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)
  const isAdmin = computed(() => user.value?.role === 'ADMIN' || user.value?.role === 'SUPER_ADMIN')

  // Actions
  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthApiResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      if (response.success && response.data?.user) {
        user.value = response.data.user
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorWithMessage
      console.error('Login error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Login failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterData): Promise<AuthResult> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthApiResponse>('/api/auth/register', {
        method: 'POST',
        body: credentials
      })
      
      if (response.success && response.data?.user) {
        user.value = response.data.user
        await navigateTo('/')
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Registration failed' }
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorWithMessage
      console.error('Registration error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Registration failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch (error: unknown) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      await navigateTo('/auth/login')
    }
  }

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await $fetch<AuthApiResponse>('/api/auth/me')
      
      if (response.success && response.data?.user) {
        user.value = response.data.user
      } else {
        user.value = null
      }
    } catch (error: unknown) {
      console.error('Auth check error:', error)
      user.value = null
    }
  }

  // OAuth methods
  const signInWithGoogle = async (): Promise<AuthResult> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthApiResponse>('/api/auth/oauth-callback', {
        method: 'POST',
        body: { provider: 'google' }
      })
      
      if (response.success && response.data?.user) {
        user.value = response.data.user
        await navigateTo('/')
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Google sign-in failed' }
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorWithMessage
      console.error('Google sign-in error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Google sign-in failed' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const signInWithGitHub = async (): Promise<AuthResult> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthApiResponse>('/api/auth/oauth-callback', {
        method: 'POST',
        body: { provider: 'github' }
      })
      
      if (response.success && response.data?.user) {
        user.value = response.data.user
        await navigateTo('/')
        return { success: true }
      } else {
        return { success: false, error: response.error || 'GitHub sign-in failed' }
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorWithMessage
      console.error('GitHub sign-in error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'GitHub sign-in failed' 
      }
    } finally {
      isLoading.value = false
    }
  }


  return {
    // State
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    isAdmin,
    // Actions
    login,
    register,
    logout,
    checkAuth,
    signInWithGoogle,
    signInWithGitHub
  }
})

// Export for compatibility
// Do not re-export `useAuth` to avoid clashing with @sidebase/nuxt-auth composable