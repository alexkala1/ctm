<template>
  <div class="animate-pulse">
    <!-- Tournament Header Skeleton -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex-1">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div class="flex items-center gap-3">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-6" />
        </div>
      </div>
    </div>

    <!-- Participants Section Skeleton -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <!-- Filters Skeleton -->
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="space-y-4">
          <!-- Search and Actions Row -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
            <div class="flex gap-2">
              <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>
          </div>

          <!-- Active Filters -->
          <div class="flex flex-wrap gap-2">
            <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16" />
            <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-20" />
            <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-14" />
          </div>
        </div>
      </div>

      <!-- Mobile Card Layout Skeleton -->
      <div class="block sm:hidden">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="i in 5" :key="i" class="p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24" />
              </div>
              <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded-full w-16" />
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32" />
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20" />
            </div>
            <div class="flex justify-end mt-3">
              <div class="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16" />
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table Layout Skeleton -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Table Header -->
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20" />
              </th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="i in 8" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-4" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div class="h-8 bg-gray-200 dark:bg-gray-600 rounded w-20" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Skeleton -->
      <div class="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          </div>
          <div class="flex items-center gap-2">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8" />
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8" />
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8" />
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed - this is a static loading skeleton
</script>
