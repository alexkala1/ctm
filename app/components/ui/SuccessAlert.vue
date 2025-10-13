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
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
    
    <template
      v-if="$slots.actions"
      #actions
    >
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
  wrapper: 'group relative rounded-2xl border-2 shadow-[0_8px_32px_0_rgba(34,197,94,0.2)] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_12px_40px_0_rgba(34,197,94,0.3)] hover:scale-[1.02] bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 overflow-hidden',
  container: 'flex p-6 relative z-10',
  icon: {
    base: 'flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 shadow-[0_4px_12px_rgba(34,197,94,0.3)]',
    color: 'green'
  },
  title: 'text-lg font-bold text-green-800 dark:text-green-200 mb-2',
  description: 'text-green-700 dark:text-green-300 opacity-90',
  actions: 'mt-2 flex space-x-2'
}))
</script>

<style scoped>
.success-alert {
  transition: all 0.2s;
}

.success-alert:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
