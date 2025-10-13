<template>
  <div
    class="loading-state"
    :class="containerClass"
  >
    <div class="flex flex-col items-center justify-center space-y-4">
      <!-- Loading Spinner -->
      <div class="relative">
        <div 
          class="rounded-full border-4 border-gray-200 dark:border-gray-700 animate-spin"
          :class="[spinnerClass]"
        />
        <div 
          class="absolute top-0 left-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"
          :class="[spinnerClass]"
        />
      </div>
      
      <!-- Loading Text -->
      <div class="text-center space-y-2">
        <h3 
          v-if="title" 
          class="text-lg font-medium text-gray-900 dark:text-white"
        >
          {{ title }}
        </h3>
        <p 
          v-if="description" 
          class="text-sm text-gray-600 dark:text-gray-400"
        >
          {{ description }}
        </p>
      </div>
      
      <!-- Progress Bar (if percentage provided) -->
      <div
        v-if="percentage !== undefined"
        class="w-full max-w-xs"
      >
        <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>{{ percentage }}%</span>
          <span>{{ statusText }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${percentage}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'overlay' | 'inline'
  percentage?: number
  statusText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  size: 'md',
  variant: 'default',
  percentage: undefined,
  statusText: ''
})

const spinnerClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 w-6'
    case 'md': return 'h-8 w-8'
    case 'lg': return 'h-12 w-12'
    case 'xl': return 'h-16 w-16'
    default: return 'h-8 w-8'
  }
})

const containerClass = computed(() => {
  switch (props.variant) {
    case 'overlay':
      return 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center'
    case 'inline':
      return 'p-4'
    default:
      return 'py-12 px-4'
  }
})
</script>

<style scoped>
.loading-state {
  transition: all 0.2s;
}
</style>
