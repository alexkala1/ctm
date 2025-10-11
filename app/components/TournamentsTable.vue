<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-neutral-900 dark:text-white">
        Tournaments
      </h1>
      <p class="mt-2 text-neutral-600 dark:text-neutral-400">
        Discover and manage chess tournaments
      </p>
    </div>

    <!-- Sticky Search and Sort Bar -->
    <div
      class="sticky top-0 z-20 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-card backdrop-blur-sm bg-white/95 dark:bg-neutral-800/95"
      style="position: sticky; z-index: 20"
    >
      <!-- Search Input - Full Width -->
      <div class="mb-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search tournaments by name, status, or category..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          class="w-full"
          @update:model-value="handleSearch"
        />
      </div>

      <!-- Controls Row -->
      <div
        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
      >
        <!-- Filters Group -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Status Filter -->
          <USelect
            v-model="statusFilter"
            :items="statusOptions"
            value-key="value"
            placeholder="All Statuses"
            class="w-full sm:w-40"
            @update:model-value="handleStatusFilter"
          />

          <!-- Sort Row -->
          <div class="flex gap-2">
            <USelect
              v-model="sortBy"
              :items="sortOptions"
              value-key="value"
              placeholder="Sort by"
              class="flex-1 sm:w-40"
              @update:model-value="handleSortChange"
            />

            <UButton
              :icon="
                sortOrder === 'asc'
                  ? 'i-heroicons-bars-arrow-up'
                  : 'i-heroicons-bars-arrow-down'
              "
              variant="outline"
              size="sm"
              class="flex-shrink-0"
              aria-label="Toggle sort order"
              @click="toggleSortOrder"
            />
          </div>
        </div>

        <!-- Create Button -->
        <div class="flex-shrink-0">
          <UButton
            v-if="isAdmin"
            color="primary"
            size="sm"
            class="w-full sm:w-auto"
            @click="showCreateModal = true"
          >
            <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1.5" />
            <span class="hidden sm:inline">Create Tournament</span>
            <span class="sm:hidden">Create</span>
          </UButton>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UModal
      v-model:open="showCreateModal"
      title="Create New Tournament"
      description="Set up a new chess tournament with all the necessary details."
      :ui="{
        wrapper: 'max-w-xl',
      }"
      @close="showCreateModal = false"
    >
      <template #body>
        <TournamentCreateModal
          @tournament-created="handleTournamentCreated"
          @close="showCreateModal = false"
        />
      </template>
    </UModal>

    <!-- Edit Tournament Modal -->
    <UModal
      v-model:open="showEditModal"
      title="Edit Tournament"
      description="Update tournament details and settings."
      :ui="{
        wrapper: 'max-w-4xl',
      }"
      @close="showEditModal = false"
    >
      <template #body>
        <TournamentEditModal
          v-if="selectedTournament"
          :tournament="selectedTournament"
          @tournament-updated="handleTournamentUpdated"
          @close="showEditModal = false"
        />
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="showDeleteConfirmation"
      title="Delete Tournament"
      description="This action will archive the tournament. It can be restored later if needed."
      :ui="{
        wrapper: 'max-w-md',
      }"
    >
      <template #body>
        <div class="flex items-start space-x-2">
          <Icon
            name="i-heroicons-exclamation-triangle"
            class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400">
            <strong>{{ tournamentToDelete?.name }}</strong> will be archived and
            removed from the active tournaments list.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton
            color="neutral"
            variant="outline"
            :disabled="isDeleting"
            @click="cancelDelete"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            <Icon
              v-if="!isDeleting"
              name="i-heroicons-trash"
              class="w-6 h-6 mr-2"
            />
            {{ isDeleting ? 'Deleting...' : 'Delete Tournament' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Empty States -->
    <div
      v-if="!props.tournaments || props.tournaments.length === 0"
      class="px-8 py-16 text-center"
    >
      <div class="mx-auto max-w-sm">
        <div
          class="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-trophy"
            class="h-8 w-8 text-gray-400 dark:text-gray-500"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No tournaments yet
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first chess tournament.
        </p>
        <div class="mt-6">
          <UButton
            v-if="isAdmin"
            color="primary"
            size="md"
            @click="openCreateModal"
          >
            <Icon name="i-heroicons-plus" class="w-6 h-6 mr-2" />
            Create Tournament
          </UButton>
        </div>
      </div>
    </div>

    <div
      v-else-if="filteredTournaments.length === 0"
      class="px-8 py-16 text-center"
    >
      <div class="mx-auto max-w-sm">
        <div
          class="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-magnifying-glass"
            class="h-8 w-8 text-gray-400 dark:text-gray-500"
          />
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No tournaments found
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search terms or create a new tournament.
        </p>
      </div>
    </div>

    <!-- Tournament Cards Grid -->
    <div v-else class="tournament-grid" style="position: relative; z-index: 0">
      <div
        v-for="tournament in filteredTournaments"
        :key="tournament.id"
        class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl transition-shadow duration-200 h-80 flex flex-col overflow-hidden shadow-card hover:shadow-card-hover relative z-10 group"
      >
        <!-- Card Header -->
        <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-800/50 dark:to-transparent">
          <div class="flex items-start justify-between mb-3">
            <h3
              class="text-lg font-bold text-neutral-900 dark:text-white line-clamp-2 flex-1 pr-3 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400"
              @click="navigateToTournament(tournament.id)"
            >
              {{ tournament.name }}
            </h3>
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 shadow-sm"
              :class="getStatusBadgeClass(tournament.status)"
            >
              <Icon
                :name="getStatusIcon(tournament.status)"
                class="w-3 h-3 mr-1.5"
              />
              {{ getStatusLabel(tournament.status) }}
            </span>
          </div>
          <div class="flex flex-wrap gap-1">
            <template v-if="!expandedCategories[tournament.id]">
              <span
                v-for="category in tournament.categories?.slice(0, 3)"
                :key="category"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              >
                {{ category }}
              </span>
              <span
                v-if="tournament.categories && tournament.categories.length > 3"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                @click="toggleCategories(tournament.id)"
              >
                +{{ tournament.categories.length - 3 }}
              </span>
            </template>
            <template v-else>
              <span
                v-for="category in tournament.categories"
                :key="category"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              >
                {{ category }}
              </span>
              <span
                v-if="tournament.categories && tournament.categories.length > 3"
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400 cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                @click="toggleCategories(tournament.id)"
              >
                Show less
              </span>
            </template>
          </div>
        </div>

        <!-- Card Content -->
        <div class="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-neutral-50/50 dark:to-neutral-800/30">
          <!-- Registration End Date -->
          <div class="mb-3">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center space-x-2">
                <Icon
                  name="i-heroicons-calendar-days"
                  class="w-6 h-6 text-gray-500 dark:text-gray-400"
                />
                <span class="text-gray-600 dark:text-gray-400 font-medium"
                  >Registration Ends</span
                >
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ formatDate(tournament.tournamentRegistrationEnd) }}
              </span>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-1 mb-3">
            <div
              v-if="tournament.proclamations"
              class="flex items-center space-x-2"
            >
              <Icon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-gray-500 dark:text-gray-400"
              />
              <a
                :href="tournament.proclamations"
                target="_blank"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
              >
                Proclamations
              </a>
            </div>
            <div
              v-if="tournament.chessResults"
              class="flex items-center space-x-2"
            >
              <Icon
                name="i-heroicons-trophy"
                class="w-6 h-6 text-gray-500 dark:text-gray-400"
              />
              <a
                :href="tournament.chessResults"
                target="_blank"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline"
              >
                Chess Results
              </a>
            </div>
            <div
              v-if="!tournament.proclamations && !tournament.chessResults"
              class="text-sm text-gray-500 dark:text-gray-400 italic"
            >
              No documents available
            </div>
          </div>

          <!-- Card Actions -->
          <div class="px-6 border-t border-neutral-200 dark:border-neutral-700">
            <div class="flex gap-2 items-center pt-3">
              <UButton
                :to="`/tournaments/${tournament.id}`"
                color="primary"
                variant="outline"
                size="sm"
                class="flex-1 flex items-center justify-center gap-2 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
              >
                <Icon name="i-heroicons-eye" class="w-4 h-4" />
                <span>View</span>
              </UButton>
              <UButton
                v-if="isAdmin"
                color="info"
                variant="outline"
                size="sm"
                class="flex-1 flex items-center justify-center gap-2 font-medium hover:bg-info-50 dark:hover:bg-info-900/20 transition-all duration-200"
                @click="openEditModal(tournament)"
              >
                <Icon name="i-heroicons-pencil" class="w-4 h-4" />
                <span>Edit</span>
              </UButton>
              <UButton
                v-if="isAdmin"
                color="error"
                variant="outline"
                size="sm"
                class="flex-1 flex items-center justify-center gap-2 font-medium hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-200"
                @click="handleDeleteTournament(tournament)"
              >
                <Icon name="i-heroicons-trash" class="w-4 h-4" />
                <span>Delete</span>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'
