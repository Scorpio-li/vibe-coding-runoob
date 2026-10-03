import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    (task.status === 'todo' ||
      task.status === 'in-progress' ||
      task.status === 'done') &&
    (task.priority === 'low' ||
      task.priority === 'medium' ||
      task.priority === 'high') &&
    typeof task.dueDate === 'string' &&
    typeof task.createdAt === 'string'
  )
}

export function hasStoredTasks(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (storedTasks === null) {
      return []
    }

    const parsed: unknown = JSON.parse(storedTasks)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isTask)
  } catch {
    return []
  }
}
