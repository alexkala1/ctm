<template>
  <header
    class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-glass shadow-glass border-b border-white/20 dark:border-white/10"
    @click="closeMenu"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4 sm:py-6">
        <!-- Logo and Title -->
        <div class="flex items-center min-w-0 flex-1">
          <NuxtLink
            to="/"
            class="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 hover:scale-105"
          >
            <div class="flex-shrink-0">
              <img
                src="/icon.svg"
                alt="Chess Tournament Manager"
                class="h-8 w-8"
              >
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Chess Tournament Manager
              </h1>
            </div>
            <div class="sm:hidden">
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">CTM</h1>
            </div>
          </NuxtLink>
        </div>

        <!-- Navigation and Actions -->
        <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- User Actions -->
          <div
            v-if="!isLoading"
            class="flex items-center space-x-2 sm:space-x-4"
          >
            <!-- Not Authenticated -->
            <template v-if="!isAuthenticated">
              <UButton
                to="/auth/login"
                variant="soft"
                color="neutral"
                size="sm"
                class="hidden sm:inline-flex"
              >
                Login
              </UButton>
              <UButton
                to="/auth/register"
                variant="solid"
                color="primary"
                size="sm"
                class="hidden sm:inline-flex"
              >
                Register
              </UButton>
              <!-- Mobile Auth Buttons -->
              <div class="sm:hidden flex items-center space-x-2">
                <UButton
                  to="/auth/login"
                  variant="soft"
                  color="neutral"
                  size="sm"
                  icon="i-heroicons-arrow-right-on-rectangle"
                />
                <UButton
                  to="/auth/register"
                  color="primary"
                  size="sm"
                  icon="i-heroicons-user-plus"
                />
              </div>
            </template>

            <!-- Authenticated -->
            <div
              v-else
              class="flex items-center space-x-2 sm:space-x-4"
            >
              <!-- User Dropdown -->
              <div
                class="relative"
                @click.stop
              >
                <UButton
                  variant="soft"
                  color="neutral"
                  size="sm"
                  class="flex items-center space-x-2"
                  @click="toggleUserMenu"
                >
                  <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon
                      name="i-heroicons-user"
                      class="h-5 w-5 text-primary"
                    />
                  </div>
                  <span class="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
                    {{ user?.name || 'User' }}
                  </span>
                  <Icon
                    name="i-heroicons-chevron-down"
                    class="h-4 w-4 text-gray-500"
                  />
                </UButton>

                <!-- Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-glass rounded-xl shadow-glass border border-white/20 dark:border-white/10 z-50"
                >
                  <div class="py-1">
                    <UButton
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      @click="navigateTo('/profile')"
                    >
                      <Icon
                        name="i-heroicons-user"
                        class="w-4 h-4 mr-3"
                      />
                      Profile
                    </UButton>

                    <UButton
                      variant="soft"
                      color="neutral"
                      size="sm"
                      class="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      @click="handleLogout"
                    >
                      <Icon
                        name="i-heroicons-arrow-right-on-rectangle"
                        class="w-4 h-4 mr-3"
                      />
                      Logout
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div
            v-else
            class="flex items-center space-x-2 sm:space-x-4"
          >
            <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Auth composable
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)
const { logout: signOut } = authStore

// Dropdown state
const showUserMenu = ref(false)
const isLoading = ref(false)

// Toggle user menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Handle logout
const handleLogout = async () => {
  console.log('Logout button clicked')
  showUserMenu.value = false
  isLoading.value = true
  try {
    await signOut()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoading.value = false
  }
}

// Close menu when clicking outside
const closeMenu = () => {
  showUserMenu.value = false
}
</script>
