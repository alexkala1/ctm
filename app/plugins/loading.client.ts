export default defineNuxtPlugin(() => {
  // Custom loading behavior
  const nuxtApp = useNuxtApp();

  // Show loading on route changes
  nuxtApp.hook('page:start', () => {
    // Page is starting to load
  });

  nuxtApp.hook('page:finish', () => {
    // Page has finished loading
  });

  // Custom loading state management
  const isLoading = ref(false);

  // Provide loading state globally
  nuxtApp.provide('isLoading', isLoading);
});
