<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
    <!-- Back Button -->
    <div class="mb-6">
      <UButton to="/" variant="soft" color="neutral">
        <Icon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
        Back to Tournaments
      </UButton>
    </div>
    <!-- Loading State -->
    <div v-if="isLoading || participantsLoading">
      <UiLoadingSkeleton />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto">
      <UiEnhancedErrorAlert
        :title="errorTitle"
        :subtitle="errorSubtitle"
        :description="errorDescription"
        :error-details="error"
        :suggestions="errorSuggestions"
        :actions="errorActions"
        :type="errorType"
        show-details
        @dismiss="handleErrorDismiss"
      />
    </div>

    <!-- Tournament Details -->
    <div v-else-if="tournament" class="space-y-6">
      <!-- Collapsible Tournament Info -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-2">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                  {{ tournament.name }}
                </h1>
                <UiStatusBadge :status="tournament.status" size="lg" variant="soft" class="self-start sm:self-auto" />
              </div>
              <p class="text-gray-500 dark:text-gray-400">Tournament details and information</p>
            </div>
            <UButton
              variant="ghost"
              size="sm"
              class="flex items-center space-x-2 self-start sm:self-auto"
              @click="toggleTournamentInfo"
            >
              <span class="text-sm font-medium"> {{ isTournamentInfoExpanded ? 'Hide' : 'Show' }} Details </span>
              <Icon
                :name="isTournamentInfoExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="w-4 h-4"
              />
            </UButton>
          </div>
        </div>

        <div v-if="isTournamentInfoExpanded" class="px-4 sm:px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
          <!-- Categories -->
          <div class="pt-6 pb-4">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Categories
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="category in tournament.categories"
                :key="category"
                class="inline-flex px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 rounded-full break-words"
              >
                {{ category }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <!-- Tournament Schedule -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Schedule</h3>
              <div class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament Start</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white break-words">
                    {{ new Date(tournament.tournamentStart).toLocaleDateString() }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tournament End</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white break-words">
                    {{ new Date(tournament.tournamentEnd).toLocaleDateString() }}
                  </dd>
                </div>
              </div>
            </div>

            <!-- Registration -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Registration</h3>
              <div class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Registration Start</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white break-words">
                    {{ new Date(tournament.tournamentRegistrationStart).toLocaleDateString() }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Registration End</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white break-words">
                    {{ new Date(tournament.tournamentRegistrationEnd).toLocaleDateString() }}
                  </dd>
                </div>
              </div>
            </div>

            <!-- Tournament Stats -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Details</h3>
              <div class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Teams Allowed</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    <span
                      :class="
                        tournament.hasTeams ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      "
                    >
                      {{ tournament.hasTeams ? 'Yes' : 'No' }}
                    </span>
                  </dd>
                </div>
              </div>
            </div>

            <!-- Documents & Actions -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Resources</h3>
              <div class="space-y-3">
                <div v-if="tournament.proclamations" class="flex items-start space-x-3">
                  <Icon
                    name="i-heroicons-document-text"
                    class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0 mt-0.5"
                  />
                  <a
                    :href="tournament.proclamations"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium break-words"
                  >
                    Proclamations
                  </a>
                </div>
                <div v-if="tournament.chessResults" class="flex items-start space-x-3">
                  <Icon name="i-heroicons-trophy" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0 mt-0.5" />
                  <a
                    :href="tournament.chessResults"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium break-words"
                  >
                    Chess Results
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Participants Section -->
      <div class="mt-8">
        <div v-if="participantsLoading" class="space-y-4">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <CompetitorCompetitorsTable
          v-else
          :competitors="participants"
          :is-authenticated="isAuthenticated"
          :show-team="tournament?.hasTeams"
          :categories="tournament?.categories"
          :can-add-participant="canAddParticipant"
          :can-edit-participant="canEditParticipant"
          :is-admin="isAdmin"
          @add-participant="handleAddParticipantClick"
          @edit="editParticipant"
          @delete="deleteParticipant"
          @view-details="viewParticipantDetails"
          @import-participants="handleImportClick"
          @export-participants="handleExportClick"
        />
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg
          class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Tournament not found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">The tournament you're looking for doesn't exist.</p>
        <div class="mt-6">
          <UButton to="/" color="primary"> Back to Tournaments </UButton>
        </div>
      </div>
    </div>

    <!-- Add Participant Modal -->
    <UModal
      v-model:open="showAddParticipantModal"
      title="Add Participant"
      description="Register a new participant for this tournament with all necessary details."
      :ui="{
        wrapper: 'w-full',
        close: 'absolute end-0 top-0',
      }"
    >
      <template #body>
        <CompetitorAddParticipantModal
          ref="addParticipantModalRef"
          :tournament="tournament"
          :is-admin="isAdmin"
          @participant-added="handleParticipantAdded"
          @close="showAddParticipantModal = false"
        />
      </template>
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <UButton
            color="neutral"
            variant="soft"
            :disabled="addParticipantModalRef?.isSubmitting"
            size="md"
            class="w-full sm:w-auto"
            icon="i-heroicons-x-mark"
            @click="showAddParticipantModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            variant="soft"
            :loading="addParticipantModalRef?.isSubmitting"
            :disabled="addParticipantModalRef?.isSubmitting"
            size="md"
            class="w-full sm:w-auto"
            icon="i-heroicons-user-plus"
            @click="handleAddParticipant"
          >
            Add Participant
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Edit Participant Modal -->
    <UModal
      v-model:open="showEditParticipantModal"
      title="Edit Participant"
      description="Update participant information and administrative settings."
      :ui="{
        wrapper: 'w-full',
        close: 'absolute end-0 top-0',
      }"
    >
      <template #body>
        <CompetitorEditParticipantModal
          :tournament="tournament"
          :participant="selectedCompetitor"
          :is-admin="isAdmin"
          @participant-updated="handleParticipantUpdated"
          @close="showEditParticipantModal = false"
        />
      </template>
    </UModal>

    <!-- Competitor Details Modal -->
    <UModal
      v-model:open="showDetailsModal"
      title="Competitor Details"
      description="View and manage competitor information, including personal details, status, and actions."
      :ui="{
        wrapper: 'w-full',
        close: 'absolute end-0 top-0',
      }"
    >
      <template #body>
        <CompetitorDetailsModal
          :competitor="selectedCompetitor"
          @approve="approveParticipant"
          @reject="rejectParticipant"
          @close="showDetailsModal = false"
        />
      </template>
    </UModal>

    <!-- Import/Export Modal -->
    <UModal
      v-model:open="showModal"
      :title="isImportMode ? 'Import Participants' : 'Export Participants'"
      :description="
        isImportMode
          ? 'Upload participant data from a CSV or Excel file to add multiple competitors at once.'
          : 'Download participant data from this tournament in your preferred format.'
      "
      :ui="{
        wrapper: 'w-full',
        close: 'absolute end-0 top-0',
      }"
    >
      <template #body>
        <CompetitorImportExportModal
          :is-import="isImportMode"
          :tournament-id="tournamentId"
          :tournament-name="tournament?.name || ''"
          @import-success="handleImportSuccess"
          @export-success="handleExportSuccess"
          @close="showModal = false"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { handleError, handleInfo } from '~/utils/errorHandler';
