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
        <div class="topbar-actions">
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换白天模式' : '切换夜间模式'">
            <span>{{ isDark ? '☀️' : '🌙' }}</span>
            <span class="theme-label">{{ isDark ? '白天' : '夜间' }}</span>
          </button>
          <button class="random-btn" @click="showRandomModal = true">
            <span>🎲</span>
            <span>随机选菜</span>
          </button>
          <button class="add-recipe-btn" @click="showAddModal = true">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            添加菜谱
          </button>
        </div>
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
          @edit="openEditModal"
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

    <!-- Add / Edit Recipe Modal -->
    <AddRecipeModal v-if="showAddModal" @close="showAddModal = false" />
    <AddRecipeModal v-if="editingRecipe" :edit-recipe="editingRecipe" @close="editingRecipe = null" />

    <!-- Random Pick Modal -->
    <Teleport to="body">
      <div v-if="showRandomModal" class="modal-overlay" @click.self="showRandomModal = false">
        <div class="random-modal animate-scale-in">
          <div class="random-modal-header">
            <span>🎲 随机选菜</span>
            <button class="close-btn" @click="showRandomModal = false">✕</button>
          </div>
          <div class="random-modal-body">
            <p class="random-desc">从全部菜谱中随机选出几道，加入已选菜单</p>
            <div class="random-count-row">
              <span>随机选</span>
              <div class="count-btns">
                <button v-for="n in [1,2,3,4,5,6]" :key="n" class="count-btn" :class="{active: randomCount === n}" @click="randomCount = n">{{ n }}</button>
              </div>
              <span>道菜</span>
            </div>
            <div class="random-category-row">
              <span class="random-label">分类限定</span>
              <div class="cat-chips">
                <button
                  v-for="cat in ['全部', '荤菜', '素菜', '汤羹', '主食']"
                  :key="cat"
                  class="cat-chip"
                  :class="{ active: randomCategory === cat }"
                  @click="randomCategory = cat"
                >{{ cat }}</button>
              </div>
            </div>
          </div>
          <div class="random-modal-footer">
            <button class="btn-cancel" @click="showRandomModal = false">取消</button>
            <button class="btn-random" @click="doRandomPick">🎲 开始随机</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { RecipeCategory, Recipe } from '@/types'
import { useRecipesStore } from '@/stores/recipesStore'
import { useMenuStore } from '@/stores/menuStore'
import RecipeCard from '@/components/RecipeCard.vue'
import MenuSidebar from '@/components/MenuSidebar.vue'
import AddRecipeModal from '@/components/AddRecipeModal.vue'

const recipesStore = useRecipesStore()
const menuStore = useMenuStore()

const isDark = inject<{ value: boolean }>('isDark', { value: true })
const toggleTheme = inject<() => void>('toggleTheme', () => {})

const activeCategory = ref<RecipeCategory | '全部'>('全部')
const searchQuery = ref('')
const showAddModal = ref(false)
const editingRecipe = ref<Recipe | null>(null)
const showRandomModal = ref(false)
const randomCount = ref(3)
const randomCategory = ref<string>('全部')

function openEditModal(recipe: Recipe) {
  editingRecipe.value = recipe
}

function doRandomPick() {
  const pool = recipesStore.allRecipes.filter(r =>
    randomCategory.value === '全部' || r.category === randomCategory.value
  )
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const picks = shuffled.slice(0, Math.min(randomCount.value, shuffled.length))
  picks.forEach(r => {
    if (!menuStore.isSelected(r.id)) {
      menuStore.toggleRecipe(r.id)
    }
  })
  showRandomModal.value = false
}

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
  color: var(--t-text-primary);
  letter-spacing: -0.02em;
}

.logo-sub {
  font-size: 13px;
  color: var(--t-text-muted);
  margin: 0;
  padding-left: 38px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.theme-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--t-border);
  background: var(--t-bg-elevated);
  color: var(--t-text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.theme-toggle-btn:hover {
  background: var(--t-bg-hover);
  color: var(--t-text-primary);
  border-color: var(--t-border-subtle);
}

.theme-label {
  font-size: 13px;
}

.random-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--t-success);
  background: var(--t-success-dim);
  color: var(--t-success);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.random-btn:hover {
  background: var(--t-success);
  color: var(--t-text-inverse);
}

