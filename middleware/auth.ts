export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && !['/login', '/forgot-password', '/reset-password', '/403'].includes(to.path)) {
    return navigateTo('/login')
  }

  if (authStore.isStudent && !['/login', '/forgot-password', '/reset-password', '/403', '/', '/profile', '/profile/settings'].includes(to.path)) {
    return navigateTo('/403')
  }
})