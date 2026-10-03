<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const STORAGE_KEY = 'vibe-coding-runoob-theme'
type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')
let systemPreference: MediaQueryList | undefined
let hasSavedPreference = false

function applyTheme(value: Theme) {
  theme.value = value
  document.documentElement.classList.toggle('dark', value === 'dark')
}

function readSavedTheme(): Theme | null {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null
  } catch {
    return null
  }
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  if (!hasSavedPreference) {
    applyTheme(event.matches ? 'dark' : 'light')
  }
}

function toggleTheme() {
  const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
  applyTheme(nextTheme)
  hasSavedPreference = true
  try {
    localStorage.setItem(STORAGE_KEY, nextTheme)
  } catch {
    // Keep the selected theme active for this session if storage is unavailable.
  }
}

onMounted(() => {
  const savedTheme = readSavedTheme()
  hasSavedPreference = savedTheme !== null
  systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
  applyTheme(savedTheme ?? (systemPreference.matches ? 'dark' : 'light'))
  systemPreference.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  systemPreference?.removeEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <button
    type="button"
    class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    :aria-label="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    :title="theme === 'dark' ? '切换到亮色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <svg
      v-if="theme === 'dark'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      class="size-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        stroke-linecap="round"
        d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      class="size-5"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"
      />
    </svg>
  </button>
</template>
