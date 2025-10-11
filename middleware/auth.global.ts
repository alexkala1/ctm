export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const { isAuthenticated, user } = storeToRefs(authStore)
  
  // Define auth-only routes (login/register) - redirect authenticated users away
  const authOnlyRoutes = ['/auth/login', '/auth/register']
  const isAuthOnlyRoute = authOnlyRoutes.some(route => to.path.startsWith(route))
  
  // If accessing auth pages, check authentication status
  if (isAuthOnlyRoute) {
    // Ensure auth state is checked
    await authStore.checkAuth()
    
    // Redirect authenticated users away from login/register pages
    if (isAuthenticated.value) {
      return navigateTo('/')
    }
  }
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/tournaments', 
    '/tournaments/**',
    '/support', 
    '/privacy', 
    '/terms'
  ]
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route.endsWith('**')) {
      return to.path.startsWith(route.replace('/**', ''))
    }
    return to.path.startsWith(route)
  })
  
  // Allow access to public routes
  if (isPublicRoute) {
    return
  }
  
  // For protected routes (like admin pages), check authentication
  const protectedRoutes = ['/admin', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))
  
  if (isProtectedRoute) {
    // Check if user is authenticated
    if (!isAuthenticated.value) {
      return navigateTo('/auth/login')
    }
    
    // Check if user is approved
    if (user.value?.status !== 'APPROVED') {
      return navigateTo('/auth/login?message=pending-approval')
    }
  }
})