/* Random modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.random-modal {
  background: var(--t-bg-surface);
  border: 1px solid var(--t-border);
  border-radius: 14px;
  width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.random-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid var(--t-border);
  font-size: 16px;
  font-weight: 700;
  color: var(--t-text-primary);
}

.random-modal-header .close-btn {
  background: none;
  border: none;
  color: var(--t-text-muted);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}
.random-modal-header .close-btn:hover {
  background: var(--t-bg-hover);
  color: var(--t-text-primary);
}

.random-modal-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.random-desc {
  font-size: 13px;
  color: var(--t-text-secondary);
  margin: 0;
}

.random-count-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--t-text-primary);
}

.count-btns {
  display: flex;
  gap: 6px;
}

.count-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--t-border);
  border-radius: 8px;
  background: var(--t-bg-elevated);
  color: var(--t-text-secondary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.count-btn:hover { border-color: var(--t-success); color: var(--t-success); }
.count-btn.active { background: var(--t-success); border-color: var(--t-success); color: white; }

.random-category-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.random-label {
  font-size: 13px;
  color: var(--t-text-secondary);
  flex-shrink: 0;
}

.cat-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.cat-chip {
  padding: 4px 12px;
  border: 1px solid var(--t-border);
  border-radius: 20px;
  background: var(--t-bg-elevated);
  color: var(--t-text-secondary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.cat-chip:hover { border-color: var(--t-primary); color: var(--t-primary); }
.cat-chip.active { background: var(--t-primary-dim); border-color: var(--t-primary); color: var(--t-primary); font-weight: 700; }

.random-modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 14px 22px 18px;
  border-top: 1px solid var(--t-border);
}

.btn-cancel {
  padding: 9px 18px;
  background: none;
  border: 1px solid var(--t-border);
  border-radius: 8px;
  color: var(--t-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover { color: var(--t-text-primary); border-color: var(--t-text-secondary); }

.btn-random {
  padding: 9px 22px;
  background: var(--t-success);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-random:hover { opacity: 0.85; }

.add-recipe-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  color: var(--t-text-secondary);
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
  border-color: var(--t-primary);
  color: var(--t-primary);
  background: var(--t-primary-dim);
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
  border: 1px solid var(--t-border);
  border-radius: 20px;
  background: var(--t-bg-card);
  color: var(--t-text-secondary);
  font-size: 13px;
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

.cat-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-全部 { background: var(--t-text-muted); }
.dot-荤菜 { background: var(--color-category-meat); }
.dot-素菜 { background: var(--color-category-veggie); }
.dot-汤羹 { background: var(--color-category-soup); }
.dot-主食 { background: var(--color-category-staple); }

.cat-tab.active .cat-dot {
  background: var(--t-text-inverse);
}

.cat-count {
  background: rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 1px 6px;
  font-size: 11px;
}

.cat-tab:not(.active) .cat-count {
  background: var(--t-bg-elevated);
  color: var(--t-text-muted);
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
  color: var(--t-text-muted);
  pointer-events: none;
}

.search-input {
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  padding: 8px 32px 8px 32px;
  color: var(--t-text-primary);
  font-size: 13px;
  width: 200px;
  outline: none;
  transition: all 0.15s;
}

.search-input:focus {
  border-color: var(--t-primary);
  width: 240px;
}

.search-input::placeholder {
  color: var(--t-text-muted);
}

.search-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--t-text-muted);
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
  color: var(--t-text-primary);
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--t-border-subtle);
}

.stats-text {
  font-size: 12px;
  color: var(--t-text-muted);
}

.stats-text strong {
  color: var(--t-text-secondary);
}

.selected-stats {
  font-size: 12px;
  color: var(--t-primary);
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
  color: var(--t-text-muted);
}

.empty-emoji {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: var(--t-text-secondary);
  margin: 0 0 8px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--t-primary);
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  padding: 0;
}
</style>
