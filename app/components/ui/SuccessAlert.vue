<template>
  <UAlert
    color="green"
    :variant="variant"
    icon="i-heroicons-check-circle"
    :title="title"
    :description="description"
    :actions="actions"
    :ui="ui"
    class="success-alert"
  >
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  variant?: 'soft' | 'solid' | 'outline'
  dismissible?: boolean
  actions?: Array<{
    label: string
    click: () => void
    color?: string
    variant?: string
  }>
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  variant: 'soft',
  dismissible: false,
  actions: () => []
})

const ui = computed(() => ({
  wrapper: 'rounded-lg border border-green-200 dark:border-green-800',
  container: 'flex',
  icon: {
    base: 'flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400',
    color: 'green'
  },
  title: 'text-sm font-medium text-green-800 dark:text-green-200',
  description: 'mt-1 text-sm text-green-700 dark:text-green-300',
  actions: 'mt-2 flex space-x-2'
}))
</script>

<style scoped>
.success-alert {
  transition: all 0.2s ease-in-out;
}

.success-alert:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
