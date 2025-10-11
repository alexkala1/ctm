<template>
  <UAlert
    :color="alertColor"
    :variant="variant"
    :icon="icon"
    :title="title"
    :description="description"
    :actions="actions"
    :ui="ui"
    class="error-alert"
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
  type?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  description?: string
  variant?: 'soft' | 'solid' | 'outline'
  showIcon?: boolean
  dismissible?: boolean
  actions?: Array<{
    label: string
    click: () => void
    color?: string
    variant?: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  title: '',
  description: '',
  variant: 'soft',
  showIcon: true,
  dismissible: false,
  actions: () => []
})

const alertColor = computed(() => {
  switch (props.type) {
    case 'error': return 'red'
    case 'warning': return 'yellow'
    case 'info': return 'blue'
    case 'success': return 'green'
    default: return 'red'
  }
})

const icon = computed(() => {
  if (!props.showIcon) return undefined
  
  switch (props.type) {
    case 'error': return 'i-heroicons-exclamation-triangle'
    case 'warning': return 'i-heroicons-exclamation-circle'
    case 'info': return 'i-heroicons-information-circle'
    case 'success': return 'i-heroicons-check-circle'
    default: return 'i-heroicons-exclamation-triangle'
  }
})

const ui = computed(() => ({
  wrapper: 'rounded-lg border',
  container: 'flex',
  icon: {
    base: 'flex-shrink-0 w-5 h-5',
    color: alertColor.value
  },
  title: 'text-sm font-medium',
  description: 'mt-1 text-sm',
  actions: 'mt-2 flex space-x-2'
}))
</script>

<style scoped>
.error-alert {
  transition: all 0.2s ease-in-out;
}

.error-alert:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
