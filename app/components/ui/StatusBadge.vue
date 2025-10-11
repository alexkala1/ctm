<template>
  <UBadge
    :color="badgeColor"
    :variant="variant"
    :size="size"
    :ui="ui"
    class="status-badge"
  >
    <template v-if="showIcon" #leading>
      <Icon :name="statusIcon" class="w-4 h-4" />
    </template>
    {{ statusLabel }}
  </UBadge>
</template>

<script setup lang="ts">
interface StatusConfig {
  color: string
  icon: string
  label: string
}

interface Props {
  status: string
  variant?: 'solid' | 'soft' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'soft',
  size: 'sm',
  showIcon: true
})

const statusConfig = computed((): StatusConfig => {
  const statusMap = {
    // Tournament statuses
    'DRAFT': { color: 'secondary', icon: 'i-heroicons-pencil', label: 'Draft' } as StatusConfig,
    'OPEN': { color: 'info', icon: 'i-heroicons-lock-open', label: 'Open' } as StatusConfig,
    'IN_PROGRESS': { color: 'success', icon: 'i-heroicons-play', label: 'In Progress' } as StatusConfig,
    'FINISHED': { color: 'primary', icon: 'i-heroicons-check-circle', label: 'Finished' } as StatusConfig,
    'ACTIVE': { color: 'success', icon: 'i-heroicons-play', label: 'Active' } as StatusConfig,
    'COMPLETED': { color: 'primary', icon: 'i-heroicons-check-circle', label: 'Completed' } as StatusConfig,
    'CANCELLED': { color: 'error', icon: 'i-heroicons-x-circle', label: 'Cancelled' } as StatusConfig,
    
    // Participant statuses
    'PENDING': { color: 'warning', icon: 'i-heroicons-clock', label: 'Pending' } as StatusConfig,
    'APPROVED': { color: 'success', icon: 'i-heroicons-check-circle', label: 'Approved' } as StatusConfig,
    'REJECTED': { color: 'error', icon: 'i-heroicons-x-circle', label: 'Rejected' } as StatusConfig,
    
    // Gender
    'MALE': { color: 'primary', icon: 'i-heroicons-user', label: 'Male' } as StatusConfig,
    'FEMALE': { color: 'warning', icon: 'i-heroicons-user', label: 'Female' } as StatusConfig,
    
    // Default
    'UNKNOWN': { color: 'secondary', icon: 'i-heroicons-question-mark-circle', label: 'Unknown' } as StatusConfig
  } as const
  
  const status = props.status.toUpperCase()
  return statusMap[status as keyof typeof statusMap] ?? statusMap['UNKNOWN']
})

const badgeColor = computed((): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
  return statusConfig.value.color as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
})

const statusIcon = computed((): string => statusConfig.value.icon)
const statusLabel = computed((): string => statusConfig.value.label)

const ui = computed(() => {
  const originalColor = statusConfig.value.color
  return {
    base: 'inline-flex items-center font-medium',
    rounded: 'rounded-full',
    font: 'text-xs font-semibold',
    size: {
      xs: 'px-2 py-0.5 text-xs',
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-sm'
    },
    color: {
      [badgeColor.value]: {
        solid: `text-white dark:text-white bg-${originalColor}-500 dark:bg-${originalColor}-500`,
        soft: `text-${originalColor}-700 dark:text-${originalColor}-300 bg-${originalColor}-50 dark:bg-${originalColor}-900/20`,
        outline: `text-${originalColor}-700 dark:text-${originalColor}-300 ring-1 ring-${originalColor}-700 dark:ring-${originalColor}-300`
      }
    }
  }
})
</script>

<style scoped>
.status-badge {
  transition: all 0.2s ease-in-out;
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>
