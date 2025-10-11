<template>
  <div class="space-y-6">
    <!-- Content -->
    <div class="space-y-6">
      <div v-if="competitor" class="space-y-4 sm:space-y-6">
        <!-- Enhanced Header with competitor name and status -->
        <div
          class="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-3 sm:p-4"
        >
          <div class="flex flex-col gap-3">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg"
              >
                {{ competitor.firstName.charAt(0)
                }}{{ competitor.lastName.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate"
                >
                  {{ competitor.firstName }} {{ competitor.lastName }}
                </h3>
                <div
                  class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400"
                >
                  <span class="inline-flex items-center">
                    <Icon name="i-heroicons-hashtag" class="w-6 h-6 mr-1" />
                    {{ competitor.personalNumber }}
                  </span>
                  <span class="inline-flex items-center">
                    <Icon name="i-heroicons-tag" class="w-6 h-6 mr-1" />
                    {{ competitor.category }}
                  </span>
                </div>
              </div>
              <UBadge
                :color="getStatusColor(competitor.playerAcceptanceStatus)"
                variant="solid"
                size="sm"
              >
                <Icon
                  :name="getStatusIcon(competitor.playerAcceptanceStatus)"
                  class="w-6 h-6 mr-1"
                />
                {{ getStatusLabel(competitor.playerAcceptanceStatus) }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <!-- Personal Information Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-2 shadow-sm"
          >
            <div class="flex items-center space-x-2 mb-4 my-1">
              <div
                class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <Icon name="i-heroicons-user" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Personal Information
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Basic details
                </p>
              </div>
            </div>
            <div class="space-y-2">
              <div
                class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span
                  class="text-xs font-medium text-gray-600 dark:text-gray-300"
                  >Gender</span
                >
                <span
                  class="text-sm text-gray-900 dark:text-white font-semibold"
                  >{{ competitor.gender }}</span
                >
              </div>
              <div
                v-if="competitor.team"
                class="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span
                  class="text-xs font-medium text-gray-600 dark:text-gray-300"
                  >Team</span
                >
                <span
                  class="text-sm text-gray-900 dark:text-white font-semibold"
                  >{{ competitor.team }}</span
                >
              </div>
            </div>
          </div>

          <!-- Tournament Document Card -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-2 shadow-sm"
          >
            <div class="flex items-center space-x-2 mb-4 my-1">
              <div
                class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <Icon
                  name="i-heroicons-document-text"
                  class="w-5 h-5 text-white"
                />
              </div>
              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Tournament Document
                </h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Required files
                </p>
              </div>
            </div>
            <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div class="flex flex-wrap items-center gap-3">
                <div
                  class="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                  :class="
                    competitor.tournamentDocumentUrl
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                  "
                >
                  <Icon
                    :name="
                      competitor.tournamentDocumentUrl
                        ? 'i-heroicons-document-check'
                        : 'i-heroicons-document'
                    "
                    class="w-6 h-6"
                    :class="
                      competitor.tournamentDocumentUrl
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400 dark:text-gray-500'
                    "
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      competitor.tournamentDocumentUrl
                        ? 'Document Uploaded'
                        : 'No Document'
                    }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{
                      competitor.tournamentDocumentUrl
                        ? 'Ready for review'
                        : 'Pending upload'
                    }}
                  </div>
                </div>
                <UButton
                  v-if="competitor.tournamentDocumentUrl"
                  :href="competitor.tournamentDocumentUrl"
                  target="_blank"
                  rel="noopener"
                  variant="outline"
                  size="xs"
                  color="primary"
                  class="shadow-sm"
                >
                  <Icon
                    name="i-heroicons-arrow-top-right-on-square"
                    class="w-3 h-3 mr-1"
                  />
                  View
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Notes Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-2 shadow-sm">
          <div class="flex items-center space-x-2 mb-4">
            <div
              class="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm"
            >
              <Icon
                name="i-heroicons-chat-bubble-left-right"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                Admin Notes
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Additional information
              </p>
            </div>
          </div>
          <div
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded min-h-[64px] flex items-center"
          >
            <div v-if="competitor.adminNotes" class="w-full">
              <p
                class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed"
              >
                {{ competitor.adminNotes }}
              </p>
            </div>
            <div v-else class="w-full text-center">
              <Icon
                name="i-heroicons-chat-bubble-left-ellipsis"
                class="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-1"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                No admin notes available
              </p>
            </div>
          </div>
        </div>

        <!-- Approval Actions for Pending Competitors -->
        <div
          v-if="competitor.playerAcceptanceStatus === 'PENDING'"
          class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg shadow-sm mt-4"
        >
          <div class="px-3 py-3">
            <div class="flex items-center space-x-2 mb-3">
              <div
                class="w-9 h-9 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm"
              >
                <Icon name="i-heroicons-clock" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h4
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Pending Approval
                </h4>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  This competitor is waiting for admin approval
                </p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2">
              <UButton
                color="success"
                size="md"
                class="flex-1 shadow-sm"
                :loading="isProcessing"
                @click="handleApprove"
              >
                <Icon name="i-heroicons-check-circle" class="w-6 h-6 mr-2" />
                Approve
              </UButton>
              <UButton
                color="error"
                size="md"
                variant="outline"
                class="flex-1 shadow-sm"
                :loading="isProcessing"
                @click="handleReject"
              >
                <Icon name="i-heroicons-x-circle" class="w-6 h-6 mr-2" />
                Reject
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CompetitorWithDetails } from '../../../types'
import { handleError, handleSuccess } from '../../../utils/errorHandler'

interface Props {
  competitor: CompetitorWithDetails | null
}

const props = defineProps<Props>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'error'
    default:
      return 'neutral'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'APPROVED':
      return 'Approved'
    case 'REJECTED':
      return 'Rejected'
    default:
      return status
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'i-heroicons-clock'
    case 'APPROVED':
      return 'i-heroicons-check-circle'
    case 'REJECTED':
      return 'i-heroicons-x-circle'
    default:
      return 'i-heroicons-question-mark-circle'
  }
}

// Processing state for approve/reject actions
const isProcessing = ref<boolean>(false)

// Emit events for parent component
const emit = defineEmits<{
  approve: [id: string]
  reject: [id: string]
  close: []
}>()

// Handle approve action
const handleApprove = async () => {
  if (!props.competitor) return

  isProcessing.value = true
  try {
    emit('approve', props.competitor.id)
    handleSuccess('Competitor approved successfully', 'Approval Success')
    // Close modal after successful approval
    setTimeout(() => {
      emit('close')
    }, 1000)
  } catch (error) {
    handleError(error, 'Error approving competitor', 'Approval Failed')
  } finally {
    isProcessing.value = false
  }
}

// Handle reject action
const handleReject = async () => {
  if (!props.competitor) return

  isProcessing.value = true
  try {
    emit('reject', props.competitor.id)
    handleSuccess('Competitor rejected successfully', 'Rejection Success')
    // Close modal after successful rejection
    setTimeout(() => {
      emit('close')
    }, 1000)
  } catch (error) {
    handleError(error, 'Error rejecting competitor', 'Rejection Failed')
  } finally {
    isProcessing.value = false
  }
}
</script>
