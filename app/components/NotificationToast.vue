<template>
  <Transition name="toast" appear>
    <div
      v-if="isVisible"
      :class="[toastClasses, { 'toast-top-center': position === 'top-center' }]"
      class="fixed z-50 max-w-sm w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
    >
      <div class="flex items-start p-4">
        <!-- Icon -->
        <div v-if="iconSymbol" class="flex-shrink-0 mr-3 mt-0.5">
          <Icon :name="iconSymbol" :class="iconClasses" class="w-5 h-5" />
        </div>

        <!-- Message -->
        <div class="flex-1 min-w-0">
          <h4 v-if="title" class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {{ title }}
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ message }}
          </p>
        </div>

        <!-- Close Button -->
        <button
          v-if="dismissible"
          class="flex-shrink-0 ml-3 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          @click="handleClose"
        >
          <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
        <div
          class="h-full transition-all duration-50 ease-linear"
          :class="progressBarClasses"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  showProgress?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface Emits {
  (e: 'close', id: string): void;
  (e: 'click'): void;
}

const {
  type = 'info',
  duration = 5000,
  dismissible = true,
  showProgress = true,
  position = 'top-center',
  id,
} = defineProps<Props>();

const emit = defineEmits<Emits>();

const isVisible = ref(true);
const progress = ref(100);

// Auto-dismiss timer
let dismissTimer: NodeJS.Timeout | null = null;

const toastClasses = computed(() => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const typeClasses = {
    success: 'bg-green-50/90 dark:bg-green-900/40 border-green-300 dark:border-green-600',
    error: 'bg-red-50/90 dark:bg-red-900/40 border-red-300 dark:border-red-600',
    warning: 'bg-yellow-50/90 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-600',
    info: 'bg-blue-50/90 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600',
  };

  return [
    positionClasses[position] || positionClasses['top-center'],
    typeClasses[type] || typeClasses['info'],
    'border',
  ];
});

const iconSymbol = computed(() => {
  switch (type) {
    case 'success':
      return 'i-heroicons-check-circle';
    case 'error':
      return 'i-heroicons-x-circle';
    case 'warning':
      return 'i-heroicons-exclamation-triangle';
    case 'info':
      return 'i-heroicons-information-circle';
    default:
      return 'i-heroicons-information-circle';
  }
});

const iconClasses = computed(() => {
  const typeClasses = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return typeClasses[type] || typeClasses['info'];
});

const progressBarClasses = computed(() => {
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  return typeClasses[type] || typeClasses['info'];
});

const startDismissTimer = () => {
  if (duration <= 0) return;

  dismissTimer = setTimeout(() => {
    handleClose();
  }, duration);
};

const startProgressTimer = () => {
  if (!showProgress || duration <= 0) return;

  const interval = 50; // Update every 50ms
  const totalSteps = duration / interval;
  const stepSize = 100 / totalSteps;

  const progressTimer = setInterval(() => {
    progress.value -= stepSize;
    if (progress.value <= 0) {
      clearInterval(progressTimer);
    }
  }, interval);
};

const handleClose = () => {
  isVisible.value = false;

  // Clear timers
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }

  // Emit close event after animation
  setTimeout(() => {
    emit('close', id);
  }, 300);
};

// Lifecycle
onMounted(() => {
  startDismissTimer();
  startProgressTimer();
});

onUnmounted(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>