import type { TournamentApiResponse, CompetitorApiResponse, ApiResponse } from '~/types';

// Import AddParticipantModal for ref typing
import CompetitorAddParticipantModal from '~/app/components/competitor/AddParticipantModal.vue';

// Add participant modal ref
const addParticipantModalRef =
  useTemplateRef<InstanceType<typeof CompetitorAddParticipantModal>>('addParticipantModalRef');

// Add handleAddParticipant method
const handleAddParticipant = async () => {
  if (addParticipantModalRef.value) {
    await addParticipantModalRef.value.submitForm();
  }
};

// Meta
useHead({
  title: 'Tournament Details - Chess Tournament Manager',
  meta: [
    {
      name: 'description',
      content: 'View detailed information about a chess tournament',
    },
  ],
});

// Get route params
const route = useRoute();
const tournamentId = route.params.id as string;

// Stores
const authStore = useAuthStore();
const { isAuthenticated, isAdmin } = storeToRefs(authStore);

// Client-side data fetching for maximum speed
const tournament = ref<TournamentApiResponse | null>(null);
const participants = ref<CompetitorApiResponse[]>([]);
const isLoading = ref(true);
const participantsLoading = ref(true);
const error = ref<string | null>(null);
const participantsError = ref<string | null>(null);

// Fetch tournament data
const loadTournament = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await $fetch<ApiResponse<TournamentApiResponse>>(`/api/tournaments/${tournamentId}`);
    if (response.success && response.data) {
      tournament.value = response.data;
    } else if (!response.success) {
      error.value = 'Failed to load tournament';
    }
  } catch (err: unknown) {
    // Avoid global toasts here to prevent duplicate alerts on the page
    const e = err as { data?: { statusMessage?: string }; statusMessage?: string; message?: string };
    const msg = e?.data?.statusMessage || e?.statusMessage || e?.message || 'Failed to load tournament';
    error.value = msg;
  } finally {
    isLoading.value = false;
  }
};

