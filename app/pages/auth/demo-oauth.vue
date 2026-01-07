<template>
  <div
    class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md">
      <UPageCard>
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20">
            <UIcon name="i-heroicons-cog-6-tooth" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 class="mt-6 text-2xl font-bold text-neutral-900 dark:text-white">Google OAuth Setup Required</h2>
          <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            To use Google authentication, you need to configure OAuth credentials.
          </p>
        </div>

        <div class="mt-6 space-y-4">
          <UAlert
            type="info"
            title="Setup Instructions"
            description="Follow the steps in GOOGLE_OAUTH_SETUP.md to configure Google OAuth credentials."
          />

          <div class="space-y-3">
            <h3 class="text-sm font-medium text-neutral-900 dark:text-white">Required Environment Variables:</h3>
            <div class="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 font-mono text-sm">
              <div>GOOGLE_CLIENT_ID=your_client_id</div>
              <div>GOOGLE_CLIENT_SECRET=your_client_secret</div>
            </div>
          </div>

          <div class="flex space-x-3">
            <UButton color="primary" variant="solid" class="flex-1" @click="goBack"> Go Back </UButton>
            <UButton color="gray" variant="outline" class="flex-1" @click="retryOAuth"> Retry OAuth </UButton>
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta
definePageMeta({
  layout: 'auth',
  auth: false,
});

useHead({
  title: 'OAuth Setup - Chess Tournament Manager',
});

const route = useRoute();

const goBack = () => {
  const redirectTo = (route.query.redirectTo as string) || '/auth/login';
  navigateTo(redirectTo);
};

const retryOAuth = () => {
  const redirectTo = (route.query.redirectTo as string) || '/auth/login';
  window.location.href = `/api/auth/google/redirect?redirectTo=${encodeURIComponent(redirectTo)}`;
};
</script>
