<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content animate-scale-in">
        <header class="modal-header">
          <h2 class="modal-title">选择菜品</h2>
          <button class="close-btn" @click="$emit('close')">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </header>

        <div class="modal-body">
          <div class="filters">
            <div class="category-tabs">
              <button
                v-for="cat in categories"
                :key="cat"
                class="cat-tab"
                :class="{ active: activeCategory === cat }"
                @click="activeCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
            <div class="search-wrap">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索菜名..."
                class="search-input"
              />
            </div>
          </div>

          <div class="recipe-grid">
            <div
              v-for="recipe in filteredRecipes"
              :key="recipe.id"
              class="recipe-card"
              @click="handleSelect(recipe.id)"
            >
              <div class="recipe-img-placeholder" v-if="!recipe.image">
                <span>🍽️</span>
              </div>
              <img v-else :src="recipe.image" class="recipe-img" />
              <div class="recipe-info">
                <div class="recipe-name">{{ recipe.name }}</div>
                <div class="recipe-tags">
                  <span class="recipe-cat">{{ recipe.category }}</span>
                  <span v-if="recipe.isCustom" class="recipe-custom-tag">自定义</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="filteredRecipes.length === 0" class="empty-state">
            暂无匹配的菜品
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipesStore } from '@/stores/recipesStore'
import type { RecipeCategory } from '@/types'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', recipeId: string): void
}>()

const recipesStore = useRecipesStore()

const categories: (RecipeCategory | '全部')[] = ['全部', '荤菜', '素菜', '汤羹', '主食']
const activeCategory = ref<RecipeCategory | '全部'>('全部')
const searchQuery = ref('')

const filteredRecipes = computed(() => {
  return recipesStore.filterRecipes(activeCategory.value, searchQuery.value.trim())
})

function handleSelect(id: string) {
  emit('select', id)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--t-bg-surface);
  border: 1px solid var(--t-border);
  border-radius: 14px;
  width: 660px;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--t-border);
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--t-text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--t-text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}
.close-btn:hover { background: var(--t-bg-hover); color: var(--t-text-primary); }
.close-btn svg { width: 16px; height: 16px; }

.modal-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  gap: 6px;
}

.cat-tab {
  padding: 6px 14px;
  border: 1px solid var(--t-border);
  border-radius: 20px;
  background: var(--t-bg-card);
  color: var(--t-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.cat-tab:hover {
  border-color: var(--t-primary);
  color: var(--t-primary);
}
.cat-tab.active {
  background: var(--t-primary);
  border-color: var(--t-primary);
  color: var(--t-text-inverse);
  font-weight: 600;
}

.search-input {
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  padding: 6px 12px;
  color: var(--t-text-primary);
  font-size: 13px;
  outline: none;
  width: 180px;
  transition: all 0.15s;
}
.search-input:focus { border-color: var(--t-primary); width: 220px; }

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.recipe-card {
  background: var(--t-bg-card);
  border: 1px solid var(--t-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
}
.recipe-card:hover {
  border-color: var(--t-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.recipe-img-placeholder {
  height: 120px;
  background: var(--t-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.recipe-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.recipe-info {
  padding: 12px;
}

.recipe-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--t-text-primary);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-tags {
  display: flex;
  gap: 6px;
}

.recipe-cat, .recipe-custom-tag {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--t-bg-elevated);
  color: var(--t-text-secondary);
}
.recipe-custom-tag {
  background: var(--t-success-dim);
  color: var(--t-success);
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: var(--t-text-muted);
  font-size: 14px;
}

.animate-scale-in {
  animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
