<template>
  <div>
    <!-- Error State -->
    <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div class="max-w-2xl w-full">
        <UiEnhancedErrorAlert
          :title="errorTitle"
          :subtitle="errorSubtitle"
          :description="errorDescription"
          :error-details="errorDetails"
          :suggestions="errorSuggestions"
          :actions="errorActions"
          :error-id="errorId"
          :type="errorType"
          show-details
          @dismiss="handleDismiss"
        />
      </div>
    </div>

    <!-- Normal Content -->
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorInfo {
  title: string;
  subtitle: string;
  description: string;
  details?: string;
  suggestions: string[];
  type: 'error' | 'warning' | 'info' | 'network' | 'permission' | 'validation';
}

const hasError = ref(false);
const errorInfo = ref<ErrorInfo | null>(null);
const errorId = ref('');

// Computed properties for error display
const errorTitle = computed(() => errorInfo.value?.title || 'Something went wrong');
const errorSubtitle = computed(() => errorInfo.value?.subtitle || 'An unexpected error occurred');
const errorDescription = computed(
  () => errorInfo.value?.description || 'We encountered an error while loading this page.'
);
const errorDetails = computed(() => errorInfo.value?.details);
const errorSuggestions = computed(() => errorInfo.value?.suggestions || []);
const errorType = computed(() => errorInfo.value?.type || 'error');

const errorActions = computed(() => [
  {
    label: 'Try Again',
    click: handleRetry,
    color: 'primary',
    icon: 'i-heroicons-arrow-path',
  },
  {
    label: 'Go Home',
    click: handleGoHome,
    color: 'gray',
    variant: 'outline',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Report Issue',
    click: handleReportIssue,
    color: 'red',
    variant: 'outline',
    icon: 'i-heroicons-exclamation-triangle',
  },
]);

// Error handling methods
const handleRetry = () => {
  hasError.value = false;
  errorInfo.value = null;
  // Force a page refresh
  window.location.reload();
};

const handleGoHome = () => {
  navigateTo('/');
};

const handleReportIssue = () => {
  // Open a new window/tab for reporting issues
  const issueUrl = `https://github.com/your-repo/issues/new?title=Error Report - ${errorId.value}&body=Error ID: ${errorId.value}\n\nError Details:\n${errorDetails.value || 'No additional details available'}`;
  window.open(issueUrl, '_blank');
};

const handleDismiss = () => {
  hasError.value = false;
  errorInfo.value = null;
};

// Error detection and categorization
const detectErrorType = (error: Error): 'error' | 'warning' | 'info' | 'network' | 'permission' | 'validation' => {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network';
  }
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'permission';
  }
  if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
    return 'validation';
  }
  if (message.includes('warning') || message.includes('deprecated')) {
    return 'warning';
  }

  return 'error';
};

const getErrorInfo = (error: Error): ErrorInfo => {
  const type = detectErrorType(error);
  const message = error.message;

  switch (type) {
    case 'network':
      return {
        title: 'Connection Problem',
        subtitle: 'Unable to connect to the server',
        description: "It looks like there's a network issue. Please check your internet connection and try again.",
        details: `Network Error: ${message}`,
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Check if the server is running',
          'Try again in a few moments',
        ],
        type,
      };

    case 'permission':
      return {
        title: 'Access Denied',
        subtitle: "You don't have permission to access this resource",
        description:
          "It seems you don't have the necessary permissions to view this content. Please contact an administrator if you believe this is an error.",
        details: `Permission Error: ${message}`,
        suggestions: [
          "Check if you're logged in",
          'Contact an administrator',
          'Try logging out and back in',
          'Verify your account permissions',
        ],
        type,
      };

    case 'validation':
      return {
        title: 'Invalid Data',
        subtitle: 'The information provided is not valid',
        description: 'There seems to be an issue with the data being processed. Please check your input and try again.',
        details: `Validation Error: ${message}`,
        suggestions: [
          'Check your input for errors',
          'Make sure all required fields are filled',
          'Verify the format of your data',
          'Try again with corrected information',
        ],
        type,
      };

    case 'warning':
      return {
        title: 'Warning',
        subtitle: 'Something needs your attention',
        description: 'A warning occurred while processing your request. The application may not function as expected.',
        details: `Warning: ${message}`,
        suggestions: [
          'Review the warning details',
          'Try the action again',
          'Contact support if the issue persists',
          'Check for any updates available',
        ],
        type,
      };

    default:
      return {
        title: 'Unexpected Error',
        subtitle: 'Something went wrong',
        description: 'An unexpected error occurred while loading this page. We apologize for the inconvenience.',
        details: `Error: ${message}\nStack: ${error.stack}`,
        suggestions: [
          'Try refreshing the page',
          'Clear your browser cache',
          'Check if the server is running',
          'Contact support if the problem persists',
        ],
        type,
      };
  }
};

// Global error handler
const handleError = (error: Error) => {
  console.error('Error Boundary caught error:', error);

  errorId.value = Math.random().toString(36).substr(2, 9);
  errorInfo.value = getErrorInfo(error);
  hasError.value = true;
};

// Vue error handler
onErrorCaptured((error: Error) => {
  handleError(error);
  return false; // Prevent the error from propagating
});

// Global error handler
if (import.meta.client) {
  window.addEventListener('error', event => {
    handleError(new Error(event.message));
  });

  window.addEventListener('unhandledrejection', event => {
    handleError(new Error(event.reason));
  });
}
</script>
