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
  type?: 'error' | 'warning' | 'info' | 'success'
  title?: string
  description?: string
  variant?: 'soft' | 'solid' | 'outline'
  showIcon?: boolean
  dismissible?: boolean
  actions?: Array<{
    label: string
    click: () => void
    color?: 'error' | 'warning' | 'info' | 'success' | 'primary' | 'secondary' | 'neutral'
    variant?: 'soft' | 'solid' | 'outline' | 'link' | 'subtle' | 'ghost'
  }>
}

const { type = 'error', title = '', description = '', variant = 'soft', showIcon = true, dismissible = false, actions = [] } = defineProps<Props>()

const alertColor = computed(() => {
  switch (type) {
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    case 'success': return 'success'
    default: return 'error'
  }
})

const icon = computed(() => {
  if (!showIcon) return undefined
  
  switch (type) {
    case 'error': return 'i-heroicons-exclamation-triangle'
    case 'warning': return 'i-heroicons-exclamation-circle'
    case 'info': return 'i-heroicons-information-circle'
    case 'success': return 'i-heroicons-check-circle'
    default: return 'i-heroicons-exclamation-triangle'
  }
})

const ui = computed(() => {
  const colorMap = {
    error: {
      shadow: 'rgba(239,68,68,0.2)',
      hoverShadow: 'rgba(239,68,68,0.3)',
      bgFrom: 'from-red-50',
      bgTo: 'to-pink-50',
      darkFrom: 'dark:from-red-900/20',
      darkTo: 'dark:to-pink-900/20',
      border: 'border-red-200',
      darkBorder: 'dark:border-red-700',
      hoverBg: 'from-red-400/10 to-pink-400/10'
    },
    warning: {
      shadow: 'rgba(245,158,11,0.2)',
      hoverShadow: 'rgba(245,158,11,0.3)',
      bgFrom: 'from-yellow-50',
      bgTo: 'to-orange-50',
      darkFrom: 'dark:from-yellow-900/20',
      darkTo: 'dark:to-orange-900/20',
      border: 'border-yellow-200',
      darkBorder: 'dark:border-yellow-700',
      hoverBg: 'from-yellow-400/10 to-orange-400/10'
    },
    info: {
      shadow: 'rgba(59,130,246,0.2)',
      hoverShadow: 'rgba(59,130,246,0.3)',
      bgFrom: 'from-blue-50',
      bgTo: 'to-cyan-50',
      darkFrom: 'dark:from-blue-900/20',
      darkTo: 'dark:to-cyan-900/20',
      border: 'border-blue-200',
      darkBorder: 'dark:border-blue-700',
      hoverBg: 'from-blue-400/10 to-cyan-400/10'
    },
    success: {
      shadow: 'rgba(34,197,94,0.2)',
      hoverShadow: 'rgba(34,197,94,0.3)',
      bgFrom: 'from-green-50',
      bgTo: 'to-emerald-50',
      darkFrom: 'dark:from-green-900/20',
      darkTo: 'dark:to-emerald-900/20',
      border: 'border-green-200',
      darkBorder: 'dark:border-green-700',
      hoverBg: 'from-green-400/10 to-emerald-400/10'
    }
  }
  
  const colors = colorMap[alertColor.value] || colorMap.error
  
  const colorClasses = {
    error: {
      icon: 'bg-red-500',
      title: 'text-red-800 dark:text-red-200',
      description: 'text-red-700 dark:text-red-300'
    },
    warning: {
      icon: 'bg-yellow-500',
      title: 'text-yellow-800 dark:text-yellow-200',
      description: 'text-yellow-700 dark:text-yellow-300'
    },
    info: {
      icon: 'bg-blue-500',
      title: 'text-blue-800 dark:text-blue-200',
      description: 'text-blue-700 dark:text-blue-300'
    },
    success: {
      icon: 'bg-green-500',
      title: 'text-green-800 dark:text-green-200',
      description: 'text-green-700 dark:text-green-300'
    }
  }
  
  const currentColor = colorClasses[alertColor.value] || colorClasses.error
  
  return {
    wrapper: `group relative rounded-2xl border-2 shadow-[0_8px_32px_0_${colors.shadow}] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_12px_40px_0_${colors.hoverShadow}] hover:scale-[1.02] bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} ${colors.darkFrom} ${colors.darkTo} ${colors.border} ${colors.darkBorder} overflow-hidden`,
    container: 'flex p-6 relative z-10',
    icon: `flex-shrink-0 w-8 h-8 ${currentColor.icon} rounded-full flex items-center justify-center mr-4 shadow-[0_4px_12px_${colors.shadow}]`,
    title: `text-lg font-bold ${currentColor.title} mb-2`,
    description: `${currentColor.description} opacity-90`,
    actions: 'mt-2 flex space-x-2'
  }
})
</script>

<style scoped>
.error-alert {
  transition: all 0.2s;
}

.error-alert:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>