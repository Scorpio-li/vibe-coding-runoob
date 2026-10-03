<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()

type StatusFilter = 'all' | TaskStatus

const activeFilter = ref<StatusFilter>('all')

const filters: { label: string; value: StatusFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const visibleTasks = computed(() =>
  [...props.tasks]
    .filter(
      (task) =>
        activeFilter.value === 'all' || task.status === activeFilter.value,
    )
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    ),
)
</script>

<template>
  <section aria-label="任务列表">
    <div class="mb-4 flex flex-wrap gap-2" aria-label="按状态筛选">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :aria-pressed="activeFilter === filter.value"
        class="min-h-11 min-w-11 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        :class="
          activeFilter === filter.value
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
            : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-300'
        "
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <ul v-if="visibleTasks.length > 0" class="space-y-3" aria-label="任务">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', task.id)"
        @delete="emit('delete', task.id)"
      />
    </ul>

    <p
      v-else-if="props.tasks.length === 0"
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
      role="status"
    >
      还没有任务，点击下方按钮创建第一个吧
    </p>
    <p
      v-else
      class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
      role="status"
    >
      当前筛选条件下没有任务。
    </p>
  </section>
</template>
