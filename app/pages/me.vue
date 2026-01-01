<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <!-- Top bar -->
    <header class="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div class="leading-tight">
            <p class="text-sm font-semibold">Профиль</p>
            <p class="text-xs text-slate-500">LKMB • Account</p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Выйти
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <!-- Loading -->
      <div v-if="loading" class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="flex items-center gap-3">
          <svg width="20" height="20" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="text-sm text-slate-600">Загрузка данных пользователя…</p>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <div class="flex items-start gap-3">
          <svg class="mt-0.5 h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-semibold text-rose-800">Ошибка</p>
            <p class="mt-1 text-sm text-rose-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="user" class="space-y-6">
        <!-- Profile row -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Left: profile card -->
          <section class="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-1">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <span class="text-lg font-bold">{{ userInitials }}</span>
              </div>
              <div class="min-w-0">
                <p class="truncate text-base font-semibold">{{ user.name || user.preferredUsername }}</p>
                <p class="truncate text-sm text-slate-500">{{ user.email }}</p>
              </div>
            </div>

            <div class="mt-6 space-y-4">
              <div>
                <p class="text-xs font-medium text-slate-500">Username</p>
                <p class="mt-1 text-sm font-medium text-slate-800">{{ user.preferredUsername }}</p>
              </div>

              <div>
                <p class="text-xs font-medium text-slate-500">Subject (sub)</p>
                <p class="mt-1 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                  {{ user.sub }}
                </p>
              </div>
            </div>
          </section>

          <!-- Right: details -->
          <section class="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-semibold text-slate-900">Доступы</h2>
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {{ user.roles?.length || 0 }} ролей • {{ user.groups?.length || 0 }} групп
              </span>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Roles -->
              <div>
                <p class="text-xs font-medium text-slate-500">Роли</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="role in (user.roles || [])"
                    :key="role"
                    class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {{ role }}
                  </span>
                  <span v-if="!user.roles?.length" class="text-sm text-slate-500">Нет ролей</span>
                </div>
              </div>

              <!-- Groups -->
              <div>
                <p class="text-xs font-medium text-slate-500">Группы</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="group in (user.groups || [])"
                    :key="group"
                    class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {{ group }}
                  </span>
                  <span v-if="!user.groups?.length" class="text-sm text-slate-500">Нет групп</span>
                </div>
              </div>
            </div>

            <div class="mt-8 border-t border-slate-200 pt-6">
              <p class="text-xs font-medium text-slate-500">Сессия</p>
              <p class="mt-1 text-sm text-slate-700">Авторизация через Keycloak активна.</p>
            </div>
          </section>
        </div>

        <!-- Tasks -->
        <section class="rounded-xl border border-slate-200 bg-white p-6">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">Мои задачи</h2>
              <p class="mt-0.5 text-xs text-slate-500">{{ tasks.length }} задач</p>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="toggleCreate()"
                class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Новая задача
              </button>

              <button
                @click="reloadTasks()"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7" />
                </svg>
                Обновить
              </button>
            </div>
          </div>

          <!-- Create form -->
          <div v-if="showCreate" class="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-slate-900">Создать задачу</p>
              <button @click="showCreate = false" class="text-sm text-slate-500 hover:text-slate-700">Закрыть</button>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="text-xs font-medium text-slate-600">Название</label>
                <input
                  v-model.trim="form.name"
                  type="text"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  placeholder="Например: Проверить договор / Подготовить отчет"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-slate-600">Номер (опционально)</label>
                <input
                  v-model.trim="form.number"
                  type="text"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  placeholder="Например: LKMB-123"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-slate-600">Дедлайн</label>
                <input
                  v-model="form.dateEnd"
                  type="date"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <!-- Org -->
              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-600">Организация</label>
                  <span class="text-xs text-slate-500" v-if="orgsLoading">загрузка…</span>
                </div>
                <select
                  v-model.number="form.orgId"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  :disabled="orgsLoading"
                >
                  <option :value="null" disabled>Выберите организацию…</option>
                  <option v-for="o in orgs" :key="o.id" :value="o.id">{{ o.name }}</option>
                </select>
                <p v-if="orgsError" class="mt-2 text-xs text-rose-700">{{ orgsError }}</p>
              </div>

              <!-- Task state -->
              <div>
                <div class="flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-600">Статус</label>
                  <span class="text-xs text-slate-500" v-if="statesLoading">загрузка…</span>
                </div>
                <select
                  v-model.number="form.taskStateId"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  :disabled="statesLoading"
                >
                  <option :value="null" disabled>Выберите статус…</option>
                  <option v-for="s in taskStates" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <p v-if="statesError" class="mt-2 text-xs text-rose-700">{{ statesError }}</p>
              </div>

              <!-- Task type -->
              <div>
                <div class="flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-600">Тип</label>
                  <span class="text-xs text-slate-500" v-if="typesLoading">загрузка…</span>
                </div>
                <select
                  v-model.number="form.taskTypeId"
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  :disabled="typesLoading"
                >
                  <option :value="null" disabled>Выберите тип…</option>
                  <option v-for="t in taskTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
                <p v-if="typesError" class="mt-2 text-xs text-rose-700">{{ typesError }}</p>
              </div>

              <!-- Assignees -->
              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-medium text-slate-600">Исполнители</label>
                  <span class="text-xs text-slate-500" v-if="usersLoading">загрузка…</span>
                </div>

                <select
                  v-model="form.userIds"
                  multiple
                  class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                  :disabled="usersLoading"
                >
                  <option v-for="u in users" :key="u.id" :value="u.id">
                    {{ u.name || ('User #' + u.id) }}
                  </option>
                </select>

                <p class="mt-1 text-xs text-slate-500">Можно выбрать несколько пользователей (Ctrl/⌘ + клик).</p>
                <p v-if="usersError" class="mt-2 text-xs text-rose-700">{{ usersError }}</p>
              </div>
            </div>

            <div v-if="createError" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p class="text-sm font-medium text-rose-800">Не удалось создать задачу</p>
              <p class="mt-1 text-sm text-rose-700">{{ createError }}</p>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <button
                @click="createTask()"
                :disabled="creating || !canSubmit"
                class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg v-if="creating" width="16" height="16" class="animate-spin" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Создать
              </button>

              <button
                @click="resetForm()"
                :disabled="creating"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50"
              >
                Очистить
              </button>
            </div>

            <p class="mt-3 text-xs text-slate-500">
              Требования: название, организация, статус, тип и хотя бы один исполнитель.
            </p>
          </div>

          <!-- Tasks loading -->
          <div v-if="tasksLoading" class="flex items-center gap-2 text-sm text-slate-600">
            <svg width="16" height="16" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Загрузка задач…
          </div>

          <!-- Tasks error -->
          <div v-else-if="tasksError" class="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p class="text-sm font-semibold text-rose-800">Не удалось загрузить задачи</p>
            <p class="mt-1 text-sm text-rose-700">{{ tasksError }}</p>
          </div>

          <!-- Empty -->
          <div v-else-if="!tasks.length" class="text-sm text-slate-500">Задач нет</div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-left text-slate-500">
                  <th class="py-2 pr-4 font-medium">Название</th>
                  <th class="py-2 pr-4 font-medium">Тип</th>
                  <th class="py-2 pr-4 font-medium">Статус</th>
                  <th class="py-2 pr-4 font-medium">Исполнители</th>
                  <th class="py-2 pr-4 font-medium">Создана</th>
                  <th class="py-2 font-medium">Дедлайн</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in tasks" :key="taskKey(task)" class="border-b border-slate-100 last:border-0">
                  <td class="py-2 pr-4 font-medium text-slate-900">{{ task.name }}</td>
                  <td class="py-2 pr-4 text-slate-700">{{ task.taskType?.name || '—' }}</td>
                  <td class="py-2 pr-4">
                    <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {{ task.taskState?.name || '—' }}
                    </span>
                  </td>
                  <td class="py-2 pr-4">
                    <UserAvatarGroup :users="task.users || []" />
                  </td>
                  <td class="py-2 pr-4 text-slate-600">{{ formatDate(task.dateCreated) }}</td>
                  <td class="py-2 text-slate-600">{{ task.dateEnd ? formatDate(task.dateEnd) : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Audit History -->
        <section class="rounded-xl border border-slate-200 bg-white p-6">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-slate-900">История действий</h2>
              <p class="mt-0.5 text-xs text-slate-500">{{ auditLogs.length }} записей</p>
            </div>

            <button
              @click="loadAuditLogs()"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7" />
              </svg>
              Обновить
            </button>
          </div>

          <!-- Audit loading -->
          <div v-if="auditLoading" class="flex items-center gap-2 text-sm text-slate-600">
            <svg width="16" height="16" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Загрузка истории…
          </div>

          <!-- Audit error -->
          <div v-else-if="auditError" class="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p class="text-sm font-semibold text-rose-800">Не удалось загрузить историю</p>
            <p class="mt-1 text-sm text-rose-700">{{ auditError }}</p>
          </div>

          <!-- Empty -->
          <div v-else-if="!auditLogs.length" class="text-sm text-slate-500">История пуста</div>

          <!-- Timeline -->
          <div v-else class="space-y-4">
            <div
              v-for="(log, index) in auditLogs"
              :key="index"
              class="relative flex gap-3 pb-4 last:pb-0"
              :class="{ 'border-b border-slate-100': index !== auditLogs.length - 1 }"
            >
              <!-- Timeline dot -->
              <div class="relative flex-shrink-0">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 pt-1">
                <p class="text-sm text-slate-900">{{ log.description }}</p>
                <p class="mt-1 text-xs text-slate-500">
                  {{ formatDate(log.dateCreated) }}
                  <span class="mx-1">•</span>
                  {{ new Date(log.dateCreated).toLocaleTimeString() }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import UserAvatarGroup from '~/components/UserAvatarGroup.vue'

const { token, logout } = useAuth()

type UserData = {
  id: number | null
  email: string
  groups: string[]
  name: string
  preferredUsername: string
  roles: string[]
  sub: string
}

type TaskUser = {
  id: number
  name: string | null
}

type Task = {
  dateCreated: string
  dateEnd: string | null
  name: string
  taskState: { name: string } | null
  taskType: { name: string } | null
  users: TaskUser[]
}

type SmallUser = { id: number; name: string | null }
type NamedEntity = { id: number; name: string }
type AuditLog = {
  description: string
  dateCreated: string
}

const user = ref<UserData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const tasks = ref<Task[]>([])
const tasksLoading = ref(false)
const tasksError = ref<string | null>(null)

const users = ref<SmallUser[]>([])
const usersLoading = ref(false)
const usersError = ref<string | null>(null)

const orgs = ref<NamedEntity[]>([])
const orgsLoading = ref(false)
const orgsError = ref<string | null>(null)

const taskStates = ref<NamedEntity[]>([])
const statesLoading = ref(false)
const statesError = ref<string | null>(null)

const taskTypes = ref<NamedEntity[]>([])
const typesLoading = ref(false)
const typesError = ref<string | null>(null)

const auditLogs = ref<AuditLog[]>([])
const auditLoading = ref(false)
const auditError = ref<string | null>(null)

const showCreate = ref(false)
const creating = ref(false)
const createError = ref<string | null>(null)

const form = reactive({
  orgId: null as number | null,
  name: '',
  number: '',
  taskStateId: null as number | null,
  taskTypeId: null as number | null,
  dateEnd: '', // YYYY-MM-DD
  userIds: [] as number[], // multi
})

const userInitials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.preferredUsername || user.value.email
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

const canSubmit = computed(() => {
  return (
    form.name.trim().length > 0 &&
    form.orgId != null &&
    form.taskStateId != null &&
    form.taskTypeId != null &&
    form.userIds.length > 0
  )
})

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

function taskKey(t: Task) {
  return `${t.name}__${t.dateCreated}__${t.dateEnd ?? ''}`
}

function resetForm() {
  form.name = ''
  form.number = ''
  form.dateEnd = ''
  form.userIds = []
  form.orgId = null
  form.taskStateId = null
  form.taskTypeId = null
  createError.value = null
}

async function loadUsers() {
  usersLoading.value = true
  usersError.value = null
  try {
    const q = `
      query GetUsers {
        getUsers {
          id
          name
        }
      }
    `
    const res = await graphqlRequest<{ getUsers: SmallUser[] }>(q, {}, token.value)
    users.value = res.getUsers ?? []
  } catch (e: any) {
    usersError.value = e?.message || 'Не удалось загрузить пользователей'
  } finally {
    usersLoading.value = false
  }
}

async function loadOrgsStatesTypes() {
  // грузим параллельно
  orgsLoading.value = true
  statesLoading.value = true
  typesLoading.value = true
  orgsError.value = null
  statesError.value = null
  typesError.value = null

  try {
    const q = `
      query Dictionaries {
        getOrgs { id name }
        getTaskStates { id name }
        getTaskTypes { id name }
      }
    `
    const res = await graphqlRequest<{
      getOrgs: NamedEntity[]
      getTaskStates: NamedEntity[]
      getTaskTypes: NamedEntity[]
    }>(q, {}, token.value)

    orgs.value = res.getOrgs ?? []
    taskStates.value = res.getTaskStates ?? []
    taskTypes.value = res.getTaskTypes ?? []

    // выставим дефолты, если ещё не выбрано
    if (form.orgId == null && orgs.value.length) form.orgId = orgs.value[0].id
    if (form.taskStateId == null && taskStates.value.length) form.taskStateId = taskStates.value[0].id
    if (form.taskTypeId == null && taskTypes.value.length) form.taskTypeId = taskTypes.value[0].id
  } catch (e: any) {
    const msg = e?.message || 'Не удалось загрузить справочники'
    orgsError.value = msg
    statesError.value = msg
    typesError.value = msg
  } finally {
    orgsLoading.value = false
    statesLoading.value = false
    typesLoading.value = false
  }
}

async function reloadTasks() {
  if (!user.value?.id) return
  tasksLoading.value = true
  tasksError.value = null
  try {
    const tasksQuery = `
      query UserTasks($id: Int!) {
        getUser(id: $id) {
          tasks {
            dateCreated
            dateEnd
            name
            taskState { name }
            taskType { name }
            users {
              id
              name
            }
          }
        }
      }
    `
    const tasksResult = await graphqlRequest<{ getUser: { tasks: Task[] } }>(
      tasksQuery,
      { id: user.value.id },
      token.value
    )
    tasks.value = tasksResult.getUser?.tasks ?? []
  } catch (e: any) {
    tasksError.value = e?.message || 'Не удалось загрузить задачи'
  } finally {
    tasksLoading.value = false
  }
}

function toggleCreate() {
  showCreate.value = !showCreate.value
  createError.value = null
  if (showCreate.value) {
    if (users.value.length === 0 && !usersLoading.value) loadUsers()
    if ((orgs.value.length === 0 || taskStates.value.length === 0 || taskTypes.value.length === 0) && !orgsLoading.value)
      loadOrgsStatesTypes()
  }
}

async function createTask() {
  createError.value = null
  creating.value = true
  try {
    const mutation = `
      mutation CreateTask($taskData: TaskCreateInput!) {
        createTask(taskData: $taskData) {
          id
          name
          dateCreated
          dateEnd
          taskState { name }
          taskType { name }
          users {
            id
            name
          }
        }
      }
    `

    const variables = {
      taskData: {
        orgId: form.orgId,
        name: form.name,
        number: form.number,
        taskStateId: form.taskStateId,
        taskTypeId: form.taskTypeId,
        dateEnd: form.dateEnd || null,
        userIds: form.userIds,
      },
    }

    await graphqlRequest<any>(mutation, variables, token.value)

    showCreate.value = false
    resetForm()
    await reloadTasks()
  } catch (e: any) {
    createError.value = e?.message || 'Ошибка создания задачи'
  } finally {
    creating.value = false
  }
}

async function loadAuditLogs() {
  auditLoading.value = true
  auditError.value = null
  try {
    const q = `
      query GetAuditLogs {
        getAuditLogs {
          description
          dateCreated
        }
      }
    `
    const res = await graphqlRequest<{ getAuditLogs: AuditLog[] }>(q, {}, token.value)
    auditLogs.value = res.getAuditLogs ?? []
  } catch (e: any) {
    auditError.value = e?.message || 'Не удалось загрузить историю'
  } finally {
    auditLoading.value = false
  }
}

onMounted(async () => {
  try {
    const meQuery = `
      query Me {
        me {
          id
          email
          groups
          name
          preferredUsername
          roles
          sub
        }
      }
    `
    const meResult = await graphqlRequest<{ me: UserData }>(meQuery, {}, token.value)
    user.value = meResult.me
    await reloadTasks()
    await loadAuditLogs()
  } catch (e: any) {
    error.value = e?.message || 'Не удалось загрузить данные пользователя'
  } finally {
    loading.value = false
  }
})
</script>