// Auto-imports: useUIStore (from Pinia)
// Components are auto-imported from app/components/
import type { TournamentApiResponse } from '../../types'

// Use navigateTo from Nuxt
const navigateTo = useRouter().push

// Notification store
const { addNotification } = useUIStore()

interface Props {
  tournaments: TournamentApiResponse[]
  isAdmin: boolean
}

const props = defineProps<Props>()

// Search state
const searchQuery = ref('')
const statusFilter = ref('all')

// Status filter options - dynamically set based on user role
const statusOptions = computed(() => {
  const baseOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
  ]
  
  // Only show Draft and Finished for admins
  if (props.isAdmin) {
    baseOptions.push(
      { label: 'Draft', value: 'DRAFT' },
      { label: 'Finished', value: 'FINISHED' }
    )
  }
  
  return baseOptions
})

// Sort state
const sortBy = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Categories expansion state
const expandedCategories = ref<Record<string, boolean>>({})

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedTournament = ref<TournamentApiResponse | null>(null)
const showDeleteConfirmation = ref(false)
const tournamentToDelete = ref<TournamentApiResponse | null>(null)
const isDeleting = ref(false)

// Sort options
const sortOptions = [
  { label: 'Most Recent', value: 'createdAt' },
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Registration End', value: 'tournamentRegistrationEnd' },
  { label: 'Tournament Start', value: 'tournamentStart' },
  { label: 'Status', value: 'status' },
  { label: 'Most Participants', value: 'competitors' },
]

