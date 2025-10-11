<template>
  <UButton
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :ui="ui"
    class="themed-button"
    v-bind="$attrs"
  >
    <template v-if="$slots.icon" #leading>
      <slot name="icon" />
    </template>
    
    <slot />
    
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
  </UButton>
</template>

<script setup lang="ts">
interface Props {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  disabled: false,
  loading: false
})

const ui = computed(() => ({
  base: 'focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75',
  font: 'font-semibold',
  rounded: 'rounded-lg',
  variant: {
    solid: `shadow-sm text-white dark:text-white bg-${props.color}-600 hover:bg-${props.color}-700 disabled:bg-${props.color}-600 dark:bg-${props.color}-500 dark:hover:bg-${props.color}-600 dark:disabled:bg-${props.color}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${props.color}-600 dark:focus-visible:outline-${props.color}-500`,
    outline: `ring-1 ring-inset ring-current text-${props.color}-600 dark:text-${props.color}-400 hover:bg-${props.color}-50 dark:hover:bg-${props.color}-400/10 focus-visible:ring-2 focus-visible:ring-${props.color}-600 dark:focus-visible:ring-${props.color}-400`,
    soft: `text-${props.color}-600 dark:text-${props.color}-400 bg-${props.color}-50 dark:bg-${props.color}-400/10 hover:bg-${props.color}-100 dark:hover:bg-${props.color}-400/20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${props.color}-600 dark:focus-visible:ring-${props.color}-400`,
    ghost: `text-${props.color}-600 dark:text-${props.color}-400 hover:bg-${props.color}-50 dark:hover:bg-${props.color}-400/10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${props.color}-600 dark:focus-visible:ring-${props.color}-400`,
    link: `text-${props.color}-600 dark:text-${props.color}-400 hover:text-${props.color}-500 dark:hover:text-${props.color}-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${props.color}-600 dark:focus-visible:ring-${props.color}-400`
  },
  size: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2.5 py-1.5',
    md: 'text-sm px-3 py-2',
    lg: 'text-sm px-4 py-2.5',
    xl: 'text-base px-6 py-3'
  },
  gap: {
    xs: 'gap-x-1',
    sm: 'gap-x-1.5',
    md: 'gap-x-1.5',
    lg: 'gap-x-2',
    xl: 'gap-x-2.5'
  }
}))
</script>

<style scoped>
.themed-button {
  transition: all 0.2s ease-in-out;
}

.themed-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.themed-button:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
