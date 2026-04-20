<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">已选菜单</span>
      <span class="count-badge">{{ menuStore.selectionCount }}</span>
    </div>

    <div class="sidebar-body">
      <TransitionGroup name="menu-item" tag="ul" class="menu-list">
        <li
          v-for="sel in menuStore.selectedRecipes"
          :key="sel.recipeId"
          class="menu-item"
        >
          <div class="menu-item-info">
            <span class="menu-item-name">{{ getRecipeName(sel.recipeId) }}</span>
            <span class="menu-item-servings">×{{ sel.servings }}</span>
          </div>
          <button class="remove-btn" @click="menuStore.removeRecipe(sel.recipeId)" title="删除">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </li>
      </TransitionGroup>

      <div v-if="!menuStore.hasSelection" class="empty-hint">
        <div class="empty-icon">🛒</div>
        <p>还没有选菜</p>
        <p class="empty-sub">点击左边卡片添加</p>
      </div>
    </div>

    <div class="sidebar-footer">
      <button
        class="generate-btn"
        :class="{ disabled: !menuStore.hasSelection }"
        :disabled="!menuStore.hasSelection"
        @click="handleGenerate"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
        生成购物清单
        <span v-if="menuStore.hasSelection" class="btn-badge">{{ menuStore.selectionCount }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
import { useRecipesStore } from '@/stores/recipesStore'
import { useRouter } from 'vue-router'

const menuStore = useMenuStore()
const recipesStore = useRecipesStore()
const router = useRouter()

function getRecipeName(id: string): string {
  return recipesStore.getRecipeById(id)?.name ?? id
}

function handleGenerate() {
  if (menuStore.hasSelection) {
    router.push({ name: 'shopping' })
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--color-bg-surface);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.count-badge {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  min-width: 22px;
  text-align: center;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  transition: background 0.15s ease;
}

.menu-item:hover {
  background: var(--color-bg-hover);
}

.menu-item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.menu-item-name {
  font-size: 13px;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item-servings {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
}

.remove-btn {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
  padding: 0;
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.remove-btn:hover {
  background: var(--color-accent-dim);
  color: var(--color-accent);
}

.empty-hint {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-hint p {
  margin: 4px 0;
  font-size: 13px;
}

.empty-sub {
  font-size: 11px !important;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--color-border);
}

.generate-btn {
  width: 100%;
  padding: 12px 16px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
}

.generate-btn:hover:not(.disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 165, 0, 0.35);
}

.generate-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.btn-badge {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 11px;
}

/* TransitionGroup animations */
.menu-item-enter-active,
.menu-item-leave-active {
  transition: all 0.25s ease;
}

.menu-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.menu-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
