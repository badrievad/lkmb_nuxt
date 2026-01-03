<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Overlay for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        @click="sidebarOpen = false"
        class="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="sidebarOpen"
        class="fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white overflow-visible"
      >
        <!-- Centered collapse button (desktop only) -->
        <button
          @click="sidebarOpen = false"
          class="absolute right-0 top-1/2 z-40 hidden lg:flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 hover:shadow-lg transition-all"
          title="Скрыть меню"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex h-screen flex-col">
          <!-- Organization selector -->
          <div class="border-b border-slate-200 p-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Организация</p>
              
              <!-- Collapse button (mobile only) -->
              <button
                @click="sidebarOpen = false"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors lg:hidden"
                title="Скрыть меню"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            
            <div v-if="userOrgs.loading.value && !userOrgs.organizations.value.length">
              <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <svg width="20" height="20" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm text-slate-600">Загрузка...</p>
              </div>
            </div>

            <div v-else-if="userOrgs.organizations.value.length > 0" class="relative">
              <button
                @click="showOrgDropdown = !showOrgDropdown"
                class="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-left hover:border-slate-300 hover:bg-slate-50 transition-all"
                :class="{ 'border-slate-300 bg-slate-50': showOrgDropdown }"
              >
                <div
                  class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
                  :style="{ backgroundColor: getOrgColor(userOrgs.selectedOrg.value?.name || '') }"
                >
                  {{ getOrgInitial(userOrgs.selectedOrg.value?.name || '') }}
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ userOrgs.selectedOrg.value?.name || 'Выберите...' }}</p>
                  <p class="text-xs text-slate-500">{{ userOrgs.organizations.value.length }} доступно</p>
                </div>

                <svg 
                  class="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform" 
                  :class="{ 'rotate-180': showOrgDropdown }" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="showOrgDropdown"
                  @click.stop
                  class="absolute left-0 right-0 top-full mt-2 rounded-lg border border-slate-200 bg-white shadow-xl overflow-hidden z-50"
                >
                  <div class="max-h-80 overflow-y-auto p-2">
                    <button
                      v-for="org in userOrgs.organizations.value"
                      :key="org.id"
                      @click="selectOrg(org)"
                      class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                      :class="userOrgs.selectedOrg.value?.id === org.id ? 'bg-slate-100' : 'hover:bg-slate-50'"
                    >
                      <div
                        class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white text-sm font-bold"
                        :style="{ backgroundColor: getOrgColor(org.name) }"
                      >
                        {{ getOrgInitial(org.name) }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <span class="block truncate text-sm font-medium text-slate-900">{{ org.name }}</span>
                      </div>
                      <svg 
                        v-if="userOrgs.selectedOrg.value?.id === org.id" 
                        class="h-5 w-5 flex-shrink-0 text-slate-600" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div v-else class="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p class="text-xs text-amber-800">Вы не привязаны ни к одной организации</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto p-3">
            <div class="space-y-1">
              <NuxtLink
                to="/me"
                @click="closeSidebarOnMobile"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                active-class="!bg-slate-900 !text-white"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Профиль
              </NuxtLink>

              <NuxtLink
                to="/dictionaries"
                @click="closeSidebarOnMobile"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                active-class="!bg-slate-900 !text-white"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Справочники
              </NuxtLink>
            </div>
          </nav>

          <!-- User section -->
          <div class="border-t border-slate-200 p-3">
            <div class="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold">
                  {{ userInitials }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-900">{{ userName }}</p>
                  <p class="truncate text-xs text-slate-500">{{ userEmail }}</p>
                </div>
              </div>
              <button
                @click="handleLogout"
                class="flex-shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                title="Выйти"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </Transition>

    <!-- Main content -->
    <main class="flex-1 flex flex-col min-w-0 transition-all duration-200" :class="{ 'lg:pl-64': sidebarOpen }">
      <!-- Centered expand button (desktop only, when sidebar closed) -->
      <button
        v-if="!sidebarOpen"
        @click="sidebarOpen = true"
        class="fixed left-0 top-1/2 z-40 hidden lg:flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 hover:shadow-lg transition-all"
        title="Показать меню"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Header (mobile only) -->
      <div class="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          @click="sidebarOpen = true"
          class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          title="Показать меню"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <div
            v-if="userOrgs.selectedOrg.value"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold"
            :style="{ backgroundColor: getOrgColor(userOrgs.selectedOrg.value?.name || '') }"
          >
            {{ getOrgInitial(userOrgs.selectedOrg.value?.name || '') }}
          </div>
          <span class="text-sm font-semibold text-slate-900">{{ userOrgs.selectedOrg.value?.name || 'Нет организации' }}</span>
        </div>
      </div>

      <!-- Page content -->
      <div class="flex-1">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { token, logout } = useAuth()
const userOrgs = useUserOrgs()

// Sidebar state
const sidebarOpen = ref(true)

// User info
const userName = ref('User')
const userEmail = ref('')
const userInitials = computed(() => {
  const name = userName.value || userEmail.value
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

const showOrgDropdown = ref(false)

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

function selectOrg(org: any) {
  userOrgs.selectOrganization(org)
  showOrgDropdown.value = false
}

function closeSidebarOnMobile() {
  // Close sidebar on mobile after navigation
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

async function loadUserInfo() {
  try {
    const meQuery = `
      query Me {
        me {
          email
          name
          preferredUsername
        }
      }
    `
    const meResult = await graphqlRequest<{ me: { email: string; name: string; preferredUsername: string } }>(
      meQuery,
      {},
      token.value
    )
    userName.value = meResult.me.name || meResult.me.preferredUsername
    userEmail.value = meResult.me.email
  } catch (e) {
    console.error('Failed to load user info:', e)
  }
}

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

onMounted(async () => {
  await loadUserInfo()
  await userOrgs.loadUserOrganizations()
  
  // Initial sidebar state based on screen size
  sidebarOpen.value = window.innerWidth >= 1024
  
  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showOrgDropdown.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>