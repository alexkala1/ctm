<template>
  <UApp>
    <!-- Nuxt Loading Indicator -->
    <NuxtLoadingIndicator />

    <!-- Main App -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NotificationToast />
  </UApp>
</template>

<script setup lang="ts">
// Auto-imports: onMounted, useAuthStore, useUIStore (from Pinia)

// Initialize stores using composable pattern
const { initialize: initializeUI } = useUIStore()
const { checkAuth: checkUserAuth } = useAuthStore()

// Initialize on app start
onMounted(async () => {
  try {
    // Initialize UI first
    initializeUI()

    // Check authentication
    await checkUserAuth()
  } catch (error) {
    console.error('App initialization error:', error)
  }
})
</script>

<style>
/* Ensure smooth transitions */
* {
  transition: background-color 0.2s ease-in-out;
}
</style>
