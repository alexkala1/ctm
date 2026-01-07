<template>
  <div :class="cardClasses" class="modern-card">
    <div v-if="$slots.header" class="modern-card-header">
      <slot name="header" />
    </div>

    <div class="modern-card-content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="modern-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'glass' | 'neumorphism' | 'gradient' | 'solid';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
}

const { variant = 'glass', color = 'primary', size = 'md', hover = true, interactive = false } = defineProps<Props>();

const cardClasses = computed(() => {
  const baseClasses = [
    'relative overflow-hidden transition-all duration-300',
    'border border-white/20 dark:border-white/10',
  ];

  // Size classes
  const sizeClasses = {
    sm: 'p-4 rounded-lg',
    md: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl',
    xl: 'p-10 rounded-3xl',
  };

  // Variant classes
  const variantClasses = {
    glass: [
      'bg-white/80 dark:bg-black/20',
      'backdrop-blur-[20px]',
      'shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
      'border border-gray-200/50 dark:border-white/20',
      'text-black dark:text-white',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-50/50 before:to-transparent before:dark:from-white/10 before:dark:to-transparent before:opacity-50',
    ],
    neumorphism: [
      'bg-gray-100 dark:bg-gray-800',
      'text-gray-800 dark:text-gray-200',
      '[&>*]:text-gray-800 dark:[&>*]:text-gray-200',
      'shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.1)]',
      'dark:shadow-[2px_2px_8px_rgba(0,0,0,0.3),-2px_-2px_8px_rgba(255,255,255,0.05)]',
      'hover:shadow-[4px_4px_12px_rgba(0,0,0,0.15),-4px_-4px_12px_rgba(255,255,255,0.15)]',
    ],
    gradient: [
      `bg-gradient-to-br from-${color}-400 via-${color}-500 to-${color}-600`,
      'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]',
      'text-white',
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent',
    ],
    solid: [
      `bg-gradient-to-r from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20`,
      `text-${color}-800 dark:text-${color}-200`,
      `[&>*]:text-${color}-800 dark:[&>*]:text-${color}-200`,
      'border border-current',
      'shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)]',
      'backdrop-blur-sm',
    ],
  };

  // Interactive classes
  const interactiveClasses = interactive
    ? ['cursor-pointer', 'transition-all duration-200', 'hover:scale-[1.02]', 'active:scale-[0.98]']
    : [];

  // Hover classes
  const hoverClasses = hover
    ? [
        'transition-all duration-200',
        'hover:shadow-[0_8px_32px_-5px_rgba(0,0,0,0.15)]',
        'hover:backdrop-blur-[25px]',
        'hover:-translate-y-1',
      ]
    : [];

  return [...baseClasses, sizeClasses[size], ...variantClasses[variant], ...interactiveClasses, ...hoverClasses].join(
    ' '
  );
});
</script>

<style scoped>
.modern-card {
  position: relative;
  transition: all 0.2s;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.modern-card-header {
  position: relative;
  z-index: 10;
  margin-bottom: 1rem;
  color: inherit;
}

.modern-card-content {
  position: relative;
  z-index: 10;
  color: inherit;
}

.modern-card-footer {
  position: relative;
  z-index: 10;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
}

/* Force text color for glass variant in light theme */
.modern-card.glass {
  color: #000000 !important;
}

.modern-card.glass * {
  color: #000000 !important;
}

.dark .modern-card.glass {
  color: #ffffff !important;
}

.dark .modern-card.glass * {
  color: #ffffff !important;
}

.dark .modern-card-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

/* Glassmorphism animation */
.modern-card:hover {
  transform: translateY(-2px);
}

/* Neumorphism animation */
.modern-card.neumorphism:hover {
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.15),
    -4px -4px 8px rgba(255, 255, 255, 0.15);
}

/* Gradient animation */
.modern-card.gradient:hover {
  background-size: 200% 200%;
  animation: gradient-shift 2s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
