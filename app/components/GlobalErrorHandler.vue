<template>
  <div v-if="hasError">
    <UiErrorScreen
      :title="errorTitle"
      :message="errorMessage"
      :details="errorDetails"
      :is-retrying="isRetrying"
      @retry="handleRetry"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup lang="ts">
// Auto-imports: onMounted, onUnmounted, ref, computed (from Vue)

const hasError = ref(false);
const errorTitle = ref('');
const errorMessage = ref('');
const errorDetails = ref('');
const isRetrying = ref(false);

// Global error handler
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Global error caught:', event.error);

  hasError.value = true;
  errorTitle.value = 'Application Error';
  errorMessage.value = 'An unexpected error occurred in the application.';
  errorDetails.value = event.error?.message || 'Unknown error';
};

// Unhandled promise rejection handler
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason);

  hasError.value = true;
  errorTitle.value = 'Promise Rejection Error';
  errorMessage.value = 'An unhandled promise was rejected.';
  errorDetails.value = event.reason?.message || String(event.reason) || 'Unknown rejection';
};

// Vue error handler
const handleVueError = (error: Error, instance: unknown, info: string) => {
  console.error('Vue error:', error, info);

  hasError.value = true;
  errorTitle.value = 'Vue Component Error';
  errorMessage.value = 'An error occurred in a Vue component.';
  errorDetails.value = `${error.message}\n\nComponent: ${info}`;
};

// Retry handler
const handleRetry = async () => {
  isRetrying.value = true;

  try {
    // Clear the error
    hasError.value = false;
    errorTitle.value = '';
    errorMessage.value = '';
    errorDetails.value = '';

    // Refresh the page to reset state
    await navigateTo(useRoute().fullPath, { replace: true });
  } catch (error) {
    console.error('Retry failed:', error);
    hasError.value = true;
    errorMessage.value = 'Failed to retry. Please refresh the page manually.';
  } finally {
    isRetrying.value = false;
  }
};

// Go home handler
const handleGoHome = () => {
  hasError.value = false;
  errorTitle.value = '';
  errorMessage.value = '';
  errorDetails.value = '';
};

// Set up error handlers
onMounted(() => {
  // Global error handlers
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Vue error handler
  const app = getCurrentInstance()?.appContext?.app;
  if (app) {
    app.config.errorHandler = handleVueError;
  }
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
});

// Expose error state for manual error handling
const setError = (title: string, message: string, details?: string) => {
  hasError.value = true;
  errorTitle.value = title;
  errorMessage.value = message;
  errorDetails.value = details || '';
};

const clearError = () => {
  hasError.value = false;
  errorTitle.value = '';
  errorMessage.value = '';
  errorDetails.value = '';
};

// Provide error handling functions to child components
provide('errorHandler', {
  setError,
  clearError,
  hasError: readonly(hasError),
});
</script>
