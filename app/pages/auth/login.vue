<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <UPageCard>
        <UAuthForm
          :schema="loginSchema"
          title="Sign in to your account"
          description="Enter your credentials to access your account"
          icon="i-heroicons-trophy"
          :fields="fields"
          :providers="providers"
          :submit="submitButton"
          @submit="handleEmailLogin"
        >
          <template #footer>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Don't have an account?
              <NuxtLink
                to="/auth/register"
                class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign up
              </NuxtLink>
            </p>
          </template>
        </UAuthForm>
      </UPageCard>

      <!-- Status Messages -->
      <UAlert
        v-if="error"
        type="error"
        :title="error"
        class="mt-4"
      />

      <UAlert
        v-if="pendingMessage"
        type="info"
        :title="pendingMessage"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
// Auto-imports: useAuthStore (from Pinia)
import { handleError } from '../../../utils/errorHandler'
import type { FormSubmitEvent, ButtonProps, AuthFormProps } from '@nuxt/ui'
import type { AuthUser } from '../../../types'

// Meta
definePageMeta({
  layout: 'auth',
  auth: false,
})

useHead({
  title: 'Sign In - Chess Tournament Manager',
})

// Form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

// State
const authStore = useAuthStore()
const { login: signIn } = authStore

const isLoading = ref(false)
const error = ref<string | null>(null)
const pendingMessage = ref<string | null>(null)

// Handle URL parameters for OAuth callbacks
const route = useRoute()
onMounted(async () => {
  // Check if user is already authenticated
  const authStore = useAuthStore()
  await authStore.checkAuth()
  
  if (authStore.isAuthenticated) {
    await navigateTo('/')
    return
  }
  
  if (route.query.error) {
    error.value = decodeURIComponent(route.query.error as string)
  }
  if (route.query.message === 'pending-approval') {
    const email = route.query.email as string
    pendingMessage.value = `Your account (${email}) is pending approval. Please wait for admin approval.`
  }
})


// OAuth methods
const signInWithGoogle = async () => {
  isLoading.value = true
  try {
    error.value = null
    pendingMessage.value = null
    
    // Redirect to Google OAuth
    const currentPath = useRoute().path
    window.location.href = `/api/auth/google/redirect?redirectTo=${encodeURIComponent(currentPath)}`
  } catch (err: unknown) {
    error.value = 'Failed to initiate Google sign-in'
    handleError(err, 'Google sign-in failed', 'Authentication Error')
    isLoading.value = false
  }
}

const signInWithGitHub = async () => {
  isLoading.value = true
  try {
    error.value = null
    pendingMessage.value = null
    const currentPath = useRoute().path
    window.location.href = `/api/auth/github/redirect?redirectTo=${encodeURIComponent(currentPath)}`
  } catch (err: unknown) {
    error.value = 'Failed to initiate GitHub sign-in'
    handleError(err, 'GitHub sign-in failed', 'Authentication Error')
    isLoading.value = false
  }
}


// UAuthForm configuration
const fields: AuthFormProps['fields'] = [
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
]

const providers: ButtonProps[] = [
  {
    label: 'Google',
    icon: 'logos:google-icon',
    color: 'neutral',
    variant: 'outline',
    onClick: signInWithGoogle
  },
  {
    label: 'GitHub',
    icon: 'logos:github-icon',
    color: 'neutral',
    variant: 'outline',
    onClick: signInWithGitHub
  }
]

const submitButton = computed<ButtonProps>(() => ({
  label: 'Sign in',
  color: 'primary',
  size: 'lg',
  loading: isLoading.value
}))

// Email login
const handleEmailLogin = async (event: FormSubmitEvent<LoginForm>) => {
  console.log('🔧 Frontend: Starting email login...')
  isLoading.value = true
  try {
    error.value = null
    pendingMessage.value = null
    
    console.log('🔧 Frontend: Calling signIn with data:', { email: event.data.email, hasPassword: !!event.data.password })
    const result = await signIn(event.data)
    console.log('🔧 Frontend: SignIn result:', result)
    
    if (!result.success) {
      if (result.error?.includes('pending approval')) {
        pendingMessage.value = 'Your account is pending approval. Please wait for admin approval.'
      } else {
        error.value = result.error || 'Login failed'
      }
    } else {
      console.log('🔧 Frontend: Login successful, redirecting...')
      // Redirect to home page on successful login
      await navigateTo('/')
    }
  } catch (err: unknown) {
    console.error('🔧 Frontend: Login error:', err)
    const errorObj = err as { statusCode?: number; data?: { message?: string } }
    if (errorObj.statusCode === 403) {
      pendingMessage.value = 'Your account is pending approval. Please wait for admin approval.'
    } else {
      error.value = errorObj.data?.message || 'Login failed'
      handleError(errorObj, 'Login failed', 'Authentication Error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>