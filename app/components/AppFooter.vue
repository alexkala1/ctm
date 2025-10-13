<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <img
              src="/icon.svg"
              alt="Chess Tournament Manager"
              class="h-8 w-8"
            >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Chess Tournament Manager
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm max-w-md">
            A comprehensive platform for managing chess tournaments, participants, and competitions
            with ease and efficiency.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4
            class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
          >
            Quick Links
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Tournaments
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="!isAuthenticated"
                to="/auth/login"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Login
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                v-if="!isAuthenticated"
                to="/auth/register"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Register
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4
            class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
          >
            Support
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/support"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Help Center
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/support"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Contact Us
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/support"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
              >
                Documentation
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              © {{ currentYear }} Chess Tournament Manager. All rights reserved.
            </p>
          </div>

          <div class="flex items-center space-x-6">
            <NuxtLink
              to="/privacy"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Auto-imports: storeToRefs (from Pinia), useAuthStore (from Pinia)

// Auth store
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

// Current year
const currentYear = new Date().getFullYear()
</script>
