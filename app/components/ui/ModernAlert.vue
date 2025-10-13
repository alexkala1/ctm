<template>
  <div class="modern-alert">
    <!-- Hover Effect Background -->
    <div 
      class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      :class="hoverBgClass"
    />
    
    <!-- Main Alert Content -->
    <div class="flex p-6 relative z-10">
      <!-- Icon -->
      <div 
        v-if="showIcon"
        class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4"
        :class="iconClass"
      >
        <span class="text-white text-lg">{{ iconSymbol }}</span>
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <h3 
          v-if="title"
          class="text-lg font-bold mb-2"
          :class="titleClass"
        >
          {{ title }}
        </h3>
        <p 
          v-if="description"
          class="opacity-90"
          :class="descriptionClass"
        >
          {{ description }}
        </p>
        
        <!-- Actions -->
        <div 
          v-if="actions && actions.length > 0"
          class="mt-2 flex space-x-2"
        >
          <UButton
            v-for="action in actions"
            :key="action.label"
            :color="(action.color as any) || 'primary'"
            :variant="(action.variant as any) || 'solid'"
            :size="(action.size as any) || 'sm'"
            @click="action.click"
          >
            {{ action.label }}
          </UButton>
        </div>
        
        <!-- Default Slot -->
        <slot />
      </div>
      
      <!-- Dismiss Button -->
      <div
        v-if="dismissible"
        class="flex-shrink-0 ml-4"
      >
        <UButton
          variant="ghost"
          size="sm"
          :color="alertColor as any"
          icon="i-heroicons-x-mark"
          @click="$emit('dismiss')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AlertAction {
  label: string
  click: () => void
  color?: string
  variant?: string
  size?: string
}

interface Props {
  type?: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'neutral'
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link' | 'subtle'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xs'
  title?: string
  description?: string
  showIcon?: boolean
  dismissible?: boolean
  closable?: boolean
  actions?: AlertAction[]
  class?: string
}

interface Emits {
  (e: 'dismiss'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  variant: 'soft',
  size: 'md',
  title: '',
  description: '',
  showIcon: true,
  dismissible: false,
  closable: false,
  actions: () => [],
  class: ''
})

const _emit = defineEmits<Emits>()

const alertColor = computed(() => {
  switch (props.type) {
    case 'success': return 'green'
    case 'warning': return 'yellow'
    case 'error': return 'red'
    case 'info': return 'blue'
    case 'primary': return 'blue'
    case 'secondary': return 'gray'
    case 'neutral': return 'gray'
    default: return 'blue'
  }
})

const iconSymbol = computed(() => {
  switch (props.type) {
    case 'success': return '✓'
    case 'warning': return '⚠'
    case 'error': return '✕'
    case 'info': return 'ℹ'
    case 'primary': return 'ℹ'
    case 'secondary': return 'ℹ'
    case 'neutral': return 'ℹ'
    default: return 'ℹ'
  }
})

