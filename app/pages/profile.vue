<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">
        Profile
      </h1>
      <p class="mt-2 text-neutral-600 dark:text-neutral-400">
        Manage your account information
      </p>
    </div>

    <!-- Profile Card -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-card p-6">
      <div class="flex items-start space-x-6">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div class="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon 
              name="i-heroicons-user" 
              class="h-10 w-10 text-primary" 
            />
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Name
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white">
                    {{ user?.name || 'Not provided' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Email
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white">
                    {{ user?.email }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Role
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white">
                    <UiStatusBadge
                      :status="user?.role || 'USER'"
                      size="sm"
                      variant="soft"
                    />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Account Details
              </h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Status
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white">
                    <UiStatusBadge
                      :status="user?.status || 'PENDING'"
                      size="sm"
                      variant="soft"
                    />
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Provider
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white flex items-center space-x-2">
                    <Icon
                      :name="getProviderIcon(user?.provider || 'EMAIL')"
                      class="w-4 h-4"
                    />
                    <span>{{ user?.provider || 'EMAIL' }}</span>
                  </dd>
                </div>
                <div v-if="user?.lastLoginAt">
                  <dt class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Last Login
                  </dt>
                  <dd class="text-sm text-neutral-900 dark:text-white">
                    {{ formatDate(user.lastLoginAt) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end space-x-4">
      <UButton
        variant="outline"
        @click="logout"
      >
        <Icon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
        Logout
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
// Auto-imports: useAuthStore (from Pinia)
import { format } from 'date-fns'

// Meta
definePageMeta({
  layout: 'default',
  auth: true,
})

useHead({
  title: 'Profile - Chess Tournament Manager',
})

// Auth store
const authStore = useAuthStore()
const { user, logout } = authStore
const { isAuthenticated } = storeToRefs(authStore)

// Redirect if not authenticated
if (!isAuthenticated.value) {
  await navigateTo('/auth/login')
}

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'GOOGLE':
      return 'logos:google-icon'
    case 'GITHUB':
      return 'logos:github-icon'
    default:
      return 'i-heroicons-envelope'
  }
}

const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}
</script>
