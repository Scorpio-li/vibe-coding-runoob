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
  move: [taskId: string, status: TaskStatus]
}>()

const columns: { label: string; status: TaskStatus; color: string }[] = [
  { label: '待办', status: 'todo', color: 'bg-slate-400' },
  { label: '进行中', status: 'in-progress', color: 'bg-indigo-500' },
  { label: '已完成', status: 'done', color: 'bg-emerald-500' },
]

const draggingTaskId = ref<string | null>(null)

const tasksByStatus = computed(() =>
  Object.fromEntries(
    columns.map(({ status }) => [
      status,
      [...props.tasks]
        .filter((task) => task.status === status)
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        ),
    ]),
  ) as Record<TaskStatus, Task[]>,
)

function startDrag(event: DragEvent, taskId: string) {
  if (!event.dataTransfer) {
    return
  }

  draggingTaskId.value = taskId
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', taskId)
}

function endDrag() {
  draggingTaskId.value = null
}

function allowDrop(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function dropTask(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggingTaskId.value
  if (taskId) {
    emit('move', taskId, status)
  }
  endDrag()
}
</script>

<template>
  <section
    class="grid items-start gap-4 md:grid-cols-3"
    aria-label="看板任务"
  >
    <section
      v-for="column in columns"
      :key="column.status"
      class="min-w-0 rounded-2xl bg-slate-100/80 p-3 sm:p-4 dark:bg-slate-900"
      :aria-label="`${column.label}任务列`"
      @dragover="allowDrop"
      @drop="dropTask($event, column.status)"
    >
      <header class="mb-3 flex items-center justify-between px-1">
        <h2 class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span class="size-2 rounded-full" :class="column.color" aria-hidden="true" />
          {{ column.label }}
        </h2>
        <span
          class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          {{ tasksByStatus[column.status].length }}
        </span>
      </header>

      <ul class="min-h-32 space-y-3 rounded-xl" :aria-label="`${column.label}任务`">
        <TaskCard
          v-for="task in tasksByStatus[column.status]"
          :key="task.id"
          :task="task"
          draggable="true"
          class="cursor-grab active:cursor-grabbing"
          :class="draggingTaskId === task.id && 'opacity-50'"
          @dragstart="startDrag($event, task.id)"
          @dragend="endDrag"
          @toggle="emit('toggle', task.id)"
          @delete="emit('delete', task.id)"
        />
        <li
          v-if="tasksByStatus[column.status].length === 0"
          class="list-none rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500"
        >
          拖放任务到此处
        </li>
      </ul>
    </section>
  </section>
</template>
