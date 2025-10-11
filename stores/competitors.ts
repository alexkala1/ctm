import { defineStore } from 'pinia'
import type { 
  CompetitorApiResponse, 
  CreateCompetitorFormData, 
  UpdateCompetitorFormData, 
  CompetitorsApiResponse,
  SingleCompetitorApiResponse,
  CompetitorResult,
  AuthResult,
  EmptyApiResponse,
  ApiErrorWithMessage
} from '~/types'

export const useCompetitorsStore = defineStore('competitors', () => {
  // State
  const competitors = ref<CompetitorApiResponse[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchCompetitors = async (): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<CompetitorsApiResponse>('/api/competitors')
      if (response.success && response.data?.competitors) {
        competitors.value = response.data.competitors
      } else {
        error.value = response.error || 'Failed to fetch competitors'
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorWithMessage
      error.value = apiError.data?.message || apiError.statusMessage || 'Failed to fetch competitors'
      console.error('Fetch competitors error:', apiError)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTournamentCompetitors = async (tournamentId: string): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<CompetitorsApiResponse>(`/api/tournaments/${tournamentId}/competitors`)
      if (response.success && response.data?.competitors) {
        competitors.value = response.data.competitors
      } else {
        error.value = response.error || 'Failed to fetch tournament competitors'
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorWithMessage
      error.value = apiError.data?.message || apiError.statusMessage || 'Failed to fetch tournament competitors'
      console.error('Fetch tournament competitors error:', apiError)
    } finally {
      isLoading.value = false
    }
  }

  const createCompetitor = async (data: CreateCompetitorFormData): Promise<CompetitorResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<SingleCompetitorApiResponse>('/api/competitors', {
        method: 'POST',
        body: data
      })
      
      if (response.success && response.data?.competitor) {
        competitors.value.push(response.data.competitor)
        return { success: true, competitor: response.data.competitor }
      } else {
        error.value = response.error || 'Failed to create competitor'
        return { success: false, error: response.error || 'Failed to create competitor' }
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorWithMessage
      error.value = apiError.data?.message || apiError.statusMessage || 'Failed to create competitor'
      console.error('Create competitor error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Failed to create competitor' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const updateCompetitor = async (id: string, data: UpdateCompetitorFormData): Promise<CompetitorResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<SingleCompetitorApiResponse>(`/api/competitors/${id}`, {
        method: 'PUT',
        body: data
      })
      
      if (response.success && response.data?.competitor) {
        const index = competitors.value.findIndex(c => c.id === id)
        if (index !== -1) {
          competitors.value[index] = response.data.competitor
        }
        return { success: true, competitor: response.data.competitor }
      } else {
        error.value = response.error || 'Failed to update competitor'
        return { success: false, error: response.error || 'Failed to update competitor' }
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorWithMessage
      error.value = apiError.data?.message || apiError.statusMessage || 'Failed to update competitor'
      console.error('Update competitor error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Failed to update competitor' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const deleteCompetitor = async (id: string): Promise<AuthResult> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetch<EmptyApiResponse>(`/api/competitors/${id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        competitors.value = competitors.value.filter(c => c.id !== id)
        return { success: true }
      } else {
        error.value = response.error || 'Failed to delete competitor'
        return { success: false, error: response.error || 'Failed to delete competitor' }
      }
    } catch (err: unknown) {
      const apiError = err as ApiErrorWithMessage
      error.value = apiError.data?.message || apiError.statusMessage || 'Failed to delete competitor'
      console.error('Delete competitor error:', apiError)
      return { 
        success: false, 
        error: apiError.data?.message || apiError.statusMessage || 'Failed to delete competitor' 
      }
    } finally {
      isLoading.value = false
    }
  }

  const addCompetitor = (competitor: CompetitorApiResponse): void => {
    competitors.value.push(competitor)
  }

  const removeCompetitor = (competitorId: string): void => {
    competitors.value = competitors.value.filter(c => c.id !== competitorId)
  }

  return {
    // State
    competitors: readonly(competitors),
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Actions
    fetchCompetitors,
    fetchTournamentCompetitors,
    createCompetitor,
    updateCompetitor,
    deleteCompetitor,
    addCompetitor,
    removeCompetitor
  }
})

// Export for compatibility
export const useCompetitors = useCompetitorsStore