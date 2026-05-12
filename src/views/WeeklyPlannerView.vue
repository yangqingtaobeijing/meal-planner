<template>
  <div class="page-layout">
    <main class="main-content">
      <header class="topbar">
        <div class="topbar-left">
          <div class="logo">
            <span class="logo-icon">📅</span>
            <span class="logo-text">极简周排餐</span>
          </div>
          <p class="logo-sub">规划一周饮食，一键生成购物清单</p>
        </div>
        <div class="topbar-actions">
          <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? '切换白天模式' : '切换夜间模式'">
            <span>{{ isDark ? '☀️' : '🌙' }}</span>
            <span class="theme-label">{{ isDark ? '白天' : '夜间' }}</span>
          </button>
          <button class="nav-btn" @click="router.push({ name: 'recipes' })">
            <span>📚</span>
            <span>菜谱管理</span>
          </button>
        </div>
      </header>

      <div class="actions-bar">
        <div class="actions-left">
          <span class="stats-text" v-if="menuStore.hasSelection">
            本周已排 <strong>{{ menuStore.selectionCount }}</strong> 道菜
          </span>
          <span class="stats-text empty" v-else>
            本周还没有安排饮食，点击下方卡片开始规划吧！
          </span>
        </div>
        <div class="actions-right">
          <button class="clear-btn" @click="menuStore.clearAll()" :disabled="!menuStore.hasSelection">
            <span>🗑️</span> 清空本周
          </button>
          <button class="generate-btn" @click="handleGenerate" :disabled="!menuStore.hasSelection">
            <span>🛒</span> 生成购物清单
          </button>
        </div>
      </div>

      <div class="weekly-grid">
        <div
          v-for="day in days"
          :key="day.id"
          class="day-card"
          :class="{ 'is-today': day.id === currentDayId }"
        >
          <div class="day-header">
            <span class="day-name">{{ day.name }}</span>
            <span class="day-en">{{ day.en }}</span>
            <span v-if="day.id === currentDayId" class="today-badge">今天</span>
          </div>
          
          <div class="day-body">
            <TransitionGroup name="list" tag="div" class="recipe-list">
              <div
                v-for="recipe in menuStore.getRecipesForDay(day.id)"
                :key="recipe.recipeId"
                class="recipe-item"
              >
                <img v-if="getRecipe(recipe.recipeId)?.image" :src="getRecipe(recipe.recipeId)?.image" class="recipe-thumb" />
                <div v-else class="recipe-thumb-placeholder">🍽️</div>
                
                <div class="recipe-info">
                  <div class="recipe-name" :title="getRecipeName(recipe.recipeId)">
                    {{ getRecipeName(recipe.recipeId) }}
                  </div>
                  <div class="recipe-controls">
                    <button class="step-btn" @click="menuStore.updateServings(day.id, recipe.recipeId, recipe.servings - 1)" :disabled="recipe.servings <= 1">-</button>
                    <span class="servings-num">{{ recipe.servings }}</span>
                    <button class="step-btn" @click="menuStore.updateServings(day.id, recipe.recipeId, recipe.servings + 1)">+</button>
                  </div>
                </div>
                
                <button class="delete-btn" @click="menuStore.removeRecipeFromDay(day.id, recipe.recipeId)">✕</button>
              </div>
            </TransitionGroup>
            
            <button class="add-btn" @click="openModal(day.id)">
              <span class="add-icon">+</span> 添加菜品
            </button>
          </div>
        </div>
      </div>
    </main>

    <RecipeSelectorModal
      v-if="activeDayForModal"
      @close="activeDayForModal = null"
      @select="handleRecipeSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { useRecipesStore } from '@/stores/recipesStore'
import type { DayOfWeek } from '@/types'
import RecipeSelectorModal from '@/components/RecipeSelectorModal.vue'

const router = useRouter()
const menuStore = useMenuStore()
const recipesStore = useRecipesStore()

const isDark = inject<{ value: boolean }>('isDark', { value: true })
const toggleTheme = inject<() => void>('toggleTheme', () => {})

const days: { id: DayOfWeek; name: string; en: string }[] = [
  { id: 'Monday', name: '周一', en: 'Mon' },
  { id: 'Tuesday', name: '周二', en: 'Tue' },
  { id: 'Wednesday', name: '周三', en: 'Wed' },
  { id: 'Thursday', name: '周四', en: 'Thu' },
  { id: 'Friday', name: '周五', en: 'Fri' },
  { id: 'Saturday', name: '周六', en: 'Sat' },
  { id: 'Sunday', name: '周日', en: 'Sun' },
]