const _wrapperClass = computed(() => {
  const colorMap = {
    green: {
      shadow: 'rgba(34,197,94,0.2)',
      hoverShadow: 'rgba(34,197,94,0.3)',
      bgFrom: 'from-green-50',
      bgTo: 'to-emerald-50',
      darkFrom: 'dark:from-green-900/20',
      darkTo: 'dark:to-emerald-900/20',
      border: 'border-green-200',
      darkBorder: 'dark:border-green-700'
    },
    yellow: {
      shadow: 'rgba(245,158,11,0.2)',
      hoverShadow: 'rgba(245,158,11,0.3)',
      bgFrom: 'from-yellow-50',
      bgTo: 'to-orange-50',
      darkFrom: 'dark:from-yellow-900/20',
      darkTo: 'dark:to-orange-900/20',
      border: 'border-yellow-200',
      darkBorder: 'dark:border-yellow-700'
    },
    red: {
      shadow: 'rgba(239,68,68,0.2)',
      hoverShadow: 'rgba(239,68,68,0.3)',
      bgFrom: 'from-red-50',
      bgTo: 'to-pink-50',
      darkFrom: 'dark:from-red-900/20',
      darkTo: 'dark:to-pink-900/20',
      border: 'border-red-200',
      darkBorder: 'dark:border-red-700'
    },
    blue: {
      shadow: 'rgba(59,130,246,0.2)',
      hoverShadow: 'rgba(59,130,246,0.3)',
      bgFrom: 'from-blue-50',
      bgTo: 'to-cyan-50',
      darkFrom: 'dark:from-blue-900/20',
      darkTo: 'dark:to-cyan-900/20',
      border: 'border-blue-200',
      darkBorder: 'dark:border-blue-700'
    },
    gray: {
      shadow: 'rgba(107,114,128,0.2)',
      hoverShadow: 'rgba(107,114,128,0.3)',
      bgFrom: 'from-gray-50',
      bgTo: 'to-slate-50',
      darkFrom: 'dark:from-gray-900/20',
      darkTo: 'dark:to-slate-900/20',
      border: 'border-gray-200',
      darkBorder: 'dark:border-gray-700'
    }
  }
  
  const colors = colorMap[alertColor.value]
  
  return `group relative rounded-2xl border-2 shadow-[0_8px_32px_0_${colors.shadow}] backdrop-blur-sm transition-all duration-200 hover:shadow-[0_12px_40px_0_${colors.hoverShadow}] hover:scale-[1.02] bg-gradient-to-r ${colors.bgFrom} ${colors.bgTo} ${colors.darkFrom} ${colors.darkTo} ${colors.border} ${colors.darkBorder} overflow-hidden`
})

const hoverBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'from-green-400/10 to-emerald-400/10'
    case 'warning': return 'from-yellow-400/10 to-orange-400/10'
    case 'error': return 'from-red-400/10 to-pink-400/10'
    case 'info': return 'from-blue-400/10 to-cyan-400/10'
    case 'primary': return 'from-blue-400/10 to-cyan-400/10'
    case 'secondary': return 'from-gray-400/10 to-slate-400/10'
    case 'neutral': return 'from-gray-400/10 to-slate-400/10'
    default: return 'from-blue-400/10 to-cyan-400/10'
  }
})

const iconClass = computed(() => {
  const colorMap = {
    green: 'bg-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.3)]',
    yellow: 'bg-yellow-500 shadow-[0_4px_12px_rgba(245,158,11,0.3)]',
    red: 'bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]',
    blue: 'bg-blue-500 shadow-[0_4px_12px_rgba(59,130,246,0.3)]',
    gray: 'bg-gray-500 shadow-[0_4px_12px_rgba(107,114,128,0.3)]'
  }
  return colorMap[alertColor.value as keyof typeof colorMap] || colorMap.blue
})

const titleClass = computed(() => {
  const colorMap = {
    green: 'text-green-800 dark:text-green-200',
    yellow: 'text-yellow-800 dark:text-yellow-200',
    red: 'text-red-800 dark:text-red-200',
    blue: 'text-blue-800 dark:text-blue-200',
    gray: 'text-gray-800 dark:text-gray-200'
  }
  return colorMap[alertColor.value as keyof typeof colorMap] || colorMap.blue
})

const descriptionClass = computed(() => {
  const colorMap = {
    green: 'text-green-700 dark:text-green-300',
    yellow: 'text-yellow-700 dark:text-yellow-300',
    red: 'text-red-700 dark:text-red-300',
    blue: 'text-blue-700 dark:text-blue-300',
    gray: 'text-gray-700 dark:text-gray-300'
  }
  return colorMap[alertColor.value as keyof typeof colorMap] || colorMap.blue
})
</script>

<style scoped>
.modern-alert {
  @apply transition-all duration-200;
}

.modern-alert:hover {
  transform: scale(1.02);
}
</style>
