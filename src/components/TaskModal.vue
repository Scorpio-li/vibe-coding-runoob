<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import type { Task, TaskPriority } from '../types/task'

const isOpen = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  create: [task: Task]
}>()

const form = reactive<{
  title: string
  description: string
  priority: TaskPriority
}>({
  title: '',
  description: '',
  priority: 'medium',
})

const titleError = ref('')

function closeModal() {
  isOpen.value = false
  titleError.value = ''
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

function submitTask() {
  const title = form.title.trim()
  if (!title) {
    titleError.value = '标题不能为空'
    return
  }

  const now = new Date()
  emit('create', {
    id: crypto.randomUUID(),
    title,
    description: form.description.trim(),
    status: 'todo',
    priority: form.priority,
    dueDate: '',
    createdAt: now.toISOString(),
  })

  form.title = ''
  form.description = ''
  form.priority = 'medium'
  titleError.value = ''
  isOpen.value = false
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-0 pt-4 sm:items-center sm:px-4 sm:py-8"
        @click.self="closeModal"
      >
        <Transition
          appear
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-y-full sm:translate-y-4 sm:scale-95"
          enter-to-class="translate-y-0 sm:scale-100"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-y-0 sm:scale-100"
          leave-to-class="translate-y-full sm:translate-y-4 sm:scale-95"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            class="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl shadow-slate-950/20 sm:rounded-2xl sm:p-8 dark:bg-slate-900"
          >
            <div class="mb-6">
              <h2 id="task-modal-title" class="text-xl font-bold text-slate-900 dark:text-slate-100">
                新建任务
              </h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">填写任务信息，稍后也可以继续调整。</p>
            </div>

            <form novalidate class="space-y-5" @submit.prevent="submitTask">
              <div>
                <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  标题 <span class="text-rose-600">*</span>
                </label>
                <input
                  id="task-title"
                  v-model="form.title"
                  type="text"
                  required
                  aria-required="true"
                  :aria-invalid="Boolean(titleError)"
                  aria-describedby="task-title-error"
                  placeholder="输入任务标题"
                  class="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
                  @input="titleError = ''"
                />
                <p
                  v-if="titleError"
                  id="task-title-error"
                  class="mt-1.5 text-sm text-rose-600"
                  role="alert"
                >
                  {{ titleError }}
                </p>
              </div>

              <div>
                <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  描述 <span class="font-normal text-slate-400 dark:text-slate-500">（选填）</span>
                </label>
                <textarea
                  id="task-description"
                  v-model="form.description"
                  rows="3"
                  placeholder="补充任务详情"
                  class="min-h-11 w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-950"
                />
              </div>

              <div>
                <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  优先级
                </label>
                <select
                  id="task-priority"
                  v-model="form.priority"
                  class="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-950"
                >
                  <option value="low">低优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="high">高优先级</option>
                </select>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  class="min-h-11 min-w-11 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  @click="closeModal"
                >
                  取消
                </button>
                <button
                  type="submit"
                  class="min-h-11 min-w-11 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:shadow-indigo-950"
                >
                  创建任务
                </button>
              </div>
            </form>
          </section>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
