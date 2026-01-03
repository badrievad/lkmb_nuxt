<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Все организации</h2>
        <p class="mt-1 text-sm text-slate-500">{{ allOrgs.length }} организаций в системе</p>
      </div>
      <button
        @click="loadAllOrganizations"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7" />
        </svg>
        Обновить
      </button>
    </div>

    <!-- Info banner -->
    <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div class="flex items-start gap-3">
        <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-sm font-semibold text-blue-800">Управление организациями</p>
          <p class="mt-1 text-sm text-blue-700">Создание и управление организациями осуществляется через Keycloak.</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="allOrgsLoading" class="flex items-center gap-2 text-sm text-slate-600">
      <svg width="16" height="16" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Загрузка организаций…
    </div>

    <!-- Error -->
    <div v-else-if="allOrgsError" class="rounded-lg border border-rose-200 bg-rose-50 p-4">
      <div class="flex items-start gap-3">
        <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-sm font-semibold text-rose-800">Не удалось загрузить организации</p>
          <p class="mt-1 text-sm text-rose-700">{{ allOrgsError }}</p>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!allOrgs.length" class="text-center py-8 text-sm text-slate-500">
      <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      Организаций нет
    </div>

    <!-- List -->
    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="org in allOrgs"
        :key="org.id"
        class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
            :style="{ backgroundColor: getOrgColor(org.name) }"
          >
            {{ getOrgInitial(org.name) }}
          </div>
          <div>
            <p class="font-medium text-slate-900">{{ org.name }}</p>
            <p class="text-sm text-slate-500">ID: {{ org.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { token } = useAuth()

type Organization = { id: number; name: string }

const allOrgs = ref<Organization[]>([])
const allOrgsLoading = ref(false)
const allOrgsError = ref<string | null>(null)

function getOrgColor(name: string): string {
  const colors = [
    '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#6366f1', '#ef4444', '#14b8a6',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getOrgInitial(name: string): string {
  return name.charAt(0).toUpperCase() || 'O'
}

async function loadAllOrganizations() {
  allOrgsLoading.value = true
  allOrgsError.value = null
  
  try {
    const query = `
      query GetOrgs {
        getOrgs {
          id
          name
        }
      }
    `
    
    const result = await graphqlRequest<{ getOrgs: Organization[] }>(
      query,
      {},
      token.value
    )
    
    allOrgs.value = result.getOrgs ?? []
  } catch (e: any) {
    allOrgsError.value = e?.message || 'Не удалось загрузить организации'
  } finally {
    allOrgsLoading.value = false
  }
}

onMounted(() => {
  loadAllOrganizations()
})
</script>