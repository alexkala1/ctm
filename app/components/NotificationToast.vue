<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 max-w-md w-full"
    >
      <TransitionGroup name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification in activeNotifications"
          :key="notification.id"
          class="w-full bg-white dark:bg-gray-900 shadow-xl rounded-lg pointer-events-auto border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm"
          :class="getNotificationClasses(notification.type)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Icon
                  :name="getNotificationIcon(notification.type)"
                  class="h-6 w-6"
                  :class="getIconClasses(notification.type)"
                />
              </div>
              <div class="ml-3 flex-1 pt-0.5 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white break-words"
                >
                  {{ notification.title }}
                </p>
                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-300 break-words"
                >
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  class="rounded-lg inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1.5 transition-colors"
                  @click="dismissNotification(notification.id)"
                >
                  <span class="sr-only">Close</span>
                  <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// Auto-imports: useUIStore (from Pinia), storeToRefs (from Pinia)

const uiStore = useUIStore()
const { activeNotifications } = storeToRefs(uiStore)
const { dismissNotification } = uiStore

// Debug notifications
watch(activeNotifications, (newNotifications) => {
  console.log('Notifications updated:', newNotifications.length, newNotifications)
}, { deep: true })

// Component is now wrapped in ClientOnly, so no need for client-side check

function getNotificationClasses(type: string) {
  switch (type) {
    case 'success':
      return 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10'
    case 'error':
      return 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10'
    case 'warning':
      return 'border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10'
    case 'info':
      return 'border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
    default:
      return 'border-l-4 border-gray-400 bg-gray-50/50 dark:bg-gray-800/50'
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success':
      return 'i-heroicons-check-circle'
    case 'error':
      return 'i-heroicons-x-circle'
    case 'warning':
      return 'i-heroicons-exclamation-triangle'
    case 'info':
      return 'i-heroicons-information-circle'
    default:
      return 'i-heroicons-information-circle'
  }
}

function getIconClasses(type: string) {
  switch (type) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'error':
      return 'text-red-600 dark:text-red-400'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'info':
      return 'text-blue-600 dark:text-blue-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
