<script setup lang="ts">
type AssignedUser = {
  id: number
  name: string | null
}

const props = defineProps<{
  users: AssignedUser[]
}>()

function getUserInitials(userName: string | null, userId: number): string {
  if (!userName) return `#${userId}`
  
  const parts = userName.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return userName.slice(0, 2).toUpperCase()
}

function getUserName(userName: string | null, userId: number): string {
  return userName || `User #${userId}`
}

const displayedUsers = computed(() => props.users.slice(0, 3))
const remainingCount = computed(() => Math.max(0, props.users.length - 3))
</script>

<template>
  <div v-if="users.length === 0" class="text-slate-400">—</div>
  <div v-else class="flex items-center -space-x-2">
    <div
      v-for="u in displayedUsers"
      :key="u.id"
      :title="getUserName(u.name, u.id)"
      class="group relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700 transition-transform hover:z-10 hover:scale-110"
    >
      {{ getUserInitials(u.name, u.id) }}
      
      <!-- Tooltip -->
      <div class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {{ getUserName(u.name, u.id) }}
        <div class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
    
    <div
      v-if="remainingCount > 0"
      :title="`Ещё ${remainingCount} ${remainingCount === 1 ? 'исполнитель' : 'исполнителей'}`"
      class="group relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-semibold text-slate-700"
    >
      +{{ remainingCount }}
      
      <!-- Tooltip -->
      <div class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        Ещё {{ remainingCount }} {{ remainingCount === 1 ? 'исполнитель' : 'исполнителей' }}
        <div class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  </div>
</template>