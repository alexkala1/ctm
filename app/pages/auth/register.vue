<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <UPageCard>
        <UAuthForm
          :schema="registerSchema"
          title="Create your account"
          description="Sign up to manage chess tournaments"
          icon="i-heroicons-user-plus"
          :fields="fields"
          :providers="providers"
          :submit="submitButton"
          @submit="handleEmailRegister"
        >
          <template #footer>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?
              <NuxtLink
                to="/auth/login"
                class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Sign in
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
        v-if="successMessage"
        type="success"
        :title="successMessage"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { z } from 'zod'
// Auto-imports: useAuthStore (from Pinia)
import { handleError } from '../../../utils/errorHandler'
import type { FormSubmitEvent, ButtonProps } from '@nuxt/ui'

// Meta
definePageMeta({
  layout: 'auth',
  auth: false,
})

useHead({
  title: 'Sign Up - Chess Tournament Manager',
})

// Form validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

// State
const authStore = useAuthStore()

const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const isLoading = ref(false)

// Check if user is already authenticated
onMounted(async () => {
  await authStore.checkAuth()
  
  if (authStore.isAuthenticated) {
    await navigateTo('/')
    return
  }
})

// OAuth methods
const signUpWithGoogle = async () => {
  isLoading.value = true
  try {
    error.value = null
    successMessage.value = null
    
    // Redirect to Google OAuth
    const currentPath = useRoute().path
    window.location.href = `/api/auth/google/redirect?redirectTo=${encodeURIComponent(currentPath)}`
  } catch (err: unknown) {
    error.value = 'Failed to initiate Google sign-up'
    handleError(err, 'Google sign-up failed', 'Authentication Error')
    isLoading.value = false
  }
}

const signUpWithGitHub = async () => {
  isLoading.value = true
  try {
    error.value = null
    successMessage.value = null
    const currentPath = useRoute().path
    window.location.href = `/api/auth/github/redirect?redirectTo=${encodeURIComponent(currentPath)}`
  } catch (err: unknown) {
    error.value = 'Failed to initiate GitHub sign-up'
    handleError(err, 'GitHub sign-up failed', 'Authentication Error')
    isLoading.value = false
  }
}


// UAuthForm configuration
const fields = [
  {
    name: 'name',
    type: 'text' as const,
    label: 'Full name',
    placeholder: 'Enter your full name',
    required: true
  },
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Create a password',
    required: true
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password' as const,
    placeholder: 'Confirm your password',
    required: true
  }
]

const providers: ButtonProps[] = [
  {
    label: 'Google',
    icon: 'logos:google-icon',
    color: 'neutral',
    variant: 'outline',
    onClick: signUpWithGoogle
  },
  {
    label: 'GitHub',
    icon: 'logos:github-icon',
    color: 'neutral',
    variant: 'outline',
    onClick: signUpWithGitHub
  }
]

const submitButton = computed<ButtonProps>(() => ({
  label: 'Create account',
  color: 'primary',
  size: 'lg',
  loading: isLoading.value
}))

// Email register
const handleEmailRegister = async (event: FormSubmitEvent<RegisterForm>) => {
  isLoading.value = true
  try {
    error.value = null
    successMessage.value = null
    
    const result = await authStore.register({
      email: event.data.email,
      password: event.data.password,
      name: event.data.name,
    })
    
    if (result.success) {
      successMessage.value = 'Account created successfully! Your account is pending approval. You will be notified once approved.'
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (err: unknown) {
    error.value = 'Registration failed'
    handleError(err, 'Registration failed', 'Authentication Error')
  } finally {
    isLoading.value = false
  }
}
</script>