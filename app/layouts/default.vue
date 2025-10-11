<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Layout component - no page metadata needed
</script>
