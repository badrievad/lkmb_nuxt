<template>
  <div class="mx-auto max-w-7xl p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
      </div>

      <button
        @click="loadTask()"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7M19 5a9 9 0 00-14 7" />
        </svg>
        Обновить
      </button>
    </div>

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
        <p class="text-sm text-slate-600">Загрузка задачи…</p>
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
    <div v-else-if="task" class="space-y-6">
      <!-- Main info -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left: Task details -->
        <section class="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <h2 class="text-xl font-bold text-slate-900">{{ task.name }}</h2>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <!-- Type badge -->
                <span
                  v-if="task.taskType"
                  class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium"
                  :style="{
                    backgroundColor: task.taskType.color ? `${task.taskType.color}20` : '#f1f5f9',
                    color: task.taskType.color || '#475569'
                  }"
                >
                  <span
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: task.taskType.color || '#94a3b8' }"
                  ></span>
                  {{ task.taskType.name }}
                </span>

                <!-- State badge -->
                <span
                  v-if="task.taskState"
                  class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium"
                  :style="{
                    backgroundColor: task.taskState.color ? `${task.taskState.color}20` : '#f1f5f9',
                    color: task.taskState.color || '#475569'
                  }"
                >
                  <span
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: task.taskState.color || '#94a3b8' }"
                  ></span>
                  {{ task.taskState.name }}
                </span>
              </div>
            </div>

            <!-- Metadata -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-medium text-slate-500">Создано</p>
                <p class="mt-1 text-sm text-slate-900">{{ formatDateTime(task.dateCreated) }}</p>
              </div>

              <div v-if="task.dateEnd">
                <p class="text-xs font-medium text-slate-500">Дедлайн</p>
                <p class="mt-1 text-sm text-slate-900">{{ formatDate(task.dateEnd) }}</p>
              </div>

              <div v-if="task.number" class="sm:col-span-2">
                <p class="text-xs font-medium text-slate-500">Номер</p>
                <p class="mt-1 text-sm font-medium text-slate-900">{{ task.number }}</p>
              </div>

              <div v-if="task.author" class="sm:col-span-2">
                <p class="text-xs font-medium text-slate-500">Автор</p>
                <div class="mt-2 flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <span class="text-xs font-semibold">{{ getInitials(task.author) }}</span>
                  </div>
                  <span class="text-sm text-slate-900">
                    {{ task.author.name }} {{ task.author.surname }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Right: Assignees -->
        <section class="rounded-xl border border-slate-200 bg-white p-6">
          <h3 class="text-sm font-semibold text-slate-900">Исполнители</h3>
          <div class="mt-4 space-y-3">
            <div
              v-for="user in task.users"
              :key="user.id"
              class="flex items-center gap-3"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <span class="text-sm font-semibold">{{ getUserInitials(user) }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ user.name || `User #${user.id}` }}</p>
              </div>
            </div>
            <p v-if="!task.users?.length" class="text-sm text-slate-500">Нет исполнителей</p>
          </div>
        </section>
      </div>

      <!-- Comments section -->
      <section class="rounded-xl border border-slate-200 bg-white p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-900">Комментарии</h2>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {{ sortedComments.length }}
          </span>
        </div>

        <!-- Add comment form -->
        <div class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <label class="text-sm font-medium text-slate-900">Добавить комментарий</label>
          <textarea
            v-model="newComment"
            rows="3"
            class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all resize-none"
            placeholder="Напишите комментарий..."
            :disabled="addingComment"
          ></textarea>
          
          <div v-if="commentError" class="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p class="text-sm text-rose-700">{{ commentError }}</p>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <p class="text-xs text-slate-500">{{ newComment.length }} символов</p>
            <div class="flex items-center gap-2">
              <button
                @click="newComment = ''; commentError = null"
                :disabled="addingComment || !newComment.trim()"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Очистить
              </button>
              <button
                @click="addComment()"
                :disabled="addingComment || !newComment.trim()"
                class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="addingComment" width="16" height="16" class="animate-spin" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Отправить
              </button>
            </div>
          </div>
        </div>

        <!-- Comments list -->
        <div v-if="sortedComments.length" class="space-y-4">
          <div
            v-for="comment in sortedComments"
            :key="comment.id"
            class="rounded-lg border border-slate-100 bg-slate-50 p-4 hover:bg-slate-100 transition-colors"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                <span class="text-xs font-semibold">{{ getCommentUserInitials(comment) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium text-slate-900">{{ getCommentUserName(comment) }}</p>
                  <p class="text-xs text-slate-500 whitespace-nowrap">{{ formatRelativeTime(comment.dateCreated) }}</p>
                </div>
                <p class="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{{ comment.text || comment.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-sm text-slate-500">Комментариев пока нет</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const route = useRoute()
const { token } = useAuth()

const taskId = computed(() => Number(route.params.id))

type TaskUser = {
  id: number
  name: string | null
}

type Author = {
  id: number
  name: string
  surname: string
}

type Comment = {
  id: number
  userId: number
  commentableId: number
  commentableType: string
  dateCreated: string
  isDealComment: boolean
  isTaskComment: boolean
  name: string
  number?: string
  text: string
  user?: {
    name: string
    surname: string
  }
}

type Task = {
  id: number
  name: string
  number?: string
  dateCreated: string
  dateEnd: string | null
  taskState: {
    id: number
    name: string
    color: string | null
  } | null
  taskType: {
    id: number
    name: string
    color: string | null
  } | null
  author: Author | null
  users: TaskUser[]
  comments: Comment[]
}

const task = ref<Task | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const newComment = ref('')
const addingComment = ref(false)
const commentError = ref<string | null>(null)

const sortedComments = computed(() => {
  if (!task.value?.comments) return []
  // Сортируем от новых к старым
  return [...task.value.comments].sort((a, b) => {
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  })
})

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return iso
  }
}