const currentDayId = computed<DayOfWeek>(() => {
  const map: Record<number, DayOfWeek> = {
    1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
    5: 'Friday', 6: 'Saturday', 0: 'Sunday'
  }
  return map[new Date().getDay()]
})

const activeDayForModal = ref<DayOfWeek | null>(null)

function openModal(day: DayOfWeek) {
  activeDayForModal.value = day
}

function handleRecipeSelect(recipeId: string) {
  if (activeDayForModal.value) {
    menuStore.addRecipeToDay(activeDayForModal.value, recipeId)
    activeDayForModal.value = null // Close modal after selection
  }
}

function getRecipe(id: string) {
  return recipesStore.getRecipeById(id)
}

function getRecipeName(id: string) {
  const recipe = getRecipe(id)
  if (!recipe) return '失效菜谱'
  return recipe.name
}

function handleGenerate() {
  if (menuStore.hasSelection) {
    router.push({ name: 'shopping' })
  }
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

.theme-toggle-btn, .nav-btn {
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

.theme-toggle-btn:hover, .nav-btn:hover {
  background: var(--t-bg-hover);
  color: var(--t-text-primary);
  border-color: var(--t-border-subtle);
}

.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: var(--t-bg-surface);
  border-radius: 12px;
  border: 1px solid var(--t-border);
}

.actions-left .stats-text {
  font-size: 14px;
  color: var(--t-text-secondary);
}
.actions-left .stats-text strong {
  color: var(--t-primary);
  font-size: 16px;
}
.actions-left .stats-text.empty {
  color: var(--t-text-muted);
}

.actions-right {
  display: flex;
  gap: 12px;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--t-border);
  border-radius: 8px;
  color: var(--t-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.clear-btn:hover:not(:disabled) {
  border-color: #ff4d4f;
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.05);
}
.clear-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.generate-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background: var(--t-primary);
  border: none;
  border-radius: 8px;
  color: var(--t-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.generate-btn:hover:not(:disabled) {
  background: var(--t-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 165, 0, 0.35);
}
.generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.weekly-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
  min-height: 60vh;
}

.day-card {
  background: var(--t-bg-surface);
  border: 1px solid var(--t-border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;
}

.day-card.is-today {
  border-color: var(--t-primary);
  box-shadow: 0 0 0 1px var(--t-primary);
}

.day-header {
  padding: 12px 14px;
  background: var(--t-bg-elevated);
  border-bottom: 1px solid var(--t-border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-card.is-today .day-header {
  background: var(--t-primary-dim);
}

.day-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--t-text-primary);
}

.day-en {
  font-size: 11px;
  color: var(--t-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.today-badge {
  margin-left: auto;
  font-size: 10px;
  padding: 2px 6px;
  background: var(--t-primary);
  color: white;
  border-radius: 4px;
  font-weight: 600;
}

.day-body {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--t-bg-surface);
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recipe-item {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 8px;
  background: var(--t-bg-card);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.recipe-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recipe-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.recipe-thumb-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: var(--t-bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recipe-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--t-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
}

.recipe-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 4px;
  color: var(--t-text-secondary);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}
.step-btn:hover:not(:disabled) {
  border-color: var(--t-primary);
  color: var(--t-primary);
}
.step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.servings-num {
  font-size: 12px;
  font-weight: 700;
  color: var(--t-text-primary);
  min-width: 12px;
  text-align: center;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  color: var(--t-text-muted);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.15s;
}
.recipe-item:hover .delete-btn {
  opacity: 1;
}
.delete-btn:hover {
  background: var(--t-bg-hover);
  color: #ff4d4f;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: var(--t-bg-elevated);
  border: 1px dashed var(--t-border-subtle);
  border-radius: 8px;
  color: var(--t-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
}
.add-btn:hover {
  border-color: var(--t-primary);
  color: var(--t-primary);
  background: var(--t-primary-dim);
}
.add-icon {
  font-size: 16px;
  line-height: 1;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 1200px) {
  .weekly-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .weekly-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .weekly-grid {
    grid-template-columns: 1fr;
  }
}
</style>
