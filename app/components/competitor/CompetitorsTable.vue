<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg w-full">
    <!-- Enhanced Filters -->
    <div class="px-6 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="space-y-6">
        <!-- Search and Action Buttons Row -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1">
            <UInput
              v-model="filters.search"
              placeholder="Search participants by name..."
              icon="i-heroicons-magnifying-glass"
              size="md"
              class="w-full"
              @input="handleSearch"
            />
          </div>
          <div class="flex flex-shrink-0 gap-2">
            <!-- Import/Export Buttons (Admin only) -->
            <div v-if="isAuthenticated" class="flex gap-2">
              <UButton
                variant="soft"
                color="info"
                size="md"
                class="w-full sm:w-auto"
                @click="$emit('importParticipants')"
              >
                <Icon name="i-heroicons-arrow-up-tray" class="w-5 h-5 sm:mr-2" />
                <span class="hidden sm:inline">Import</span>
              </UButton>
              <UButton
                variant="soft"
                color="success"
                size="md"
                class="w-full sm:w-auto"
                @click="$emit('exportParticipants')"
              >
                <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5 sm:mr-2" />
                <span class="hidden sm:inline">Export</span>
              </UButton>
            </div>
            <UButton
              v-if="canAddParticipant"
              variant="solid"
              color="primary"
              size="md"
              class="w-full sm:w-auto"
              @click="$emit('addParticipant')"
            >
              <Icon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
              Add Participant
            </UButton>
          </div>
        </div>

        <!-- Filter Grid -->
        <div class="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-4">
          <!-- Category Filter -->
          <div class="space-y-2 flex-1 min-w-0">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Category
            </label>
            <USelect
              v-model="filters.category"
              :items="categoryOptions"
              value-key="value"
              placeholder="All Categories"
              size="md"
              class="w-full"
              @change="handleFilterChange"
            />
          </div>

          <!-- Gender Filter -->
          <div class="space-y-2 flex-1 min-w-0">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Gender
            </label>
            <USelect
              v-model="filters.gender"
              :items="genderOptions"
              value-key="value"
              placeholder="All Genders"
              size="md"
              class="w-full"
              @change="handleFilterChange"
            />
          </div>

          <!-- Status Filter (Admin only) -->
          <div v-if="isAuthenticated" class="space-y-2 flex-1 min-w-0">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Status
            </label>
            <USelect
              v-model="filters.status"
              :items="statusOptions"
              value-key="value"
              placeholder="All Statuses"
              size="md"
              class="w-full"
              @change="handleFilterChange"
            />
          </div>

          <!-- Team Filter -->
          <div v-if="showTeam" class="space-y-2 flex-1 min-w-0">
            <label class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"> Team </label>
            <USelect
              v-model="filters.team"
              :items="teamOptions"
              value-key="value"
              placeholder="All Teams"
              size="md"
              class="w-full"
              @change="handleFilterChange"
            />
          </div>
        </div>

        <!-- Active Filters & Clear -->
        <div
          v-if="hasActiveFilters"
          class="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 shadow-sm"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Active Filters:
              </span>
              <UButton
                v-if="filters.search"
                variant="soft"
                color="info"
                size="sm"
                class="inline-flex items-center gap-1"
                @click="clearSearchFilter"
              >
                <Icon name="i-heroicons-magnifying-glass" class="w-3 h-3" />
                "{{ filters.search }}"
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </UButton>
              <UButton
                v-if="filters.category && filters.category !== 'all'"
                variant="soft"
                color="warning"
                size="sm"
                class="inline-flex items-center gap-1"
                @click="clearCategoryFilter"
              >
                <Icon name="i-heroicons-tag" class="w-3 h-3" />
                {{ filters.category }}
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </UButton>
              <UButton
                v-if="filters.gender && filters.gender !== 'all'"
                variant="soft"
                color="primary"
                size="sm"
                class="inline-flex items-center gap-1"
                @click="clearGenderFilter"
              >
                <Icon name="i-heroicons-user" class="w-3 h-3" />
                {{ filters.gender }}
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </UButton>
              <UButton
                v-if="filters.status && filters.status !== 'all'"
                variant="soft"
                color="success"
                size="sm"
                class="inline-flex items-center gap-1"
                @click="clearStatusFilter"
              >
                <Icon name="i-heroicons-check-circle" class="w-3 h-3" />
                {{ filters.status }}
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </UButton>
              <UButton
                v-if="filters.team && filters.team !== 'all'"
                variant="soft"
                color="info"
                size="sm"
                class="inline-flex items-center gap-1"
                @click="clearTeamFilter"
              >
                <Icon name="i-heroicons-users" class="w-3 h-3" />
                {{ filters.team }}
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </UButton>
            </div>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
              @click="clearFilters"
            >
              <Icon name="i-heroicons-trash" class="w-4 h-4 mr-2" />
              Clear All
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Cards (mobile only) -->
    <div v-if="viewport.isLessThan('md')" class="space-y-4">
      <div
        v-for="competitor in paginatedCompetitors"
        :key="competitor.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
      >
        <!-- Mobile Card Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="text-lg font-bold text-gray-900 dark:text-white">#{{ competitor.personalNumber }}</span>
            <UiStatusBadge v-if="isAdmin" :status="competitor.playerAcceptanceStatus" variant="soft" size="sm" />
          </div>
          <div class="flex gap-2">
            <UButton
              v-if="isAdmin"
              size="xs"
              variant="soft"
              color="info"
              class="flex items-center gap-1"
              @click="$emit('viewDetails', competitor)"
            >
              <Icon name="i-heroicons-eye" class="w-4 h-4" />
              <span class="hidden sm:inline">View</span>
            </UButton>
            <UButton
              v-if="isAdmin && canEditParticipant"
              size="xs"
              variant="soft"
              color="primary"
              class="flex items-center gap-1"
              @click="$emit('edit', competitor)"
            >
              <Icon name="i-heroicons-pencil" class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
            </UButton>
            <UButton
              v-if="isAdmin"
              size="xs"
              variant="soft"
              color="error"
              class="flex items-center gap-1"
              @click="handleDeleteCompetitor(competitor)"
            >
              <Icon name="i-heroicons-trash" class="w-4 h-4" />
              <span class="hidden sm:inline">Delete</span>
            </UButton>
          </div>
        </div>

        <!-- Mobile Card Content -->
        <div class="space-y-2">
          <div>
            <button
              v-if="isAdmin"
              class="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
              @click="$emit('viewDetails', competitor)"
            >
              {{ competitor.firstName }} {{ competitor.lastName }}
            </button>
            <span v-else class="text-sm font-medium text-gray-900 dark:text-white">
              {{ competitor.firstName }} {{ competitor.lastName }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
            >
              {{ competitor.category }}
            </span>
            <UiStatusBadge :status="competitor.gender" variant="soft" size="xs" />
            <span
              v-if="showTeam && competitor.team"
              class="inline-flex items-center text-xs text-gray-600 dark:text-gray-400"
            >
              Team: {{ competitor.team }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Table (tablet and desktop) -->
    <div v-if="viewport.isGreaterOrEquals('md')" class="overflow-x-auto w-full">
      <table class="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'personalNumber'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('personalNumber')"
              >
                <span>#</span>
                <Icon :name="getSortIcon('personalNumber')" class="w-4 h-4" />
              </button>
            </th>
            <th
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'firstName'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('firstName')"
              >
                <span>Name</span>
                <Icon :name="getSortIcon('firstName')" class="w-4 h-4" />
              </button>
            </th>
            <th
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'category'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('category')"
              >
                <span>Category</span>
                <Icon :name="getSortIcon('category')" class="w-4 h-4" />
              </button>
            </th>
            <th
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'gender'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('gender')"
              >
                <span>Gender</span>
                <Icon :name="getSortIcon('gender')" class="w-4 h-4" />
              </button>
            </th>
            <th
              v-if="showTeam"
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'team'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('team')"
              >
                <span>Team</span>
                <Icon :name="getSortIcon('team')" class="w-4 h-4" />
              </button>
            </th>
            <th
              v-if="isAuthenticated"
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              <button
                class="flex items-center space-x-1 transition-colors"
                :class="[
                  sortBy === 'playerAcceptanceStatus'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'hover:text-gray-700 dark:hover:text-gray-200',
                ]"
                @click="handleSort('playerAcceptanceStatus')"
              >
                <span>Status</span>
                <Icon :name="getSortIcon('playerAcceptanceStatus')" class="w-4 h-4" />
              </button>
            </th>
            <th
              v-if="isAuthenticated"
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Document
            </th>
            <th
              v-if="isAuthenticated"
              class="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="competitor in paginatedCompetitors"
            :key="competitor.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
              {{ competitor.personalNumber }}
            </td>
            <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <div class="flex flex-col">
                <button
                  class="font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left"
                  @click="$emit('viewDetails', competitor)"
                >
                  {{ competitor.firstName }} {{ competitor.lastName }}
                </button>
              </div>
            </td>
            <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
              >
                {{ competitor.category }}
              </span>
            </td>
            <td class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <UiStatusBadge :status="competitor.gender" variant="soft" size="xs" />
            </td>
            <td v-if="showTeam" class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ competitor.team || '-' }}
            </td>
            <td v-if="isAuthenticated" class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <UiStatusBadge :status="competitor.playerAcceptanceStatus" variant="soft" size="xs" />
            </td>
            <td v-if="isAuthenticated" class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <div class="flex items-center gap-1">
                <UButton
                  v-if="competitor.tournamentDocumentUrl"
                  :href="competitor.tournamentDocumentUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="soft"
                  color="info"
                  size="xs"
                >
                  <Icon name="i-heroicons-document-check" class="w-4 h-4" />
                  <span class="hidden lg:inline">View</span>
                </UButton>
                <UButton v-else variant="soft" color="neutral" size="xs" disabled>
                  <Icon name="i-heroicons-document" class="w-4 h-4" />
                  <span class="hidden lg:inline">No Doc</span>
                </UButton>
              </div>
            </td>
            <td v-if="isAuthenticated" class="px-2 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              <div class="flex gap-1">
                <!-- View Details/Edit/Delete Actions (compact buttons) -->
                <UButton
                  size="xs"
                  variant="soft"
                  color="info"
                  class="flex items-center gap-1"
                  @click="$emit('viewDetails', competitor)"
                >
                  <Icon name="i-heroicons-eye" class="w-4 h-4" />
                  <span class="hidden lg:inline">View</span>
                </UButton>
                <UButton
                  v-if="isAdmin && canEditParticipant"
                  size="xs"
                  variant="soft"
                  color="primary"
                  class="flex items-center gap-1"
                  @click="$emit('edit', competitor)"
                >
                  <Icon name="i-heroicons-pencil" class="w-4 h-4" />
                  <span class="hidden lg:inline">Edit</span>
                </UButton>
                <UButton
                  size="xs"
                  variant="soft"
                  color="error"
                  class="flex items-center gap-1"
                  @click="handleDeleteCompetitor(competitor)"
                >
                  <Icon name="i-heroicons-trash" class="w-4 h-4" />
                  <span class="hidden lg:inline">Delete</span>
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Enhanced Pagination -->
    <div
      class="bg-white dark:bg-gray-800 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between border-t border-gray-200 dark:border-gray-700 gap-4 min-h-[60px]"
    >
      <!-- Results Info -->
      <div class="flex-1 flex items-center">
        <p v-if="pageSize !== -1" class="text-sm text-gray-700 dark:text-gray-300">
          Showing
          <span class="font-medium text-gray-900 dark:text-white">{{ startIndex + 1 }}</span>
          to
          <span class="font-medium text-gray-900 dark:text-white">{{ endIndex }}</span>
          of
          <span class="font-medium text-gray-900 dark:text-white">{{ filteredCompetitors.length }}</span>
          results
        </p>
        <p v-else class="text-sm text-gray-700 dark:text-gray-300">
          Showing all
          <span class="font-medium text-gray-900 dark:text-white">{{ filteredCompetitors.length }}</span>
          results
        </p>
      </div>

      <!-- Right Side Controls -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Page Size Control -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"> Show per page: </label>
          <USelect
            v-model="pageSize"
            :items="pageSizeOptions"
            value-key="value"
            placeholder="20 per page"
            size="sm"
            class="w-32"
            @change="handlePageSizeChange"
          />
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center gap-2">
          <!-- Previous Button -->
          <UButton
            :disabled="currentPage === 1 || pageSize === -1"
            variant="soft"
            color="neutral"
            size="sm"
            class="flex items-center gap-2"
            @click="goToPage(currentPage - 1)"
          >
            <Icon name="i-heroicons-chevron-left" class="w-4 h-4" />
            Previous
          </UButton>

          <!-- Page Numbers -->
          <div v-if="pageSize !== -1" class="hidden sm:flex items-center space-x-1">
            <template v-for="page in visiblePages" :key="page">
              <UButton
                v-if="page !== '...'"
                :variant="currentPage === page ? 'solid' : 'soft'"
                :color="currentPage === page ? 'primary' : 'neutral'"
                size="sm"
                class="w-8 h-8 p-0 flex items-center justify-center"
                @click="goToPage(page as number)"
              >
                {{ page }}
              </UButton>
              <UButton
                v-else
                variant="soft"
                color="neutral"
                size="sm"
                class="w-8 h-8 p-0 cursor-default flex items-center justify-center"
                disabled
              >
                ...
              </UButton>
            </template>
          </div>

          <!-- Show All Indicator -->
          <div
            v-if="pageSize === -1"
            class="hidden sm:flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            <span class="text-sm text-gray-600 dark:text-gray-400">Showing all</span>
          </div>

          <!-- Next Button -->
          <UButton
            :disabled="currentPage === totalPages || pageSize === -1"
            variant="soft"
            color="neutral"
            size="sm"
            class="flex items-center gap-2"
            @click="goToPage(currentPage + 1)"
          >
            Next
            <Icon name="i-heroicons-chevron-right" class="w-4 h-4" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="showDeleteConfirmation"
      title="Delete Participant"
      description="Are you sure you want to delete this participant? This action cannot be undone."
      :ui="{
        wrapper: 'w-full',
        close: 'absolute end-0 top-0',
      }"
    >
      <template #footer>
        <div class="flex justify-end space-x-3">
          <UButton color="neutral" variant="soft" :disabled="isDeleting" @click="cancelDelete"> Cancel </UButton>
          <UButton color="error" :loading="isDeleting" :disabled="isDeleting" @click="confirmDelete">
            <Icon v-if="!isDeleting" name="i-heroicons-trash" class="w-4 h-4 mr-2" />
            {{ isDeleting ? 'Deleting...' : 'Delete Participant' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Auto-imports: useUIStore (from Pinia)
import type { CompetitorWithDetails } from '~/types';

// Viewport composable for responsive behavior
const viewport = useViewport();

// Notification store
const { showNotification } = useUIStore();

interface Props {
  competitors: CompetitorWithDetails[];
  isAuthenticated: boolean;
  showTeam?: boolean;
  loading?: boolean;
  categories: string[];
  canAddParticipant?: boolean;
  canEditParticipant?: boolean;
  isAdmin?: boolean;
}

const {
  competitors,
  showTeam = false,
  categories,
  canAddParticipant = false,
  canEditParticipant = false,
  isAdmin = false,
} = defineProps<Props>();

const emit = defineEmits<{
  addParticipant: [];
  edit: [competitor: CompetitorWithDetails];
  delete: [id: string];
  viewDetails: [competitor: CompetitorWithDetails];
  importParticipants: [];
  exportParticipants: [];
}>();

// Front-end pagination state
const currentPage = ref(1);
const pageSize = ref(20);

// Delete modal state
const showDeleteConfirmation = ref(false);
const competitorToDelete = ref<CompetitorWithDetails | null>(null);
const isDeleting = ref(false);

// Filters
const filters = ref({
  search: '',
  category: 'all',
  gender: 'all',
  status: 'all',
  team: 'all',
});

// Sorting
const sortBy = ref('');
const sortOrder = ref('asc');

// Page size options
const pageSizeOptions = [
  { label: '10 per page', value: 10 },
  { label: '20 per page', value: 20 },
  { label: '50 per page', value: 50 },
  { label: '100 per page', value: 100 },
  { label: 'All', value: -1 },
];

// Filter options
const categoryOptions = computed(() => [
  { label: 'All Categories', value: 'all' },
  ...categories.map(cat => ({ label: cat, value: cat })),
]);

const genderOptions = [
  { label: 'All Genders', value: 'all' },
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
];

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const teamOptions = computed(() => {
  const teams = [...new Set(competitors.map(c => c.team).filter(team => team && team.trim() !== ''))];
  return [
    { label: 'All Teams', value: 'all' },
    ...teams.map(team => ({ label: team as string, value: team as string })),
  ];
});

// Filtered and sorted competitors
const filteredCompetitors = computed(() => {
  const filtered = competitors.filter(competitor => {
    const matchesSearch =
      !filters.value.search ||
      `${competitor.firstName} ${competitor.lastName}`.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchesCategory =
      !filters.value.category || filters.value.category === 'all' || competitor.category === filters.value.category;
    const matchesGender =
      !filters.value.gender || filters.value.gender === 'all' || competitor.gender === filters.value.gender;
    const matchesStatus =
      !filters.value.status ||
      filters.value.status === 'all' ||
      competitor.playerAcceptanceStatus === filters.value.status;
    const matchesTeam =
      !filters.value.team ||
      filters.value.team === 'all' ||
      (competitor.team && competitor.team === filters.value.team);

    return matchesSearch && matchesCategory && matchesGender && matchesStatus && matchesTeam;
  });

  // Apply sorting
  if (sortBy.value) {
    filtered.sort((a, b) => {
      // Type-safe property access using a helper function
      const getSortValue = (item: CompetitorWithDetails, key: string): string | number => {
        switch (key) {
          case 'firstName':
          case 'lastName':
            return `${item.firstName} ${item.lastName}`;
          case 'personalNumber':
            return item.personalNumber;
          case 'gender':
            return item.gender;
          case 'category':
            return item.category;
          case 'team':
            return item.team || '';
          case 'playerAcceptanceStatus':
            return item.playerAcceptanceStatus;
          case 'createdAt':
            return item.createdAt;
          case 'updatedAt':
            return item.updatedAt;
          default:
            return '';
        }
      };

      let aValue = getSortValue(a, sortBy.value);
      let bValue = getSortValue(b, sortBy.value);

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filtered;
});

// Pagination calculations
const totalPages = computed(() => {
  if (pageSize.value === -1) return 1;
  return Math.ceil(filteredCompetitors.value.length / pageSize.value);
});

const startIndex = computed(() => {
  if (pageSize.value === -1) return 0;
  return (currentPage.value - 1) * pageSize.value;
});

const endIndex = computed(() => {
  if (pageSize.value === -1) return filteredCompetitors.value.length;
  return Math.min(startIndex.value + pageSize.value, filteredCompetitors.value.length);
});

const paginatedCompetitors = computed(() => {
  if (pageSize.value === -1) return filteredCompetitors.value;
  return filteredCompetitors.value.slice(startIndex.value, endIndex.value);
});

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }

  return pages;
});

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    filters.value.search ||
    (filters.value.category && filters.value.category !== 'all') ||
    (filters.value.gender && filters.value.gender !== 'all') ||
    (filters.value.status && filters.value.status !== 'all') ||
    (filters.value.team && filters.value.team !== 'all')
  );
});

