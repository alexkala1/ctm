<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <!-- Header -->
    <header class="bg-white dark:bg-neutral-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <Icon name="i-heroicons-trophy" class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-neutral-900 dark:text-white">
              Chess Tournament Manager
            </span>
          </NuxtLink>

          <!-- Back to home -->
          <UButton
            to="/"
            variant="ghost"
            color="neutral"
            size="sm"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Back to Home
          </UButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>&copy; 2024 Chess Tournament Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Auth layout - no authentication required
</script>
