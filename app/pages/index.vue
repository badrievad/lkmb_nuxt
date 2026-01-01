<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 mb-6">
        <svg class="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="text-blue-300 text-lg">Перенаправление...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { authenticated, ready } = useAuth()

// Ждём инициализации Keycloak и редиректим
watch([ready, authenticated], ([isReady, isAuth]) => {
  if (!isReady) return
  
  if (isAuth) {
    navigateTo('/me')
  } else {
    navigateTo('/login')
  }
}, { immediate: true })
</script>