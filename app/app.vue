<template>
  <UApp>
    <!-- Nuxt Loading Indicator -->
    <NuxtLoadingIndicator />

    <!-- Main App -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div>
      <NotificationToast
        v-for="n in ui.activeNotifications"
        :id="n.id"
        :key="n.id"
        :type="n.type"
        :title="n.title"
        :message="n.message"
        :duration="n.duration"
        position="top-center"
        @close="ui.dismissNotification"
      />
    </div>
  </UApp>
</template>

<script setup lang="ts">
// Auto-imports: onMounted, useAuthStore, useUIStore (from Pinia)

// Initialize stores using composable pattern
const ui = useUIStore();
const { checkAuth: checkUserAuth } = useAuthStore();

// Initialize on app start
onMounted(async () => {
  try {
    // Initialize UI first
    ui.initialize();

    // Check authentication
    await checkUserAuth();
  } catch (error) {
    console.error('App initialization error:', error);
  }
});
</script>

<style>
/* Ensure smooth transitions */
* {
  transition: background-color 0.2s ease-in-out;
}
</style>
