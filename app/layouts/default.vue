<template>
  <div class="min-h-screen flex flex-col app-wallpaper">
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
