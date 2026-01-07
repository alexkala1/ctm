<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error State -->
      <UiEnhancedErrorAlert
        v-if="error"
        :title="errorTitle"
        :subtitle="errorSubtitle"
        :description="errorDescription"
        :error-details="errorDetails"
        :suggestions="errorSuggestions"
        :actions="errorActions"
        :type="errorType"
        show-details
        @dismiss="handleErrorDismiss"
      />

      <!-- Loading State -->
      <UiEnhancedLoadingState
        v-else-if="isLoading"
        title="Loading Tournaments"
        description="Please wait while we fetch your tournaments..."
        icon="i-heroicons-trophy"
        :show-progress="false"
        additional-info="This may take a few moments depending on your connection."
      />

      <!-- Empty State -->
      <UiEmptyState
        v-else-if="!tournaments || tournaments.length === 0"
        :title="isAdmin ? 'No Tournaments Found' : 'No Active Tournaments'"
        :description="
          isAdmin
            ? 'There are no tournaments available at the moment. Create your first tournament to get started!'
            : 'There are no active tournaments available for viewing. Only open and in-progress tournaments are visible to the public.'
        "
        icon="i-heroicons-trophy"
        :actions="emptyStateActions"
        :additional-info="
          isAdmin
            ? 'Tournaments will appear here once they are created.'
            : 'Sign in as an admin to see all tournaments including drafts and finished ones.'
        "
      />

      <!-- Tournaments Table -->
      <TournamentsTable
        v-else
        :tournaments="tournaments"
        :is-admin="isAdmin"
        @tournament-created="handleTournamentCreated"
        @tournament-updated="handleTournamentUpdated"
        @tournament-deleted="handleTournamentDeleted"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TournamentApiResponse } from '~/types';

// Meta
useHead({
  title: 'Chess Tournament Manager',
  meta: [{ name: 'description', content: 'Manage chess tournaments with ease' }],
});

const authStore = useAuthStore();
const { isAdmin } = storeToRefs(authStore);

// Use tournaments store
const tournamentsStore = useTournamentsStore();
const { tournaments, isLoading, error } = storeToRefs(tournamentsStore);

// Enhanced error handling
const errorTitle = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('Failed to fetch')) {
    return 'Connection Problem';
  }
  if (error.value.includes('permission') || error.value.includes('unauthorized')) {
    return 'Access Denied';
  }
  if (error.value.includes('validation') || error.value.includes('invalid')) {
    return 'Invalid Data';
  }
  return 'Error Loading Tournaments';
});

const errorSubtitle = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('Failed to fetch')) {
    return 'Unable to connect to the server';
  }
  if (error.value.includes('permission') || error.value.includes('unauthorized')) {
    return "You don't have permission to access this resource";
  }
  if (error.value.includes('validation') || error.value.includes('invalid')) {
    return 'The data provided is not valid';
  }
  return 'Something went wrong while loading tournaments';
});

const errorDescription = computed(() => {
  if (!error.value) return '';

  if (error.value.includes('Failed to fetch')) {
    return "It looks like there's a network issue. Please check your internet connection and try again.";
  }
  if (error.value.includes('permission') || error.value.includes('unauthorized')) {
    return "It seems you don't have the necessary permissions to view tournaments. Please contact an administrator if you believe this is an error.";
  }
  if (error.value.includes('validation') || error.value.includes('invalid')) {
    return 'There seems to be an issue with the data being processed. Please check your input and try again.';
  }
  return 'We encountered an error while loading tournaments. Please try again or contact support if the problem persists.';
});

const errorDetails = computed(() => error.value || '');

const errorSuggestions = computed(() => {
  if (!error.value) return [];

  if (error.value.includes('Failed to fetch')) {
    return [
      'Check your internet connection',
      'Try refreshing the page',
      'Check if the server is running',
      'Try again in a few moments',
    ];
  }
  if (error.value.includes('permission') || error.value.includes('unauthorized')) {
    return [
      "Check if you're logged in",
      'Contact an administrator',
      'Try logging out and back in',
      'Verify your account permissions',
    ];
  }
  if (error.value.includes('validation') || error.value.includes('invalid')) {
    return [
      'Check your input for errors',
      'Make sure all required fields are filled',
      'Verify the format of your data',
      'Try again with corrected information',
    ];
  }
  return [
    'Try refreshing the page',
    'Clear your browser cache',
    'Check if the server is running',
    'Contact support if the problem persists',
  ];
});

const errorType = computed(() => {
  if (!error.value) return 'error';

  if (error.value.includes('Failed to fetch')) {
    return 'network';
  }
  if (error.value.includes('permission') || error.value.includes('unauthorized')) {
    return 'permission';
  }
  if (error.value.includes('validation') || error.value.includes('invalid')) {
    return 'validation';
  }
  return 'error';
});

const errorActions = computed(() => [
  {
    label: 'Try Again',
    click: () => tournamentsStore.fetchTournaments(),
    color: 'primary' as const,
    icon: 'i-heroicons-arrow-path',
  },
  {
    label: 'Go Home',
    click: () => navigateTo('/'),
    color: 'neutral' as const,
    variant: 'outline' as const,
    icon: 'i-heroicons-home',
  },
  {
    label: 'Report Issue',
    click: () => {
      const issueUrl = `https://github.com/your-repo/issues/new?title=Tournament Loading Error&body=Error: ${error.value}`;
      window.open(issueUrl, '_blank');
    },
    color: 'error' as const,
    variant: 'outline' as const,
    icon: 'i-heroicons-exclamation-triangle',
  },
]);

const handleErrorDismiss = () => {
  // Clear the error
  tournamentsStore.$patch({ error: null });
};

// Enhanced loading state

// Empty state actions
const emptyStateActions = computed(() => [
  {
    label: 'Create Tournament',
    click: () => {
      // This would open a create tournament modal
    },
    color: 'primary' as const,
    icon: 'i-heroicons-plus',
  },
  {
    label: 'Refresh',
    click: () => tournamentsStore.fetchTournaments(),
    color: 'neutral' as const,
    variant: 'outline' as const,
    icon: 'i-heroicons-arrow-path',
  },
]);

// Fetch tournaments on mount
onMounted(async () => {
  await tournamentsStore.fetchTournaments();
});

// Handle tournament created
const handleTournamentCreated = (tournament: TournamentApiResponse) => {
  // Add tournament to the store
  tournamentsStore.addTournament(tournament);
};

// Handle tournament updated
const handleTournamentUpdated = (tournament: TournamentApiResponse) => {
  // Update tournament in the store
  tournamentsStore.updateTournamentInList(tournament);
};

// Handle tournament deleted
const handleTournamentDeleted = (tournamentId: string) => {
  // Remove tournament from the store
  tournamentsStore.removeTournamentFromList(tournamentId);
};
</script>
