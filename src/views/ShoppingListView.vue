<template>
  <div class="shopping-page">
    <!-- Header -->
    <header class="shopping-header">
      <div class="header-left">
        <button class="back-btn" @click="router.push({ name: 'recipes' })">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          重新选菜
        </button>
        <div class="header-info">
          <h1 class="page-title">🛒 购物清单</h1>
          <p class="page-sub">共 {{ menuStore.selectionCount }} 道菜 · {{ totalIngredients }} 种食材 · {{ spiceCount }} 种调料</p>
        </div>
      </div>

      <button class="copy-btn" :class="{ copied: copySuccess }" @click="handleCopy">
        <svg v-if="!copySuccess" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
        <svg v-else viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        {{ copySuccess ? '已复制！' : '一键复制' }}
      </button>
    </header>

    <div class="shopping-body">
      <!-- Left: Selected Dishes -->
      <aside class="dishes-panel">
        <h3 class="panel-title">选用菜谱</h3>
        <div class="dishes-list">
          <div
            v-for="sel in menuStore.selectedRecipes"
            :key="sel.recipeId"
            class="dish-item"
          >
            <span class="dish-name">{{ getRecipeName(sel.recipeId) }}</span>
            <span class="dish-serving">×{{ sel.servings }}</span>
          </div>
        </div>
      </aside>

      <!-- Right: Shopping List -->
      <div class="list-content">
        <!-- Ingredient Groups -->
        <template v-for="group in GROUP_ORDER" :key="group">
          <section
            v-if="shoppingList.ingredients[group] && shoppingList.ingredients[group].length > 0"
            class="ingredient-section animate-fade-in"
          >
            <div class="section-header">
              <div class="section-dot" :class="`dot-${group}`"></div>
              <h2 class="section-title">{{ group }}</h2>
              <span class="section-count">{{ shoppingList.ingredients[group].length }} 项</span>
            </div>

            <div class="ingredient-list">
              <div
                v-for="item in shoppingList.ingredients[group]"
                :key="item.name"
                class="ingredient-item"
              >
                <div class="ingredient-left">
                  <span v-if="item.isRepeated" class="repeat-mark" title="来自多道菜">🔁</span>
                  <span class="ingredient-name">{{ item.name }}</span>
                </div>
                <div class="ingredient-right">
                  <span class="ingredient-amount">
                    {{ item.amounts.map(a => `${a.amount}${a.unit}`).join(' + ') }}
                  </span>
                  <span class="ingredient-source">
                    来自：{{ item.sources.join('、') }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- Spice Section -->
        <section v-if="shoppingList.spices.length > 0" class="ingredient-section spice-section animate-fade-in">
          <div class="section-header">
            <div class="section-dot dot-spice"></div>
            <h2 class="section-title">调料</h2>
            <span class="section-count">{{ shoppingList.spices.length }} 项</span>
          </div>
          <div class="spice-note">调料按需添加，不列具体用量</div>
          <div class="spice-grid">
            <div
              v-for="spice in shoppingList.spices"
              :key="spice.name"
              class="spice-item"
            >
              <span class="spice-name">{{ spice.name }}</span>
              <span class="spice-sources">{{ spice.sources.join(' / ') }}</span>
            </div>
          </div>
        </section>

        <!-- Empty State -->
        <div v-if="totalIngredients === 0 && shoppingList.spices.length === 0" class="empty-list">
          <p>暂无数据，请先选菜</p>
          <button class="go-back-btn" @click="router.push({ name: 'recipes' })">去选菜</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { useRecipesStore } from '@/stores/recipesStore'
import { GROUP_ORDER } from '@/data/ingredientGroups'

const router = useRouter()
const menuStore = useMenuStore()
const recipesStore = useRecipesStore()

const shoppingList = computed(() => menuStore.shoppingList)
const copySuccess = ref(false)

const totalIngredients = computed(() => {
  return GROUP_ORDER.reduce((sum, group) => {
    return sum + (shoppingList.value.ingredients[group]?.length ?? 0)
  }, 0)
})

const spiceCount = computed(() => shoppingList.value.spices.length)

function getRecipeName(id: string): string {
  return recipesStore.getRecipeById(id)?.name ?? id
}

async function handleCopy() {
  const text = menuStore.generateCopyText()
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    // Fallback
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  }
}
</script>

