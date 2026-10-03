import { reactive, watch } from 'vue'
import type { Task } from '../types/task'
import { hasStoredTasks, loadTasks, saveTasks } from '../utils/storage'

function createExampleTasks(): Task[] {
  return [
    {
      id: 'task-1',
      title: '整理项目需求与页面结构',
      description: '梳理核心功能，明确任务列表页面的展示内容。',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-10-06',
      createdAt: '2026-10-02T09:00:00.000Z',
    },
    {
      id: 'task-2',
      title: '实现任务创建弹窗',
      description: '完成标题、描述和优先级表单及基本校验。',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-10-10',
      createdAt: '2026-10-03T08:00:00.000Z',
    },
    {
      id: 'task-3',
      title: '检查任务本地持久化',
      description: '确认刷新页面后任务状态和内容仍然保留。',
      status: 'todo',
      priority: 'low',
      dueDate: '2026-10-12',
      createdAt: '2026-10-03T09:00:00.000Z',
    },
  ]
}

const storedTasksExist = hasStoredTasks()
const loadedTasks = loadTasks()
const initialTasks =
  !storedTasksExist && loadedTasks.length === 0
    ? createExampleTasks()
    : loadedTasks

export const taskStore = reactive({
  tasks: initialTasks,
})

if (!storedTasksExist) {
  saveTasks(taskStore.tasks)
}

watch(
  () => taskStore.tasks,
  (tasks) => saveTasks(tasks),
  { deep: true },
)

export function addTask(task: Task): void {
  taskStore.tasks.unshift(task)
}

export function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, 'id'>>,
): void {
  const task = taskStore.tasks.find((item) => item.id === taskId)
  if (task) {
    Object.assign(task, updates)
  }
}

export function deleteTask(taskId: string): void {
  const taskIndex = taskStore.tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    taskStore.tasks.splice(taskIndex, 1)
  }
}
