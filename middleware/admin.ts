export default defineNuxtRouteMiddleware(_to => {
  const { $auth } = useNuxtApp();

  // Check if user is authenticated
  if (!$auth?.session?.value?.user) {
    return navigateTo('/auth/login');
  }

  // Check if user is approved
  if ($auth.session.value.user.status !== 'APPROVED') {
    return navigateTo('/auth/login?message=pending-approval');
  }

  // Check if user has admin privileges
  const userRole = $auth.session.value.user.role;
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Admin privileges required.',
    });
  }
});
