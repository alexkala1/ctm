<template>
  <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <div class="flex justify-between items-center">
        <div>
          <h3
            class="text-lg leading-6 font-medium text-gray-900 dark:text-white"
          >
            Users
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {{ users.length }} registered users
          </p>
        </div>
        <div class="flex space-x-2">
          <UButton color="primary" size="sm" @click="$emit('add-user')">
            <Icon name="i-heroicons-plus" class="w-6 h-6 mr-1" />
            Add User
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UInput
          v-model="filters.search"
          placeholder="Search by name or email..."
          icon="i-heroicons-magnifying-glass"
          @input="debouncedSearch"
        />
        <USelect
          v-model="filters.role"
          :items="roleOptions"
          placeholder="Filter by role"
          @change="handleFilterChange"
        />
        <USelect
          v-model="filters.status"
          :items="statusOptions"
          placeholder="Filter by status"
          @change="handleFilterChange"
        />
      </div>
    </div>

    <UTable
      :data="users || []"
      :columns="columns"
      :loading="loading"
      :empty="'No users found'"
    >
      <template #name-cell="{ row }">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <div
              class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
            >
              <span
                class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{
                  row.original.name?.charAt(0)?.toUpperCase() ||
                  row.original.email.charAt(0).toUpperCase()
                }}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ row.original.name || 'No name' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ row.original.email }}
            </div>
          </div>
        </div>
      </template>

      <template #role-cell="{ row }">
        <span
          :class="getRoleBadgeClass(row.original.role)"
          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
        >
          {{ row.original.role }}
        </span>
      </template>

      <template #createdAt-cell="{ row }">
        {{ formatDate(row.original.createdAt) }}
      </template>

      <template #updatedAt-cell="{ row }">
        {{ formatDate(row.original.updatedAt) }}
      </template>

      <template #actions-cell="{ row }">
        <div class="flex space-x-2">
          <UButton
            size="xs"
            variant="outline"
            @click="$emit('edit', row.original)"
          >
            Edit
          </UButton>
          <UButton
            v-if="row.original.role !== 'SUPER_ADMIN'"
            size="xs"
            color="error"
            variant="outline"
            @click="$emit('delete', row.original.id)"
          >
            Delete
          </UButton>
          <UButton
            v-if="row.original.role !== 'SUPER_ADMIN'"
            size="xs"
            color="primary"
            variant="outline"
            @click="$emit('change-role', row.original)"
          >
            Change Role
          </UButton>
        </div>
      </template>
    </UTable>

    <!-- Pagination -->
    <div
      v-if="pagination.totalPages > 1"
      class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <UButton
          :disabled="!pagination.hasPrev"
          variant="outline"
          size="sm"
          @click="$emit('change-page', pagination.page - 1)"
        >
          Previous
        </UButton>
        <UButton
          :disabled="!pagination.hasNext"
          variant="outline"
          size="sm"
          @click="$emit('change-page', pagination.page + 1)"
        >
          Next
        </UButton>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-medium">{{
              (pagination.page - 1) * pagination.limit + 1
            }}</span>
            to
            <span class="font-medium">{{
              Math.min(pagination.page * pagination.limit, pagination.total)
            }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <UButton
              :disabled="!pagination.hasPrev"
              variant="outline"
              size="sm"
              class="rounded-l-md"
              @click="$emit('change-page', pagination.page - 1)"
            >
              Previous
            </UButton>
            <UButton
              :disabled="!pagination.hasNext"
              variant="outline"
              size="sm"
              class="rounded-r-md"
              @click="$emit('change-page', pagination.page + 1)"
            >
              Next
            </UButton>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { UserWithDetails } from '../../../types'

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface Props {
  users: UserWithDetails[]
  loading?: boolean
  pagination: Pagination
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'add-user': []
  edit: [user: UserWithDetails]
  delete: [id: string]
  'change-role': [user: UserWithDetails]
  'change-page': [page: number]
  'filter-change': [filters: Record<string, unknown>]
  sort: [sortBy: string, sortOrder: 'asc' | 'desc']
}>()

const filters = ref({
  search: '',
  role: '',
  status: '',
})

const columns = [
  { accessorKey: 'name', header: 'User' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'createdAt', header: 'Created' },
  { accessorKey: 'updatedAt', header: 'Updated' },
  { accessorKey: 'actions', header: 'Actions' },
]


const roleOptions = [
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'User', value: 'USER' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 300)
}

const handleFilterChange = () => {
  emit('filter-change', { ...filters })
}


const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
    case 'ADMIN':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
    case 'USER':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }
}
</script>
