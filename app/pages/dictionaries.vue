<template>
  <div class="mx-auto max-w-7xl p-6 lg:p-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">Справочники</h1>
      <p class="mt-1 text-sm text-slate-500">Управление справочными данными</p>
    </div>

    <!-- Tabs -->
    <div class="mb-6 border-b border-slate-200">
      <div class="flex gap-4">
        <button
          @click="activeTab = 'organizations'"
          class="border-b-2 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === 'organizations' 
            ? 'border-slate-900 text-slate-900' 
            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'"
        >
          Организации
        </button>
        <button
          @click="activeTab = 'taskStates'"
          class="border-b-2 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === 'taskStates' 
            ? 'border-slate-900 text-slate-900' 
            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'"
        >
          Статусы задач
        </button>
        <button
          @click="activeTab = 'taskTypes'"
          class="border-b-2 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === 'taskTypes' 
            ? 'border-slate-900 text-slate-900' 
            : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'"
        >
          Типы задач
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <OrganizationsList v-if="activeTab === 'organizations'" />
      <TaskStatesList v-if="activeTab === 'taskStates'" />
      <TaskTypesList v-if="activeTab === 'taskTypes'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrganizationsList from '~/components/OrganizationsList.vue'
import TaskStatesList from '~/components/TaskStatesList.vue'
import TaskTypesList from '~/components/TaskTypesList.vue'

definePageMeta({
  layout: 'default',
})

const activeTab = ref('organizations')
</script>