// Handle search
const handleSearch = (value: string) => {
  searchQuery.value = value
}

// Handle status filter
const handleStatusFilter = (value: string) => {
  statusFilter.value = value
}

// Handle sort change
const handleSortChange = (value: string) => {
  sortBy.value = value
}

// Toggle sort order
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Toggle categories expansion
const toggleCategories = (tournamentId: string) => {
  expandedCategories.value[tournamentId] =
    !expandedCategories.value[tournamentId]
}

// Navigate to tournament page
const navigateToTournament = (tournamentId: string) => {
  navigateTo(`/tournaments/${tournamentId}`)
}

// Computed property for filtered and sorted tournaments
const filteredTournaments = computed(() => {
  let tournaments = props.tournaments || []

  // Apply search filter
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    tournaments = tournaments.filter(
      (tournament) =>
        tournament.name.toLowerCase().includes(query) ||
        tournament.status.toLowerCase().includes(query) ||
        tournament.categories?.some((cat: string) =>
          cat.toLowerCase().includes(query)
        ) ||
        tournament.creator?.name?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value && statusFilter.value !== 'all') {
    tournaments = tournaments.filter(
      (tournament) => tournament.status === statusFilter.value
    )
  }

  // Apply sorting
  return tournaments.sort((a, b) => {
    const aValue = a[sortBy.value as keyof TournamentApiResponse]
    const bValue = b[sortBy.value as keyof TournamentApiResponse]

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return sortOrder.value === 'asc' ? 1 : -1
    if (bValue == null) return sortOrder.value === 'asc' ? -1 : 1

    // Get comparable values based on the sort field
    let aComparable: string | number
    let bComparable: string | number

    // Handle date sorting
    if (
      sortBy.value === 'createdAt' ||
      sortBy.value === 'tournamentStart' ||
      sortBy.value === 'tournamentRegistrationEnd'
    ) {
      aComparable = new Date(aValue as string).getTime()
      bComparable = new Date(bValue as string).getTime()
    }
    // Handle array sorting (competitors)
    else if (Array.isArray(aValue) && Array.isArray(bValue)) {
      aComparable = aValue.length
      bComparable = bValue.length
    }
    // Handle string sorting (case insensitive)
    else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aComparable = aValue.toLowerCase()
      bComparable = bValue.toLowerCase()
    }
    // Handle number sorting
    else if (typeof aValue === 'number' && typeof bValue === 'number') {
      aComparable = aValue
      bComparable = bValue
    }
    // Handle boolean sorting
    else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      aComparable = aValue ? 1 : 0
      bComparable = bValue ? 1 : 0
    }
    // Handle object sorting (creator name)
    else if (
      sortBy.value === 'creator' &&
      aValue &&
      bValue &&
      typeof aValue === 'object' &&
      typeof bValue === 'object'
    ) {
      const aCreator = aValue as { name?: string | null }
      const bCreator = bValue as { name?: string | null }
      aComparable = (aCreator.name || '').toLowerCase()
      bComparable = (bCreator.name || '').toLowerCase()
    }
    // Fallback to string conversion
    else {
      aComparable = String(aValue).toLowerCase()
      bComparable = String(bValue).toLowerCase()
    }

    if (aComparable < bComparable) return sortOrder.value === 'asc' ? -1 : 1
    if (aComparable > bComparable) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'Draft'
    case 'OPEN':
      return 'Open'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'FINISHED':
      return 'Finished'
    default:
      return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'i-heroicons-pencil'
    case 'OPEN':
      return 'i-heroicons-check-circle'
    case 'IN_PROGRESS':
      return 'i-heroicons-play'
    case 'FINISHED':
      return 'i-heroicons-trophy'
    default:
      return 'i-heroicons-question-mark-circle'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300'
    case 'OPEN':
      return 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
    case 'IN_PROGRESS':
      return 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300'
    case 'FINISHED':
      return 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300'
    default:
      return 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-300'
  }
}

