export default defineNuxtRouteMiddleware((to) => {
  // Защищённые маршруты
  const protectedRoutes = ['/me']
  
  if (!protectedRoutes.includes(to.path)) return

  const auth = useState<any>('auth')
  
  // Ждём инициализации Keycloak
  if (!auth.value?.ready) return
  
  // Если не авторизован - редирект на логин
  if (!auth.value?.authenticated) {
    return navigateTo('/login')
  }
})