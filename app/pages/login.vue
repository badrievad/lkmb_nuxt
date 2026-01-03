<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <!-- Header -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div class="leading-tight">
              <p class="text-base font-semibold">Вход в систему</p>
              <p class="text-sm text-slate-500">Авторизация через Keycloak</p>
            </div>
          </div>

          <div class="mt-6">
            <ClientOnly>
              <!-- Error -->
              <div v-if="error" class="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p class="text-sm font-medium text-rose-800">Ошибка</p>
                <p class="mt-1 text-sm text-rose-700">{{ error }}</p>
              </div>

              <!-- Button -->
              <button
                @click="handleLogin"
                :disabled="!ready || authenticated"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg v-if="!ready" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <span v-if="!ready">Загрузка…</span>
                <span v-else-if="authenticated">Вы авторизованы</span>
                <span v-else>Войти</span>
              </button>

              <p class="mt-4 text-xs text-slate-500">
                Нажимая «Войти», вы будете перенаправлены на страницу Keycloak.
              </p>

              <template #fallback>
                <button
                  disabled
                  class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white opacity-50"
                >
                  <span>Загрузка…</span>
                </button>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Footer -->
        <p class="mt-6 text-center text-xs text-slate-500">
          © {{ new Date().getFullYear() }} LKMB
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'empty', // Используем пустой layout
})

const { ready, authenticated, error, login } = useAuth()

watch(authenticated, (isAuth) => {
  if (isAuth) navigateTo('/me')
})

onMounted(() => {
  if (authenticated.value) navigateTo('/me')
})

const handleLogin = async () => {
  await login()
}
</script>