<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background-color: var(--color-bg-base);
}
</style>