<style scoped>
.shopping-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shopping-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: var(--t-bg-surface);
  border-bottom: 1px solid var(--t-border);
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 8px;
  color: var(--t-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.back-btn:hover {
  border-color: var(--t-primary);
  color: var(--t-primary);
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--t-text-primary);
  margin: 0 0 3px;
}

.page-sub {
  font-size: 12px;
  color: var(--t-text-muted);
  margin: 0;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: var(--t-primary);
  border: none;
  border-radius: 8px;
  color: var(--t-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.copy-btn svg {
  width: 16px;
  height: 16px;
}

.copy-btn:hover:not(.copied) {
  background: var(--t-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(240, 165, 0, 0.35);
}

.copy-btn.copied {
  background: var(--t-success);
  cursor: default;
}

.shopping-body {
  display: flex;
  flex: 1;
  gap: 0;
}

/* Dishes Panel */
.dishes-panel {
  width: 240px;
  min-width: 240px;
  background: var(--t-bg-surface);
  border-right: 1px solid var(--t-border);
  padding: 24px 16px;
  position: sticky;
  top: 73px;
  height: calc(100vh - 73px);
  overflow-y: auto;
}

.panel-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--t-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 14px;
  padding: 0 4px;
}

.dishes-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dish-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  border-radius: 6px;
  transition: background 0.1s;
}

.dish-item:hover {
  background: var(--t-bg-hover);
}

.dish-name {
  font-size: 13px;
  color: var(--t-text-primary);
}

.dish-serving {
  font-size: 12px;
  color: var(--t-primary);
  font-weight: 700;
}

/* List Content */
.list-content {
  flex: 1;
  padding: 28px 36px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ingredient-section {
  background: var(--t-bg-card);
  border: 1px solid var(--t-border);
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--t-bg-elevated);
  border-bottom: 1px solid var(--t-border);
}

.section-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-肉类 { background: var(--color-meat); }
.dot-蔬菜 { background: var(--color-veggie); }
.dot-海鲜水产 { background: var(--color-seafood); }
.dot-豆制品 { background: var(--color-tofu); }
.dot-蛋奶 { background: var(--color-dairy); }
.dot-其他 { background: var(--color-other); }
.dot-spice { background: var(--t-primary); }

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--t-text-primary);
  margin: 0;
}

.section-count {
  font-size: 11px;
  color: var(--t-text-muted);
  margin-left: auto;
  background: var(--t-bg-surface);
  padding: 2px 8px;
  border-radius: 10px;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
}

.ingredient-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--t-border-subtle);
  transition: background 0.1s;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-item:hover {
  background: var(--t-bg-hover);
}

.ingredient-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.repeat-mark {
  font-size: 12px;
  line-height: 1;
}

.ingredient-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--t-text-primary);
}

.ingredient-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.ingredient-amount {
  font-size: 14px;
  font-weight: 700;
  color: var(--t-primary);
  white-space: nowrap;
}

.ingredient-source {
  font-size: 11px;
  color: var(--t-text-muted);
  text-align: right;
}

/* Spice Section */
.spice-note {
  padding: 8px 20px;
  font-size: 11px;
  color: var(--t-text-muted);
  background: var(--t-bg-elevated);
  border-bottom: 1px solid var(--t-border);
  font-style: italic;
}

.spice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1px;
  background: var(--t-border-subtle);
}

.spice-item {
  background: var(--t-bg-card);
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.spice-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--t-text-primary);
}

.spice-sources {
  font-size: 10px;
  color: var(--t-text-muted);
}

.empty-list {
  text-align: center;
  padding: 80px 40px;
  color: var(--t-text-muted);
}

.go-back-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--t-primary);
  border: none;
  border-radius: 8px;
  color: var(--t-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
</style>
