<template>
  <div class="enhanced-loading-state">
    <div class="text-center py-12 px-4">
      <!-- Animated Icon -->
      <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-6">
        <div class="relative">
          <Icon 
            :name="icon" 
            class="h-12 w-12 text-primary-600 dark:text-primary-400 animate-spin"
          />
          <div v-if="showPulse" class="absolute inset-0 rounded-full bg-primary-200 dark:bg-primary-800 animate-ping opacity-75"/>
        </div>
      </div>
      
      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {{ description }}
      </p>
      
      <!-- Progress Bar (if provided) -->
      <div v-if="showProgress && progress !== undefined" class="max-w-xs mx-auto mb-6">
        <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{{ progressLabel || 'Loading...' }}</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
      
      <!-- Loading Steps (if provided) -->
      <div v-if="steps && steps.length > 0" class="max-w-md mx-auto">
        <div class="space-y-3">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex items-center text-sm"
            :class="{
              'text-gray-900 dark:text-white': index <= currentStep,
              'text-gray-400 dark:text-gray-500': index > currentStep
            }"
          >
            <div 
              class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3"
              :class="{
                'bg-primary-600 text-white': index < currentStep,
                'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400': index === currentStep,
                'bg-gray-200 dark:bg-gray-700 text-gray-400': index > currentStep
              }"
            >
              <Icon 
                v-if="index < currentStep"
                name="i-heroicons-check"
                class="w-4 h-4"
              />
              <Icon 
                v-else-if="index === currentStep"
                name="i-heroicons-arrow-path"
                class="w-4 h-4 animate-spin"
              />
              <span v-else class="text-xs font-medium">{{ index + 1 }}</span>
            </div>
            <span>{{ step }}</span>
          </div>
        </div>
      </div>
      
      <!-- Additional Info -->
      <div v-if="additionalInfo" class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>{{ additionalInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon?: string
  showPulse?: boolean
  showProgress?: boolean
  progress?: number
  progressLabel?: string
  steps?: string[]
  currentStep?: number
  additionalInfo?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-arrow-path',
  showPulse: true,
  showProgress: false,
  progress: undefined,
  progressLabel: 'Loading...',
  steps: () => [],
  currentStep: 0,
  additionalInfo: undefined
})
</script>

<style scoped>
.enhanced-loading-state {
  transition: all 0.3s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