// Fetch participants data
const fetchParticipants = async () => {
  try {
    participantsLoading.value = true;
    participantsError.value = null;
    const response = await $fetch<ApiResponse<CompetitorApiResponse[]>>(
      `/api/tournament-competitors?tournamentId=${tournamentId}`
    );
    if (response.success && response.data) {
      participants.value = response.data;
    } else if (!response.success) {
      participantsError.value = 'Failed to load participants';
    }
  } catch (err: unknown) {
    // Avoid global toasts here to prevent duplicate alerts
    const e = err as { data?: { statusMessage?: string }; statusMessage?: string; message?: string };
    const msg = e?.data?.statusMessage || e?.statusMessage || e?.message || 'Failed to load participants';
    participantsError.value = msg;
  } finally {
    participantsLoading.value = false;
  }
};

// Refresh function for participants
const refreshParticipants = async () => {
  await fetchParticipants();
};

// Fetch data on mount
onMounted(async () => {
  // Check authentication state first to ensure user data is available
  await authStore.checkAuth();
  await loadTournament();
  // Fetch participants in the background so UI doesn't stay in loading state
  fetchParticipants();
});

// Modals
const showAddParticipantModal = ref(false);
const showEditParticipantModal = ref(false);
const showDetailsModal = ref(false);
const showModal = ref(false);
const isImportMode = ref(true);
const selectedCompetitor = ref<CompetitorApiResponse | null>(null);

// Role-based access control

const canAddParticipant = computed(() => {
  if (!tournament.value) return false;
  return tournament.value.status === 'OPEN' || (isAuthenticated.value && isAdmin.value);
});

const canEditParticipant = computed(() => {
  // Only admins can edit participants
  return isAdmin.value;
});

// Collapsible state
const isTournamentInfoExpanded = ref(false);

// Toggle tournament info
const toggleTournamentInfo = () => {
  isTournamentInfoExpanded.value = !isTournamentInfoExpanded.value;
};

// Enhanced error handling
const errorTitle = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('404') || error.value.includes('not found')) {
    return 'Tournament Not Found';
  }
  if (error.value.includes('403') || error.value.includes('unauthorized')) {
    return 'Access Denied';
  }
  if (error.value.includes('Failed to fetch')) {
    return 'Connection Problem';
  }
  return 'Error Loading Tournament';
});

const errorSubtitle = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('404') || error.value.includes('not found')) {
    return 'This tournament does not exist or is not available';
  }
  if (error.value.includes('403') || error.value.includes('unauthorized')) {
    return "You don't have permission to view this tournament";
  }
  if (error.value.includes('Failed to fetch')) {
    return 'Unable to connect to the server';
  }
  return 'Something went wrong while loading the tournament';
});

const errorDescription = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('404') || error.value.includes('not found')) {
    return "The tournament you're looking for may have been deleted, moved, or is not visible to you. Only active tournaments (Open and In Progress) are visible to the public.";
  }
  if (error.value.includes('403') || error.value.includes('unauthorized')) {
    return 'This tournament may be in draft status or finished, which requires admin access to view.';
  }
  if (error.value.includes('Failed to fetch')) {
    return 'Please check your internet connection and try again.';
  }
  return 'We encountered an error while loading the tournament. Please try again or contact support if the problem persists.';
});

