<template>
  <div
    v-if="competitor"
    class="space-y-6"
  >
    <!-- Modern Header Section -->
    <div
      class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center space-x-4 mb-4">
        <div
          class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-user"
            class="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
        </div>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Participant Details</h1>
      </div>

      <div class="flex items-center space-x-6">
        <!-- Avatar -->
        <div
          class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
        >
          {{ competitor.firstName.charAt(0) }}{{ competitor.lastName.charAt(0) }}
        </div>

        <!-- Participant Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-3 mb-2">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ competitor.firstName }} {{ competitor.lastName }}
            </h2>
            <!-- Status badge next to name -->
            <UiStatusBadge
              :status="competitor.playerAcceptanceStatus"
              variant="solid"
              size="sm"
            />
          </div>

          <!-- Info badges -->
          <div class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
            >
              <Icon
                name="i-heroicons-hashtag"
                class="w-3 h-3 mr-1"
              />
              #{{ competitor.personalNumber }}
            </span>
            <span
              class="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full"
            >
              <Icon
                name="i-heroicons-tag"
                class="w-3 h-3 mr-1"
              />
              {{ competitor.category }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Information Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Personal Information Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-user"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
        </div>

        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <Icon
                name="i-heroicons-user-circle"
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Gender</span>
            </div>
            <span
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-md"
            >
              {{ competitor.gender }}
            </span>
          </div>

          <div
            v-if="competitor.team"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <Icon
                name="i-heroicons-users"
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
              <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Team</span>
            </div>
            <span
              class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-md"
            >
              {{ competitor.team }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tournament Document Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div class="flex items-center space-x-3 mb-4">
          <div
            class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-green-600 dark:text-green-400"
            />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tournament Document</h3>
        </div>

        <div
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <Icon
            :name="
              competitor.tournamentDocumentUrl
                ? 'i-heroicons-document-check'
                : 'i-heroicons-document'
            "
            class="w-4 h-4"
            :class="competitor.tournamentDocumentUrl ? 'text-green-500' : 'text-gray-400'"
          />
          <UButton
            v-if="competitor.tournamentDocumentUrl"
            :href="competitor.tournamentDocumentUrl"
            target="_blank"
            rel="noopener"
            variant="ghost"
            size="xs"
            color="primary"
            icon="i-heroicons-arrow-top-right-on-square"
          >
            View
          </UButton>
        </div>
      </div>
    </div>

    <!-- Admin Notes Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div class="flex items-center space-x-3 mb-4">
        <div
          class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-shield-check"
            class="w-5 h-5 text-orange-600 dark:text-orange-400"
          />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Admin Notes</h3>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg min-h-[60px] flex items-center">
        <div
          v-if="competitor?.adminNotes"
          class="w-full"
        >
          <p class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
            {{ competitor.adminNotes }}
          </p>
        </div>
        <div
          v-else
          class="w-full text-center"
        >
          <Icon
            name="i-heroicons-chat-bubble-left-ellipsis"
            class="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto mb-2"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
            No admin notes available
          </p>
        </div>
      </div>
    </div>

    <!-- Approval Actions for Pending Competitors -->
    <div
      v-if="competitor && competitor.playerAcceptanceStatus === 'PENDING'"
      class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700/50"
    >
      <div class="flex items-center space-x-3 mb-4">
        <div
          class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-clock"
            class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
          />
        </div>
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Pending Approval</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            This competitor is waiting for admin approval
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <UButton
          color="success"
          size="md"
          class="flex-1"
          :loading="isProcessing"
          icon="i-heroicons-check-circle"
          @click="handleApprove"
        >
          Approve
        </UButton>
        <UButton
          color="error"
          variant="soft"
          size="md"
          class="flex-1"
          :loading="isProcessing"
          icon="i-heroicons-x-circle"
          @click="handleReject"
        >
          Reject
        </UButton>
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
