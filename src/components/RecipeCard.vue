<template>
  <div
    class="recipe-card"
    :class="{ selected: isSelected, custom: recipe.isCustom }"
    @click="handleClick"
  >
    <div class="card-header">
      <div class="card-title-row">
        <span class="card-name">{{ recipe.name }}</span>
        <div class="badges">
          <span v-if="recipe.isCustom" class="badge custom-badge">自定义</span>
          <span class="badge cat-badge" :class="`cat-${recipe.category}`">{{ recipe.category }}</span>
        </div>
      </div>
      <div class="ingredient-count">{{ nonSpiceCount }} 种食材 · {{ spiceCount }} 种调料</div>
    </div>

    <div v-if="isSelected" class="servings-control" @click.stop>
      <button
        v-for="n in [1, 2, 3]"
        :key="n"
        class="servings-btn"
        :class="{ active: currentServings === n }"
        @click="setServings(n)"
      >
        ×{{ n }}
      </button>
    </div>

    <div v-if="recipe.isCustom && !isSelected" class="delete-btn" @click.stop="handleDelete" title="删除自定义菜谱">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>

    <div v-if="isSelected" class="selected-indicator">
      <svg viewBox="0 0 20 20" fill="currentColor" class="check-icon">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '@/types'
import { useMenuStore } from '@/stores/menuStore'
import { useRecipesStore } from '@/stores/recipesStore'

const props = defineProps<{ recipe: Recipe }>()

const menuStore = useMenuStore()
const recipesStore = useRecipesStore()

const isSelected = computed(() => menuStore.isSelected(props.recipe.id))
const currentServings = computed(() => menuStore.getServings(props.recipe.id))
const nonSpiceCount = computed(() => props.recipe.ingredients.filter((i: { isSpice: boolean }) => !i.isSpice).length)
const spiceCount = computed(() => props.recipe.ingredients.filter((i: { isSpice: boolean }) => i.isSpice).length)

function handleClick() {
  menuStore.toggleRecipe(props.recipe.id)
}

function setServings(n: number) {
  menuStore.setServings(props.recipe.id, n)
}

function handleDelete() {
  if (confirm(`确定删除自定义菜谱"${props.recipe.name}"吗？`)) {
    // Remove from selected if selected
    menuStore.removeRecipe(props.recipe.id)
    recipesStore.deleteCustomRecipe(props.recipe.id)
  }
}
</script>

<style scoped>
.recipe-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.recipe-card:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
  transform: translateY(-1px);
}

.recipe-card.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-dim);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.badges {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.custom-badge {
  background: var(--color-accent-dim);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

.cat-badge {
  border: 1px solid currentColor;
}

.cat-荤菜 { color: var(--color-category-meat); background: rgba(224, 92, 75, 0.1); }
.cat-素菜 { color: var(--color-category-veggie); background: rgba(63, 200, 122, 0.1); }
.cat-汤羹 { color: var(--color-category-soup); background: rgba(74, 159, 232, 0.1); }
.cat-主食 { color: var(--color-category-staple); background: rgba(240, 165, 0, 0.1); }

.ingredient-count {
  font-size: 11px;
  color: var(--color-text-muted);
}

.servings-control {
  display: flex;
  gap: 6px;
  margin-top: 12px;
}

.servings-btn {
  flex: 1;
  padding: 5px 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.servings-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.servings-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.2s ease;
}

.check-icon {
  width: 13px;
  height: 13px;
  color: var(--color-text-inverse);
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
}

.delete-btn svg {
  width: 13px;
  height: 13px;
}

.recipe-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: var(--color-accent-dim);
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
