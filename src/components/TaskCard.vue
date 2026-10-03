<script setup lang="ts">
import type { Task } from '../types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
}>()

const priorityLabels = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
}

const priorityStyles = {
  low: 'border-l-green-500 dark:border-l-green-400',
  medium: 'border-l-yellow-500 dark:border-l-yellow-400',
  high: 'border-l-red-500 dark:border-l-red-400',
}

const priorityTextStyles = {
  low: 'text-green-700 dark:text-green-400',
  medium: 'text-yellow-700 dark:text-yellow-300',
  high: 'text-red-700 dark:text-red-400',
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
</script>

<template>
  <li
    class="list-none rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 transition duration-200 hover:scale-[1.02] hover:border-slate-300 hover:shadow-md sm:p-6 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-slate-600"
    :class="priorityStyles[props.task.priority]"
  >
    <article class="flex items-start gap-4">
      <label class="-ml-2 -mt-2 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg">
        <input
          type="checkbox"
          :checked="props.task.status === 'done'"
          :aria-label="`标记「${props.task.title}」为完成`"
          class="size-5 cursor-pointer rounded border-slate-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600"
          @change="emit('toggle')"
        />
      </label>

      <div class="min-w-0 flex-1">
        <h2
          class="font-semibold text-slate-900 dark:text-slate-100"
          :class="props.task.status === 'done' && 'text-slate-400 line-through dark:text-slate-500'"
        >
          {{ props.task.title }}
        </h2>
        <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {{ props.task.description }}
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            class="text-xs font-medium"
            :class="priorityTextStyles[props.task.priority]"
          >
            {{ priorityLabels[props.task.priority] }}
          </span>
          <span v-if="props.task.dueDate" class="text-xs text-slate-400 dark:text-slate-500">
            截止 {{ formatDate(props.task.dueDate) }}
          </span>
          <span v-else class="text-xs text-slate-400 dark:text-slate-500">未设置截止日期</span>
        </div>
      </div>

      <button
        type="button"
        :aria-label="`删除「${props.task.title}」`"
        class="flex size-11 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
        @click="emit('delete')"
      >
        <span aria-hidden="true">×</span>
      </button>
    </article>
  </li>
</template>
