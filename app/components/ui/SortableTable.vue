<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            :class="{ 'bg-gray-100 dark:bg-gray-600': sortBy === column.key }"
            @click="handleSort(column.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <div class="flex flex-col">
                <Icon
                  name="i-heroicons-chevron-up"
                  class="w-3 h-3"
                  :class="{
                    'text-gray-900 dark:text-white':
                      sortBy === column.key && sortOrder === 'asc',
                    'text-gray-400 dark:text-gray-500':
                      sortBy !== column.key ?? sortOrder !== 'asc',
                  }"
                />
                <Icon
                  name="i-heroicons-chevron-down"
                  class="w-3 h-3 -mt-1"
                  :class="{
                    'text-gray-900 dark:text-white':
                      sortBy === column.key && sortOrder === 'desc',
                    'text-gray-400 dark:text-gray-500':
                      sortBy !== column.key ?? sortOrder !== 'desc',
                  }"
                />
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
      >
        <slot :sorted-data="sortedData" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">

export interface SortableColumn {
  key: string
  label: string
  sortable?: boolean
  sortFn?: (a: unknown, b: unknown) => number
}

interface Props {
  data: Record<string, unknown>[]
  columns: SortableColumn[]
  defaultSort?: string
  defaultOrder?: 'asc' | 'desc'
}

const props = withDefaults(defineProps<Props>(), {
  defaultSort: '',
  defaultOrder: 'asc',
})

const emit = defineEmits<{
  sort: [sortBy: string, sortOrder: 'asc' | 'desc']
}>()

const sortBy = ref(props.defaultSort)
const sortOrder = ref<'asc' | 'desc'>(props.defaultOrder)

const sortedData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  if (!sortBy.value) return props.data

  const column = props.columns.find((col) => col.key === sortBy.value)
  if (!column) return props.data

  return [...props.data].sort((a, b) => {
    let result = 0

    if (column.sortFn) {
      result = column.sortFn(a, b)
    } else {
      const aVal = getNestedValue(a, column.key)
      const bVal = getNestedValue(b, column.key)

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        result = aVal.localeCompare(bVal)
      } else if (aVal instanceof Date && bVal instanceof Date) {
        result = aVal.getTime() - bVal.getTime()
      } else {
        result = aVal < bVal ? -1 : 1
      }
    }

    return sortOrder.value === 'desc' ? -result : result
  })
})

const handleSort = (key: string) => {
  const column = props.columns.find((col) => col.key === key)
  if (!column || column.sortable === false) return

  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }

  emit('sort', sortBy.value, sortOrder.value)
}

const getNestedValue = (obj: Record<string, unknown>, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
</script>
