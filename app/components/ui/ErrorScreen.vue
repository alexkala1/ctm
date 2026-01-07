<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <Icon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        <!-- Error Title -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ title || 'Something went wrong' }}
        </h1>

        <!-- Error Message -->
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {{ message || 'We encountered an unexpected error. Please try again.' }}
        </p>

        <!-- Error Details (if provided) -->
        <div
          v-if="details"
          class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Error Details:</h3>
          <p class="text-sm text-red-700 dark:text-red-300 font-mono">
            {{ details }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton color="primary" size="md" :loading="isRetrying" class="w-full sm:w-auto" @click="handleRetry">
            <Icon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
            {{ retryText || 'Try Again' }}
          </UButton>

          <UButton variant="outline" size="md" class="w-full sm:w-auto" @click="handleGoHome">
            <Icon name="i-heroicons-home" class="w-4 h-4 mr-2" />
            Go Home
          </UButton>
        </div>

        <!-- Additional Help -->
        <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message?: string;
  details: string;
  retryText?: string;
  isRetrying?: boolean;
}

interface Emits {
  (e: 'retry' | 'goHome'): void;
}

const {
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  details,
  retryText = 'Try Again',
  isRetrying = false,
} = defineProps<Props>();

const emit = defineEmits<Emits>();

const handleRetry = () => {
  emit('retry');
};

const handleGoHome = () => {
  emit('goHome');
  navigateTo('/');
};
</script>