// Modal methods
const openCreateModal = () => {
  showCreateModal.value = true
}

const handleTournamentCreated = (tournament: TournamentApiResponse) => {
  if (process.env.NODE_ENV === 'development')
    console.log('Tournament created:', tournament)

  // Show success notification
  addNotification({
    title: 'Tournament Created',
    message: `"${tournament.name}" has been successfully created.`,
    type: 'success',
  })

  // Emit event to parent to refresh the tournaments list
  emit('tournament-created', tournament)
  showCreateModal.value = false
}

const openEditModal = (tournament: TournamentApiResponse) => {
  selectedTournament.value = tournament
  showEditModal.value = true
}

const handleTournamentUpdated = (tournament: TournamentApiResponse) => {
  if (process.env.NODE_ENV === 'development')
    console.log('Tournament updated:', tournament)

  // Show success notification
  addNotification({
    title: 'Tournament Updated',
    message: `"${tournament.name}" has been successfully updated.`,
    type: 'success',
  })

  // Emit event to parent to refresh the tournaments list
  emit('tournament-updated', tournament)
  showEditModal.value = false
  selectedTournament.value = null
}

const handleDeleteTournament = async (tournament: TournamentApiResponse) => {
  showDeleteConfirmation.value = true
  tournamentToDelete.value = tournament
}

const confirmDelete = async () => {
  if (!tournamentToDelete.value) return

  const tournamentName = tournamentToDelete.value.name
  isDeleting.value = true

  try {
    const response = await $fetch<{ success: boolean }>(
      `/api/tournaments/${tournamentToDelete.value.id}`,
      {
        method: 'DELETE',
      }
    )

    if (response.success) {
      // Show success notification
      addNotification({
        title: 'Tournament Deleted',
        message: `"${tournamentName}" has been successfully deleted.`,
        type: 'success',
      })

      emit('tournament-deleted', tournamentToDelete.value.id)
      showDeleteConfirmation.value = false
      tournamentToDelete.value = null
    } else {
      throw new Error('Failed to delete tournament')
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development')
      console.error('Error deleting tournament:', error)

    // Show error notification
    addNotification({
      title: 'Delete Failed',
      message: `Failed to delete "${tournamentName}". Please try again.`,
      type: 'error',
    })
  } finally {
    isDeleting.value = false
  }
}

const cancelDelete = () => {
  showDeleteConfirmation.value = false
  tournamentToDelete.value = null
}

// Emits
const emit = defineEmits<{
  'tournament-created': [tournament: TournamentApiResponse]
  'tournament-updated': [tournament: TournamentApiResponse]
  'tournament-deleted': [tournamentId: string]
}>()
</script>

<style scoped>
.tournament-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .tournament-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .tournament-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (min-width: 1025px) and (max-width: 1280px) {
  .tournament-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (min-width: 1281px) {
  .tournament-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}

/* Fix dropdown menu width constraints */
:deep([data-headlessui-state]) {
  min-width: max-content !important;
}

:deep([role='listbox']) {
  min-width: max-content !important;
  width: max-content !important;
}

:deep([role='option']) {
  white-space: nowrap !important;
}
</style>
