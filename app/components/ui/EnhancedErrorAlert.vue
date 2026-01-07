<template>
  <div class="enhanced-error-alert">
    <!-- Main Error Card -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 shadow-lg overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 px-6 py-4 border-b border-red-200 dark:border-red-700"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Icon :name="errorIcon" class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">
              {{ title }}
            </h3>
            <p class="text-sm text-red-600 dark:text-red-300 mt-1">
              {{ subtitle }}
            </p>
          </div>
          <div v-if="dismissible" class="flex-shrink-0">
            <UButton variant="ghost" size="sm" color="error" icon="i-heroicons-x-mark" @click="_emit('dismiss')" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-4">
        <!-- Main Message -->
        <div class="mb-4">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ description }}
          </p>
        </div>

        <!-- Error Details (if provided) -->
        <div v-if="showDetails && errorDetails" class="mb-4">
          <UButton
            variant="ghost"
            size="sm"
            color="neutral"
            :icon="showDetailsExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="mb-2"
            @click="toggleDetails"
          >
            {{ showDetailsExpanded ? 'Hide' : 'Show' }} Technical Details
          </UButton>

          <div
            v-if="showDetailsExpanded"
            class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <pre class="text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap overflow-x-auto">{{
              errorDetails
            }}</pre>
          </div>
        </div>

        <!-- Suggested Actions -->
        <div v-if="suggestions && suggestions.length > 0" class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What you can try:</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li v-for="(suggestion, index) in suggestions" :key="index" class="flex items-start">
              <Icon name="i-heroicons-light-bulb" class="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            v-for="action in actions"
            :key="action.label"
            :color="action.color || 'primary'"
            :variant="action.variant || 'solid'"
            :size="action.size || 'md'"
            :loading="action.loading"
            :disabled="action.disabled"
            class="flex-1 sm:flex-none"
            @click="action.click"
          >
            <Icon v-if="action.icon" :name="action.icon" class="w-4 h-4 mr-2" />
            {{ action.label }}
          </UButton>
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="showFooter"
        class="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Error ID: {{ errorId }}</span>
          <span>{{ timestamp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorAction {
  label: string;
  click: () => void;
  color?: 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'neutral';
  variant?: 'link' | 'ghost' | 'solid' | 'outline' | 'soft' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
}

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  errorDetails?: string;
  suggestions?: string[];
  actions?: ErrorAction[];
  errorId?: string;
  dismissible?: boolean;
  showDetails?: boolean;
  showFooter?: boolean;
  type?: 'error' | 'warning' | 'info' | 'network' | 'permission' | 'validation';
}

interface Emits {
  (e: 'dismiss'): void;
}

const {
  subtitle = 'Something went wrong',
  suggestions = [],
  actions = [],
  errorId = Math.random().toString(36).substr(2, 9),
  dismissible = false,
  showDetails = false,
  showFooter = true,
  type = 'error',
  errorDetails = undefined,
} = defineProps<Props>();

const _emit = defineEmits<Emits>();

const showDetailsExpanded = ref(false);
const timestamp = computed(() => new Date().toLocaleString());

const errorIcon = computed(() => {
  switch (type) {
    case 'error':
      return 'i-heroicons-exclamation-triangle';
    case 'warning':
      return 'i-heroicons-exclamation-circle';
    case 'info':
      return 'i-heroicons-information-circle';
    case 'network':
      return 'i-heroicons-wifi';
    case 'permission':
      return 'i-heroicons-lock-closed';
    case 'validation':
      return 'i-heroicons-document-text';
    default:
      return 'i-heroicons-exclamation-triangle';
  }
});

const toggleDetails = () => {
  showDetailsExpanded.value = !showDetailsExpanded.value;
};
</script>

<style scoped>
.enhanced-error-alert {
  transition: all 0.3s;
}

.enhanced-error-alert:hover {
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
</style>