function formatDateTime(iso: string) {
  try {
    const date = new Date(iso)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  } catch {
    return iso
  }
}

function formatRelativeTime(iso: string) {
  try {
    const date = new Date(iso)
    const now = new Date()
    
    // Учитываем разницу часовых поясов
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'только что'
    if (diffMins === 1) return '1 мин назад'
    if (diffMins < 60) return `${diffMins} мин назад`
    if (diffHours === 1) return '1 час назад'
    if (diffHours < 24) return `${diffHours} ч назад`
    if (diffDays === 1) return 'вчера'
    if (diffDays < 7) return `${diffDays} дн назад`
    
    return date.toLocaleDateString()
  } catch {
    return iso
  }
}

function getInitials(author: Author) {
  const first = author.name?.[0] || ''
  const last = author.surname?.[0] || ''
  return (first + last).toUpperCase() || '??'
}

function getUserInitials(user: TaskUser) {
  if (!user.name) return 'U'
  const parts = user.name.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return user.name.slice(0, 2).toUpperCase()
}

function getCommentUserInitials(comment: Comment) {
  if (!comment.user) return 'U'
  const first = comment.user.name?.[0] || ''
  const last = comment.user.surname?.[0] || ''
  return (first + last).toUpperCase() || 'U'
}

function getCommentUserName(comment: Comment) {
  if (!comment.user) return `User #${comment.userId}`
  return `${comment.user.name} ${comment.user.surname}`.trim()
}

async function addComment() {
  if (!newComment.value.trim()) {
    commentError.value = 'Комментарий не может быть пустым'
    return
  }

  addingComment.value = true
  commentError.value = null

  try {
    const mutation = `
      mutation AddTaskComment($taskComment: TaskCommentInput!) {
        addTaskComment(taskComment: $taskComment) {
          id
          userId
          name
          text
          number
          dateCreated
          isTaskComment
          isDealComment
          commentableId
          commentableType
          user {
            name
            surname
          }
        }
      }
    `

    const variables = {
      taskComment: {
        taskId: taskId.value,
        text: newComment.value.trim()
      }
    }

    const result = await graphqlRequest<{ addTaskComment: Comment }>(
      mutation,
      variables,
      token.value
    )

    // Оптимистичное обновление - добавляем комментарий сразу в список
    if (task.value && result.addTaskComment) {
      // Используем локальное время вместо серверного для корректного отображения "только что"
      const optimisticComment = {
        ...result.addTaskComment,
        dateCreated: new Date().toISOString()
      }
      task.value.comments.push(optimisticComment)
    }

    // Очищаем форму
    newComment.value = ''
    
  } catch (e: any) {
    commentError.value = e?.message || 'Не удалось добавить комментарий'
  } finally {
    addingComment.value = false
  }
}

async function loadTask() {
  loading.value = true
  error.value = null
  try {
    // Пробуем camelCase (стандартная конвенция Strawberry)
    const query = `
      query GetTask($id: Int!) {
        getTask(id: $id) {
          id
          name
          number
          dateCreated
          dateEnd
          author {
            id
            name
            surname
          }
          taskState {
            id
            name
            color
          }
          taskType {
            id
            name
            color
          }
          users {
            id
            name
          }
          comments {
            id
            userId
            commentableId
            commentableType
            dateCreated
            isDealComment
            isTaskComment
            name
            number
            text
            user {
              name
              surname
            }
          }
        }
      }
    `

    const result = await graphqlRequest<{ getTask: Task }>(
      query,
      { id: taskId.value },
      token.value
    )

    task.value = result.getTask
  } catch (e: any) {
    // Если не сработало, пробуем snake_case
    if (e?.message?.includes('getTask')) {
      try {
        const querySnake = `
          query GetTask($id: Int!) {
            get_task(id: $id) {
              id
              name
              number
              dateCreated
              dateEnd
              author {
                id
                name
                surname
              }
              taskState {
                id
                name
                color
              }
              taskType {
                id
                name
                color
              }
              users {
                id
                name
              }
              comments {
                id
                userId
                commentableId
                commentableType
                dateCreated
                isDealComment
                isTaskComment
                name
                number
                text
                user {
                  name
                  surname
                }
              }
            }
          }
        `

        const resultSnake = await graphqlRequest<{ get_task: Task }>(
          querySnake,
          { id: taskId.value },
          token.value
        )

        task.value = resultSnake.get_task
        return
      } catch (e2: any) {
        error.value = e2?.message || 'Не удалось загрузить задачу'
      }
    }
    
    error.value = e?.message || 'Не удалось загрузить задачу'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTask()
})
</script>