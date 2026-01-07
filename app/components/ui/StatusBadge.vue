<template>
  <div :class="badgeClasses" class="status-badge">
    <div v-if="showIcon" class="badge-icon">
      <slot name="icon">
        <span class="text-xs">{{ statusIcon }}</span>
      </slot>
    </div>
    <span class="badge-text">
      <slot>{{ statusLabel }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface StatusConfig {
  color: string;
  icon: string;
  label: string;
}

interface Props {
  status: string;
  variant?: 'solid' | 'soft' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const { variant = 'soft', size = 'sm', showIcon = true, status } = defineProps<Props>();

const statusConfig = computed((): StatusConfig => {
  const statusMap = {
    // Tournament statuses - Enhanced colors for better distinction
    DRAFT: { color: 'amber', icon: '✏️', label: 'Draft' } as StatusConfig,
    OPEN: { color: 'emerald', icon: '🔓', label: 'Open' } as StatusConfig,
    IN_PROGRESS: { color: 'blue', icon: '⟳', label: 'In Progress' } as StatusConfig,
    FINISHED: { color: 'violet', icon: '🏆', label: 'Finished' } as StatusConfig,
    ACTIVE: { color: 'emerald', icon: '▶️', label: 'Active' } as StatusConfig,
    COMPLETED: { color: 'violet', icon: '✅', label: 'Completed' } as StatusConfig,
    CANCELLED: { color: 'rose', icon: '❌', label: 'Cancelled' } as StatusConfig,

    // Participant statuses - More vibrant colors
    PENDING: { color: 'amber', icon: '⏰', label: 'Pending' } as StatusConfig,
    APPROVED: { color: 'emerald', icon: '✓', label: 'Approved' } as StatusConfig,
    REJECTED: { color: 'rose', icon: '✕', label: 'Rejected' } as StatusConfig,

    // Gender - Distinct colors
    MALE: { color: 'blue', icon: '👤', label: 'Male' } as StatusConfig,
    FEMALE: { color: 'pink', icon: '👤', label: 'Female' } as StatusConfig,

    // Default
    UNKNOWN: { color: 'slate', icon: '❓', label: 'Unknown' } as StatusConfig,
  } as const;

  // Handle special cases for lowercase variants used in ui-demo
  if (status.toUpperCase() === 'IN-PROGRESS') {
    return statusMap['IN_PROGRESS'];
  }

  return statusMap[status as keyof typeof statusMap] ?? statusMap['UNKNOWN'];
});

const statusIcon = computed((): string => statusConfig.value.icon);
const statusLabel = computed((): string => statusConfig.value.label);

const sizeClasses = computed(() => ({
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2 text-xs',
  lg: 'px-4 py-2.5 text-sm',
}));

const variantClasses = computed(() => {
  const color = statusConfig.value.color;

  // Define color-specific classes for better Tailwind generation
  const colorClasses = {
    solid: {
      amber:
        'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-600 dark:via-amber-700 dark:to-amber-800',
      emerald:
        'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 dark:from-emerald-600 dark:via-emerald-700 dark:to-emerald-800',
      rose: 'bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 dark:from-rose-600 dark:via-rose-700 dark:to-rose-800',
      violet:
        'bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 dark:from-violet-600 dark:via-violet-700 dark:to-violet-800',
      blue: 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-blue-700 dark:to-blue-800',
      pink: 'bg-gradient-to-r from-pink-600 via-pink-700 to-pink-800 dark:from-pink-700 dark:via-pink-800 dark:to-pink-900',
      slate:
        'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800',
    },
    soft: {
      amber:
        'bg-gradient-to-r from-amber-100 via-amber-200 to-amber-300 dark:from-amber-800/50 dark:via-amber-700/40 dark:to-amber-600/30 text-amber-900 dark:text-amber-100 border-amber-300/70 dark:border-amber-500/50',
      emerald:
        'bg-gradient-to-r from-emerald-100 via-emerald-200 to-emerald-300 dark:from-emerald-800/50 dark:via-emerald-700/40 dark:to-emerald-600/30 text-emerald-900 dark:text-emerald-100 border-emerald-300/70 dark:border-emerald-500/50',
      rose: 'bg-gradient-to-r from-rose-100 via-rose-200 to-rose-300 dark:from-rose-800/50 dark:via-rose-700/40 dark:to-rose-600/30 text-rose-900 dark:text-rose-100 border-rose-300/70 dark:border-rose-500/50',
      violet:
        'bg-gradient-to-r from-violet-100 via-violet-200 to-violet-300 dark:from-violet-800/50 dark:via-violet-700/40 dark:to-violet-600/30 text-violet-900 dark:text-violet-100 border-violet-300/70 dark:border-violet-500/50',
      blue: 'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 dark:from-blue-800/50 dark:via-blue-700/40 dark:to-blue-600/30 text-blue-900 dark:text-blue-100 border-blue-300/70 dark:border-blue-500/50',
      pink: 'bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 dark:from-pink-700/60 dark:via-pink-600/50 dark:to-pink-500/40 text-pink-900 dark:text-pink-100 border-pink-400/80 dark:border-pink-600/70',
      slate:
        'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 dark:from-slate-800/50 dark:via-slate-700/40 dark:to-slate-600/30 text-slate-900 dark:text-slate-100 border-slate-300/70 dark:border-slate-500/50',
    },
    outline: {
      amber:
        'ring-2 ring-amber-400 dark:ring-amber-500 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/20 hover:ring-amber-500 dark:hover:ring-amber-400',
      emerald:
        'ring-2 ring-emerald-400 dark:ring-emerald-500 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-800/20 hover:ring-emerald-500 dark:hover:ring-emerald-400',
      rose: 'ring-2 ring-rose-400 dark:ring-rose-500 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-800/20 hover:ring-rose-500 dark:hover:ring-rose-400',
      violet:
        'ring-2 ring-violet-400 dark:ring-violet-500 text-violet-800 dark:text-violet-200 hover:bg-violet-100 dark:hover:bg-violet-800/20 hover:ring-violet-500 dark:hover:ring-violet-400',
      blue: 'ring-2 ring-blue-400 dark:ring-blue-500 text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/20 hover:ring-blue-500 dark:hover:ring-blue-400',
      pink: 'ring-2 ring-pink-500 dark:ring-pink-600 text-pink-900 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-700/30 hover:ring-pink-600 dark:hover:ring-pink-500',
      slate:
        'ring-2 ring-slate-400 dark:ring-slate-500 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/20 hover:ring-slate-500 dark:hover:ring-slate-400',
    },
  };

  return {
    solid: [
      colorClasses.solid[color as keyof typeof colorClasses.solid] || colorClasses.solid.slate,
      'text-white dark:text-white',
      'shadow-sm dark:shadow-md',
      'hover:shadow-md dark:hover:shadow-lg',
      'transition-all duration-200',
      'border border-white/20 dark:border-white/10',
    ],
    soft: [
      colorClasses.soft[color as keyof typeof colorClasses.soft] || colorClasses.soft.slate,
      'backdrop-blur-sm',
      'hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
      'hover:scale-[1.02]',
      'transition-all duration-200 ease-in-out',
    ],
    outline: [
      'bg-transparent',
      colorClasses.outline[color as keyof typeof colorClasses.outline] || colorClasses.outline.slate,
      'hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)]',
      'hover:scale-[1.02]',
      'transition-all duration-200 ease-in-out',
    ],
  };
});

const badgeClasses = computed(() => [
  'group relative inline-flex items-center rounded-full text-sm font-bold cursor-pointer',
  sizeClasses.value[size],
  ...variantClasses.value[variant],
]);
</script>

<style scoped>
.status-badge {
  transition: all 0.2s;
  position: relative;
}

.status-badge:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dark .status-badge:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.badge-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.status-badge[class*='solid'] .badge-icon {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .status-badge[class*='solid'] .badge-icon {
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.status-badge[class*='soft'] .badge-icon {
  background-color: currentColor;
  opacity: 0.2;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dark .status-badge[class*='soft'] .badge-icon {
  opacity: 0.3;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.status-badge[class*='outline'] .badge-icon {
  background-color: currentColor;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .status-badge[class*='outline'] .badge-icon {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.badge-text {
  font-weight: bold;
  position: relative;
  z-index: 10;
}
</style>
