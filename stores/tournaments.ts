import { defineStore } from 'pinia'
import type { 
  TournamentApiResponse, 
  CreateTournamentFormData, 
  UpdateTournamentFormData, 
  TournamentsApiResponse,
  SingleTournamentApiResponse,
  TournamentResult,
  AuthResult,
  EmptyApiResponse,
  ApiErrorWithMessage
} from '~/types'

// Type guard for API errors
const isApiError = (err: unknown): err is ApiErrorWithMessage => {
  return err !== null && typeof err === 'object' && 'data' in err
}

export const useTournamentsStore = defineStore('tournaments', () => {
  // State
  const tournaments = ref<TournamentApiResponse[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchTournaments = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<TournamentsApiResponse>('/api/tournaments')
      if (response.success && response.data) {
        // Handle both array format and object with tournaments property
        if (Array.isArray(response.data)) {
          tournaments.value = response.data
        } else if (response.data.tournaments) {
          tournaments.value = response.data.tournaments
        } else {
          error.value = 'Invalid response format'
        }
      } else {
        error.value = response.error || 'Failed to fetch tournaments'
      }
    } catch (err) {
      if (isApiError(err)) {
        error.value = err.data?.message || err.statusMessage || 'Failed to fetch tournaments'
      } else {
        error.value = 'Failed to fetch tournaments'
      }
      console.error('Fetch tournaments error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createTournament = async (data: CreateTournamentFormData): Promise<TournamentResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<SingleTournamentApiResponse>('/api/tournaments', {
        method: 'POST',
        body: data
      })
      
      if (response.success && response.data?.tournament) {
        tournaments.value.push(response.data.tournament)
        return { success: true, tournament: response.data.tournament }
      } else {
        error.value = response.error || 'Failed to create tournament'
        return { success: false, error: response.error || 'Failed to create tournament' }
      }
    } catch (err) {
      if (isApiError(err)) {
        error.value = err.data?.message || err.statusMessage || 'Failed to create tournament'
        return { 
          success: false, 
          error: err.data?.message || err.statusMessage || 'Failed to create tournament' 
        }
      } else {
        error.value = 'Failed to create tournament'
        return { 
          success: false, 
          error: 'Failed to create tournament' 
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateTournament = async (id: string, data: UpdateTournamentFormData): Promise<TournamentResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<SingleTournamentApiResponse>(`/api/tournaments/${id}`, {
        method: 'PUT',
        body: data
      })
      
      if (response.success && response.data?.tournament) {
        const index = tournaments.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tournaments.value[index] = response.data.tournament
        }
        return { success: true, tournament: response.data.tournament }
      } else {
        error.value = response.error || 'Failed to update tournament'
        return { success: false, error: response.error || 'Failed to update tournament' }
      }
    } catch (err) {
      if (isApiError(err)) {
        error.value = err.data?.message || err.statusMessage || 'Failed to update tournament'
        return { 
          success: false, 
          error: err.data?.message || err.statusMessage || 'Failed to update tournament' 
        }
      } else {
        error.value = 'Failed to update tournament'
        return { 
          success: false, 
          error: 'Failed to update tournament' 
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteTournament = async (id: string): Promise<AuthResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<EmptyApiResponse>(`/api/tournaments/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        tournaments.value = tournaments.value.filter(t => t.id !== id)
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete tournament'
        return { success: false, error: response.error || 'Failed to delete tournament' }
      }
    } catch (err) {
      if (isApiError(err)) {
        error.value = err.data?.message || err.statusMessage || 'Failed to delete tournament'
        return { 
          success: false, 
          error: err.data?.message || err.statusMessage || 'Failed to delete tournament' 
        }
      } else {
        error.value = 'Failed to delete tournament'
        return { 
          success: false, 
          error: 'Failed to delete tournament' 
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const restoreTournament = async (id: string): Promise<TournamentResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<SingleTournamentApiResponse>(`/api/tournaments/${id}/restore`, {
        method: 'POST'
      })
      
      if (response.success && response.data?.tournament) {
        tournaments.value.push(response.data.tournament)
        return { success: true, tournament: response.data.tournament }
      } else {
        error.value = response.error || 'Failed to restore tournament'
        return { success: false, error: response.error || 'Failed to restore tournament' }
      }
    } catch (err) {
      if (isApiError(err)) {
        error.value = err.data?.message || err.statusMessage || 'Failed to restore tournament'
        return { 
          success: false, 
          error: err.data?.message || err.statusMessage || 'Failed to restore tournament' 
        }
      } else {
        error.value = 'Failed to restore tournament'
        return { 
          success: false, 
          error: 'Failed to restore tournament' 
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const addTournament = (tournament: TournamentApiResponse): void => {
    tournaments.value.push(tournament)
  }

  const updateTournamentInList = (updatedTournament: TournamentApiResponse): void => {
    const index = tournaments.value.findIndex(t => t.id === updatedTournament.id)
    if (index !== -1) {
      tournaments.value[index] = updatedTournament
    }
  }

  const removeTournamentFromList = (tournamentId: string): void => {
    tournaments.value = tournaments.value.filter(t => t.id !== tournamentId)
  }

  return {
    // State
    tournaments,
    isLoading,
    error,
    // Actions
    fetchTournaments,
    createTournament,
    updateTournament,
    deleteTournament,
    restoreTournament,
    addTournament,
    updateTournamentInList,
    removeTournamentFromList
  }
})

// Export for compatibility
export const useTournaments = useTournamentsStore