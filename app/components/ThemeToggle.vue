<template>
  <UButton
    :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    variant="ghost"
    size="sm"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === 'dark');

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>
