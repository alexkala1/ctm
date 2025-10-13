<template>
  <div class="empty-state">
    <div class="text-center py-12 px-4">
      <!-- Icon -->
      <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
        <Icon 
          :name="icon" 
          class="h-12 w-12 text-gray-400 dark:text-gray-500"
        />
      </div>
      
      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {{ description }}
      </p>
      
      <!-- Action Buttons -->
      <div
        v-if="actions && actions.length > 0"
        class="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <UButton
          v-for="action in actions"
          :key="action.label"
          :color="action.color || 'primary'"
          :variant="action.variant || 'solid'"
          :size="action.size || 'md'"
          :loading="action.loading"
          :disabled="action.disabled"
          class="w-full sm:w-auto"
          @click="action.click"
        >
          <Icon
            v-if="action.icon"
            :name="action.icon"
            class="w-4 h-4 mr-2"
          />
          {{ action.label }}
        </UButton>
      </div>
      
      <!-- Additional Info -->
      <div
        v-if="additionalInfo"
        class="mt-6 text-sm text-gray-500 dark:text-gray-400"
      >
        <p>{{ additionalInfo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EmptyStateAction {
  label: string
  click: () => void
  color?: 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'success' | 'neutral'
  variant?: 'link' | 'ghost' | 'solid' | 'outline' | 'soft' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  loading?: boolean
  disabled?: boolean
}

interface Props {
  title: string
  description: string
  icon?: string
  actions?: EmptyStateAction[]
  additionalInfo?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-heroicons-inbox',
  actions: () => []
})
</script>

<style scoped>
.empty-state {
  transition: all 0.3s;
}
</style>
