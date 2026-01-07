<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :to="to"
    :href="href"
    :target="target"
    v-bind="$attrs"
  >
    <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
    <Icon v-if="icon" :name="icon" :class="iconClass" />
    <slot name="icon" />
    <span v-if="$slots.default" :class="gapClasses">
      <slot />
    </span>
    <slot name="trailing" />
  </component>
</template>

<script setup lang="ts">
interface Props {
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'neutral';
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  to?: string;
  href?: string;
  target?: string;
  icon?: string;
  block?: boolean;
}

const {
  color = 'primary',
  variant = 'solid',
  size = 'md',
  disabled = false,
  loading = false,
  block = false,
  to = undefined,
  href = undefined,
  target = undefined,
  icon = undefined,
} = defineProps<Props>();

const tag = computed(() => {
  if (to) return 'NuxtLink';
  if (href) return 'a';
  return 'button';
});

const buttonClasses = computed(() => {
  const baseClasses =
    'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 relative overflow-hidden group font-medium rounded-lg transition-all duration-200';

  // Size classes - more reasonable sizes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-sm px-5 py-2.5',
    xl: 'text-base px-6 py-3',
  };

  // Color and variant combinations - simplified and minimal
  const variantClasses = {
    primary: {
      solid:
        'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-blue-600 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-400/10',
      soft: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      ghost: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-400/10',
      link: 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline-offset-4 hover:underline',
    },
    success: {
      solid:
        'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-400/10',
      soft: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      ghost: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-400/10',
      link: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 underline-offset-4 hover:underline',
    },
    warning: {
      solid:
        'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-amber-600 text-amber-600 dark:text-amber-400 bg-transparent hover:bg-amber-50 dark:hover:bg-amber-400/10',
      soft: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30',
      ghost: 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10',
      link: 'text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 underline-offset-4 hover:underline',
    },
    error: {
      solid:
        'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-rose-600 text-rose-600 dark:text-rose-400 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-400/10',
      soft: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/30',
      ghost: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-400/10',
      link: 'text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 underline-offset-4 hover:underline',
    },
    info: {
      solid:
        'bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-transparent hover:bg-cyan-50 dark:hover:bg-cyan-400/10',
      soft: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
      ghost: 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-400/10',
      link: 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline-offset-4 hover:underline',
    },
    secondary: {
      solid:
        'bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-slate-600 text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-400/10',
      soft: 'bg-slate-50 dark:bg-slate-900/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/30',
      ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-400/10',
      link: 'text-slate-600 dark:text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 underline-offset-4 hover:underline',
    },
    neutral: {
      solid:
        'bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white shadow-sm hover:shadow-md',
      outline:
        'border border-gray-600 text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-400/10',
      soft: 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/30',
      ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-400/10',
      link: 'text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 underline-offset-4 hover:underline',
    },
  };

  const colorClasses = variantClasses[color] || variantClasses.primary;
  const variantClass = colorClasses[variant] || colorClasses.solid;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const blockClass = block ? 'w-full' : '';

  return `${baseClasses} ${variantClass} ${sizeClass} ${blockClass}`;
});

const iconClass = computed(() => {
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  return iconSizes[size] || iconSizes.md;
});

const gapClasses = computed(() => {
  const gapSizes = {
    xs: 'gap-x-1.5',
    sm: 'gap-x-2',
    md: 'gap-x-2.5',
    lg: 'gap-x-3',
    xl: 'gap-x-3',
  };
  return gapSizes[size] || gapSizes.md;
});
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>