const errorSuggestions = computed(() => {
  if (!error.value) return [];

  if (error.value.includes('404') || error.value.includes('not found')) {
    return [
      'Check if the tournament URL is correct',
      'Verify the tournament exists and is active',
      'Contact the tournament organizer for more information',
    ];
  }
  if (error.value.includes('403') || error.value.includes('unauthorized')) {
    return [
      'Sign in as an admin to view all tournaments',
      'Contact an administrator for access',
      'Check if you have the correct permissions',
    ];
  }
  return ['Check your internet connection', 'Try refreshing the page', 'Contact support if the problem persists'];
});

const errorType = computed(() => {
  if (!error.value) return 'error';

  if (error.value.includes('404') || error.value.includes('not found')) {
    return 'warning';
  }
  if (error.value.includes('403') || error.value.includes('unauthorized')) {
    return 'error';
  }
  if (error.value.includes('Failed to fetch')) {
    return 'network';
  }
  return 'error';
});

const errorActions = computed(() => {
  const actions = [
    {
      label: 'Try Again',
      click: loadTournament,
      color: 'primary' as const,
      icon: 'i-heroicons-arrow-path',
    },
    {
      label: 'Back to Tournaments',
      click: () => navigateTo('/'),
      color: 'neutral' as const,
      variant: 'outline' as const,
      icon: 'i-heroicons-arrow-left',
    },
  ];

  if (error.value?.includes('403') || error.value?.includes('unauthorized')) {
    actions.push({
      label: 'Sign In',
      click: async () => {
        await navigateTo('/auth/login');
      },
      color: 'primary',
      icon: 'i-heroicons-arrow-right-on-rectangle',
    });
  }

  return actions;
});

const handleErrorDismiss = () => {
  error.value = null;
};

// Data fetching is now handled in onMounted for maximum speed

// Participant actions
const approveParticipant = async (participantId: string) => {
  try {
    await $fetch(`/api/tournaments/${tournamentId}/competitors/${participantId}`, {
      method: 'PUT',
      body: { playerAcceptanceStatus: 'APPROVED' },
    });
    await refreshParticipants();
  } catch (error) {
    handleError(error, 'Error approving participant', 'Approval Failed');
  }
};

const rejectParticipant = async (participantId: string) => {
  try {
    await $fetch(`/api/tournaments/${tournamentId}/competitors/${participantId}`, {
      method: 'PUT',
      body: { playerAcceptanceStatus: 'REJECTED' },
    });
    await refreshParticipants();
  } catch (error) {
    handleError(error, 'Error rejecting participant', 'Rejection Failed');
  }
};

const editParticipant = (participant: CompetitorApiResponse) => {
  selectedCompetitor.value = participant;
  showEditParticipantModal.value = true;
};

const deleteParticipant = async (participantId: string) => {
  try {
    await $fetch(`/api/tournaments/${tournamentId}/competitors/${participantId}`, {
      method: 'PUT',
      body: { _delete: true },
    });
    await refreshParticipants();
  } catch (error) {
    handleError(error, 'Error deleting participant', 'Deletion Failed');
  }
};

// Modal event handlers
const handleAddParticipantClick = () => {
  showAddParticipantModal.value = true;
};

const handleParticipantAdded = async (participant: CompetitorApiResponse) => {
  // Show success notification
  const uiStore = useUIStore();
  uiStore.showInfo('Participant added successfully', 'Add Participant Success');

  // Close modal
  showAddParticipantModal.value = false;

  // Add the new participant to the existing list instead of refetching
  participants.value.push(participant);
};

const handleParticipantUpdated = async (participant: CompetitorApiResponse) => {
  handleInfo('Participant updated successfully', 'Participant Updated');
  // Update the participant in the existing list instead of refetching
  const index = participants.value.findIndex(p => p.id === participant.id);
  if (index !== -1) {
    participants.value[index] = participant;
  }
};

const viewParticipantDetails = (participant: CompetitorApiResponse) => {
  selectedCompetitor.value = participant;
  showDetailsModal.value = true;
};

// Import/Export handlers
const handleImportSuccess = async () => {
  // Refresh participants list
  await fetchParticipants();
  showModal.value = false;
};

const handleExportSuccess = () => {
  showModal.value = false;
};

// Import/Export button handlers
const handleImportClick = () => {
  isImportMode.value = true;
  showModal.value = true;
};

const handleExportClick = () => {
  isImportMode.value = false;
  showModal.value = true;
};
</script>
