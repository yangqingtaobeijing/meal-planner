<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'

const isDark = ref(true)

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('meal-theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem('meal-theme')
  isDark.value = saved !== 'light'
  applyTheme(isDark.value)
})

provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background-color: var(--t-bg-base);
}
</style>