// Event handlers
const handleSearch = () => {
  currentPage.value = 1;
};

const handleFilterChange = () => {
  currentPage.value = 1;
};

const handlePageSizeChange = () => {
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const clearFilters = () => {
  filters.value.search = '';
  filters.value.category = 'all';
  filters.value.gender = 'all';
  filters.value.status = 'all';
  filters.value.team = 'all';
  currentPage.value = 1;
};

// Individual filter clear functions
const clearSearchFilter = () => {
  filters.value.search = '';
  handleSearch();
};

const clearCategoryFilter = () => {
  filters.value.category = 'all';
  handleFilterChange();
};

const clearGenderFilter = () => {
  filters.value.gender = 'all';
  handleFilterChange();
};

const clearStatusFilter = () => {
  filters.value.status = 'all';
  handleFilterChange();
};

const clearTeamFilter = () => {
  filters.value.team = 'all';
  handleFilterChange();
};

// Sorting functions
const handleSort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;
};

const getSortIcon = (column: string) => {
  if (sortBy.value !== column) return 'i-heroicons-bars-arrow-up';
  return sortOrder.value === 'asc' ? 'i-heroicons-bars-arrow-up' : 'i-heroicons-bars-arrow-down';
};

// Delete functions
const handleDeleteCompetitor = (competitor: CompetitorWithDetails) => {
  competitorToDelete.value = competitor;
  showDeleteConfirmation.value = true;
};

const confirmDelete = async () => {
  if (!competitorToDelete.value) return;

  const competitorName = `${competitorToDelete.value.firstName} ${competitorToDelete.value.lastName}`;
  isDeleting.value = true;

  try {
    const response = await $fetch<{ success: boolean }>(`/api/competitors/${competitorToDelete.value.id}`, {
      method: 'DELETE',
    });

    if (response.success) {
      // Show success notification
      showNotification({
        title: 'Participant Deleted',
        message: `"${competitorName}" has been successfully deleted.`,
        type: 'success',
      });

      // Emit delete event to parent
      emit('delete', competitorToDelete.value.id);
      showDeleteConfirmation.value = false;
      competitorToDelete.value = null;
    } else {
      throw new Error('Failed to delete participant');
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === 'development') console.error('Error deleting participant:', error);

    // Show error notification
    showNotification({
      title: 'Delete Failed',
      message: `Failed to delete "${competitorName}". Please try again.`,
      type: 'error',
    });
  } finally {
    isDeleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  competitorToDelete.value = null;
};
</script>
