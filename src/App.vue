<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, taskStore, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

const activeView = ref<'list' | 'kanban'>('list')
const mobileMenuOpen = ref(false)
const completedCount = computed(
  () => taskStore.tasks.filter((task) => task.status === 'done').length,
)

const isTaskModalOpen = ref(false)

function toggleTask(taskId: string) {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (task) {
    updateTask(taskId, {
      status: task.status === 'done' ? 'todo' : 'done',
    })
  }
}

function moveTask(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}

function setActiveView(view: 'list' | 'kanban') {
  activeView.value = view
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav
        class="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8 sm:py-4"
        aria-label="主导航"
      >
        <a href="#" class="flex items-center gap-3 font-semibold tracking-tight">
          <span
            class="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white shadow-sm shadow-indigo-200"
            aria-hidden="true"
          >
            ✓
          </span>
          <span class="text-base sm:text-lg">Vibe Coding Runoob</span>
        </a>

        <div class="flex items-center gap-2 sm:gap-4">
          <span class="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">让每件事都有进度</span>
          <ThemeToggle />
          <button
            type="button"
            class="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-navigation-menu"
            :aria-label="mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              v-if="!mobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="size-5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="size-5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div
          v-if="mobileMenuOpen"
          id="mobile-navigation-menu"
          class="absolute inset-x-4 top-full z-40 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg sm:hidden dark:border-slate-700 dark:bg-slate-900"
        >
          <p class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">让每件事都有进度</p>
          <button
            type="button"
            class="min-h-11 w-full rounded-xl px-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="setActiveView('list')"
          >
            列表视图
          </button>
          <button
            type="button"
            class="min-h-11 w-full rounded-xl px-3 text-left text-sm font-medium transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="setActiveView('kanban')"
          >
            看板视图
          </button>
        </div>
      </nav>
    </header>

    <main
      class="mx-auto px-5 py-10 sm:px-8 sm:py-14"
      :class="activeView === 'kanban' ? 'max-w-6xl' : 'max-w-4xl'"
    >
      <section aria-labelledby="tasks-heading">
        <div
          class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p class="mb-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">我的工作区</p>
            <h1 id="tasks-heading" class="text-3xl font-bold tracking-tight">
              任务清单
            </h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
              把想法变成一步步的行动。
            </p>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            已完成
            <span class="font-semibold text-slate-800 dark:text-slate-100">{{ completedCount }}</span>
            / {{ taskStore.tasks.length }} 项
          </p>
        </div>

        <div
          class="mb-5 inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
          role="tablist"
          aria-label="任务视图"
        >
          <button
            id="list-view-tab"
            type="button"
            role="tab"
            :aria-selected="activeView === 'list'"
            aria-controls="task-view-panel"
            class="min-h-11 min-w-11 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :class="
              activeView === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            "
            @click="setActiveView('list')"
          >
            列表
          </button>
          <button
            id="kanban-view-tab"
            type="button"
            role="tab"
            :aria-selected="activeView === 'kanban'"
            aria-controls="task-view-panel"
            class="min-h-11 min-w-11 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :class="
              activeView === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
            "
            @click="setActiveView('kanban')"
          >
            看板
          </button>
        </div>

        <div
          id="task-view-panel"
          role="tabpanel"
          :aria-labelledby="activeView === 'list' ? 'list-view-tab' : 'kanban-view-tab'"
        >
          <TaskList
            v-if="activeView === 'list'"
            :tasks="taskStore.tasks"
            @toggle="toggleTask"
            @delete="deleteTask"
          />
          <KanbanBoard
            v-else
            :tasks="taskStore.tasks"
            @toggle="toggleTask"
            @delete="deleteTask"
            @move="moveTask"
          />
        </div>

        <div class="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            class="min-h-11 min-w-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:shadow-indigo-950"
            @click="isTaskModalOpen = true"
          >
            + 新建任务
          </button>
          <p class="text-xs text-slate-400 dark:text-slate-500">当前展示示例任务。</p>
        </div>
      </section>
    </main>

    <TaskModal v-model:open="isTaskModalOpen" @create="addTask" />
  </div>
</template>
