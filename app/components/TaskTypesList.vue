<template>
  <section class="rounded-xl border border-slate-200 bg-white p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">Типы задач</h2>
        <p class="mt-1 text-sm text-slate-500">{{ items.length }} типов</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="!showForm"
          @click="openCreateForm"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить
        </button>
        <button
          @click="loadItems"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7" />
          </svg>
          Обновить
        </button>
      </div>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showForm" class="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-900">{{ editingItem ? 'Редактировать' : 'Создать' }} тип</h3>
        <button @click="closeForm" class="text-sm text-slate-500 hover:text-slate-700">Закрыть</button>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="block text-xs font-medium text-slate-600">Название *</label>
          <input
            v-model.trim="form.name"
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Например: Задача"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600">Цвет</label>
          <input
            v-model.trim="form.color"
            type="color"
            class="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div v-if="editingItem" class="flex items-center gap-2">
          <input
            v-model="form.status"
            type="checkbox"
            id="status-checkbox-type"
            class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200"
          />
          <label for="status-checkbox-type" class="text-sm font-medium text-slate-700">
            Активный
          </label>
        </div>
      </div>

      <div v-if="formError" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
        <p class="text-sm text-rose-700">{{ formError }}</p>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <button
          @click="submitForm"
          :disabled="saving || !form.name"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          <svg v-if="saving" width="16" height="16" class="animate-spin" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ editingItem ? 'Сохранить' : 'Создать' }}
        </button>
        <button
          @click="closeForm"
          :disabled="saving"
          class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center gap-2 text-sm text-slate-600">
      <svg width="16" height="16" class="animate-spin text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Загрузка типов…
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-lg border border-rose-200 bg-rose-50 p-4">
      <p class="text-sm font-semibold text-rose-800">Не удалось загрузить типы</p>
      <p class="mt-1 text-sm text-rose-700">{{ error }}</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!items.length" class="text-center py-8 text-sm text-slate-500">
      <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      Типов нет
    </div>

    <!-- List -->
    <div v-else class="divide-y divide-slate-100">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="h-8 w-8 rounded-lg flex-shrink-0"
            :style="{ backgroundColor: item.color || '#94a3b8' }"
          ></div>
          <div>
            <p class="font-medium text-slate-900">{{ item.name }}</p>
            <p class="text-xs text-slate-500">
              <span class="inline-flex items-center gap-1">
                <span :class="item.status ? 'text-emerald-600' : 'text-slate-400'">
                  {{ item.status ? 'Активный' : 'Неактивный' }}
                </span>
                • ID: {{ item.id }}
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="editItem(item)"
            class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Редактировать"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="deleteItem(item)"
            class="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
            title="Удалить"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { token } = useAuth()

type TaskType = {
  id: number
  name: string
  color: string | null
  status: boolean
}

const items = ref<TaskType[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const showForm = ref(false)
const editingItem = ref<TaskType | null>(null)
const saving = ref(false)
const formError = ref<string | null>(null)

const form = reactive({
  name: '',
  color: '#8b5cf6',
  status: true,
})

function resetForm() {
  form.name = ''
  form.color = '#8b5cf6'
  form.status = true
  formError.value = null
}

function openCreateForm() {
  resetForm()
  editingItem.value = null
  showForm.value = true
}

function editItem(item: TaskType) {
  form.name = item.name
  form.color = item.color || '#8b5cf6'
  form.status = item.status
  editingItem.value = item
  showForm.value = true
  formError.value = null
}

function closeForm() {
  showForm.value = false
  editingItem.value = null
  resetForm()
}

async function loadItems() {
  loading.value = true
  error.value = null
  
  try {
    const query = `
      query GetTaskTypes {
        getTaskTypes {
          id
          name
          color
          status
        }
      }
    `
    
    const result = await graphqlRequest<{ getTaskTypes: TaskType[] }>(
      query,
      {},
      token.value
    )
    
    items.value = result.getTaskTypes ?? []
  } catch (e: any) {
    error.value = e?.message || 'Не удалось загрузить типы'
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  formError.value = null
  saving.value = true

  try {
    if (editingItem.value) {
      // Update
      const mutation = `
        mutation UpdateTaskType($id: Int!, $taskTypeUpdate: TaskTypeUpdateInput!) {
          updateTaskType(id: $id, taskTypeUpdate: $taskTypeUpdate) {
            id
            name
            color
            status
          }
        }
      `
      await graphqlRequest(mutation, {
        id: editingItem.value.id,
        taskTypeUpdate: {
          name: form.name,
          color: form.color,
          status: form.status,
        },
      }, token.value)
    } else {
      // Create
      const mutation = `
        mutation CreateTaskType($taskTypeData: TaskTypeCreateInput!) {
          createTaskType(taskTypeData: $taskTypeData) {
            id
            name
            color
            status
          }
        }
      `
      await graphqlRequest(mutation, {
        taskTypeData: {
          name: form.name,
          color: form.color,
          // status автоматически устанавливается на бэкенде
        },
      }, token.value)
    }

    closeForm()
    await loadItems()
  } catch (e: any) {
    formError.value = e?.message || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

async function deleteItem(item: TaskType) {
  if (!confirm(`Удалить тип "${item.name}"?`)) return

  try {
    const mutation = `
      mutation DeleteTaskType($id: Int!) {
        deleteTaskType(id: $id)
      }
    `
    await graphqlRequest(mutation, { id: item.id }, token.value)
    await loadItems()
  } catch (e: any) {
    alert(e?.message || 'Ошибка удаления')
  }
}

onMounted(() => {
  loadItems()
})
</script>