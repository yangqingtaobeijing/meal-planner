<template>
  <div class="page-layout">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="logo">
            <span class="logo-icon">🥬</span>
            <span class="logo-text">买菜清单</span>
          </div>
          <p class="logo-sub">选好菜，一键生成购物清单</p>
        </div>
        <button class="add-recipe-btn" @click="showAddModal = true">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          添加菜谱
        </button>
      </header>

      <!-- Filters -->
      <div class="filters">
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat"
            class="cat-tab"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            <span class="cat-dot" :class="`dot-${cat}`"></span>
            {{ cat }}
            <span v-if="cat !== '全部'" class="cat-count">
              {{ getCategoryCount(cat as RecipeCategory) }}
            </span>
          </button>
        </div>

        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索菜名..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">×</button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <span class="stats-text">
          显示 <strong>{{ filteredRecipes.length }}</strong> 道菜
          <span v-if="activeCategory !== '全部'">（{{ activeCategory }}）</span>
          <span v-if="searchQuery">· 搜索"{{ searchQuery }}"</span>
        </span>
        <span v-if="menuStore.selectionCount > 0" class="selected-stats">
          已选 <strong>{{ menuStore.selectionCount }}</strong> 道
        </span>
      </div>

      <!-- Recipe Grid -->
      <div v-if="filteredRecipes.length > 0" class="recipe-grid">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          class="animate-fade-in"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-emoji">🍽️</div>
        <h3>没有找到相关菜谱</h3>
        <p>试试其他搜索词，或者<button class="link-btn" @click="showAddModal = true">添加自定义菜谱</button></p>
      </div>
    </main>

    <!-- Sidebar -->
    <MenuSidebar />

    <!-- Add Recipe Modal -->
    <AddRecipeModal v-if="showAddModal" @close="showAddModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RecipeCategory } from '@/types'
import { useRecipesStore } from '@/stores/recipesStore'
import { useMenuStore } from '@/stores/menuStore'
import RecipeCard from '@/components/RecipeCard.vue'
import MenuSidebar from '@/components/MenuSidebar.vue'
import AddRecipeModal from '@/components/AddRecipeModal.vue'

const recipesStore = useRecipesStore()
const menuStore = useMenuStore()

const activeCategory = ref<RecipeCategory | '全部'>('全部')
const searchQuery = ref('')
const showAddModal = ref(false)

const categories: (RecipeCategory | '全部')[] = ['全部', '荤菜', '素菜', '汤羹', '主食']

const filteredRecipes = computed(() => {
  return recipesStore.filterRecipes(activeCategory.value, searchQuery.value.trim())
})

function getCategoryCount(cat: RecipeCategory): number {
  return recipesStore.allRecipes.filter(r => r.category === cat).length
}
</script>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
  overflow-y: auto;
}

.topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
}

.topbar-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.logo-sub {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
  padding-left: 38px;
}

.add-recipe-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-recipe-btn svg {
  width: 16px;
  height: 16px;
}

.add-recipe-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-dim);
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cat-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.cat-tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: 600;
}

.cat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-全部 { background: var(--color-text-muted); }
.dot-荤菜 { background: var(--color-category-meat); }
.dot-素菜 { background: var(--color-category-veggie); }
.dot-汤羹 { background: var(--color-category-soup); }
.dot-主食 { background: var(--color-category-staple); }

.cat-tab.active .cat-dot {
  background: var(--color-text-inverse);
}

.cat-count {
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 1px 6px;
  font-size: 11px;
}

.cat-tab:not(.active) .cat-count {
  background: var(--color-bg-elevated);
  color: var(--color-text-muted);
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 8px 32px 8px 32px;
  color: var(--color-text-primary);
  font-size: 13px;
  width: 200px;
  outline: none;
  transition: all 0.15s;
}

.search-input:focus {
  border-color: var(--color-primary);
  width: 240px;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-clear:hover {
  color: var(--color-text-primary);
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.stats-text {
  font-size: 12px;
  color: var(--color-text-muted);
}

.stats-text strong {
  color: var(--color-text-secondary);
}

.selected-stats {
  font-size: 12px;
  color: var(--color-primary);
}

.selected-stats strong {
  font-weight: 700;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  color: var(--color-text-muted);
}

.empty-emoji {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: var(--color-text-secondary);
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  padding: 0;
}
</style>
