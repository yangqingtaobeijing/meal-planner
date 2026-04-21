<template>
  <div
    class="recipe-card"
    :class="{ selected: isSelected, 'has-image': !!recipe.image }"
    @click="handleClick"
  >
    <!-- Image Banner -->
    <div v-if="recipe.image" class="card-image">
      <img :src="recipe.image" :alt="recipe.name" @error="onImgError" />
      <div class="image-overlay"></div>
    </div>

    <div class="card-body">
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
    </div>

    <!-- Action buttons (hover) -->
    <div v-if="!isSelected" class="card-actions" @click.stop>
      <button class="action-btn edit-btn" @click="$emit('edit', recipe)" title="编辑菜谱">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
      <button v-if="recipe.isCustom" class="action-btn delete-btn" @click="handleDelete" title="删除菜谱">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
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
const emit = defineEmits<{ (e: 'edit', recipe: Recipe): void }>()

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

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.style.background = 'var(--t-bg-elevated)'
    const emojiMap: Record<string, string> = {
      '荤菜': '🍖', '素菜': '🥦', '汤羹': '🍲', '主食': '🍚',
    }
    const span = document.createElement('span')
    span.style.cssText = 'font-size:40px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)'
    span.textContent = emojiMap[props.recipe.category] || '🍽️'
    parent.appendChild(span)
  }
}

function handleDelete() {
  if (confirm(`确定删除自定义菜谱"${props.recipe.name}"吗？`)) {
    menuStore.removeRecipe(props.recipe.id)
    recipesStore.deleteCustomRecipe(props.recipe.id)
  }
}
</script>

<style scoped>
.recipe-card {
  position: relative;
  background: var(--t-bg-card);
  border: 1px solid var(--t-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.recipe-card:hover {
  border-color: var(--t-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.recipe-card.selected {
  border-color: var(--t-primary);
  background: var(--t-primary-dim);
  box-shadow: 0 0 0 1px var(--t-primary);
}

/* Image */
.card-image {
  position: relative;
  height: 100px;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4));
}

.card-body {
  padding: 12px 14px;
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
  color: var(--t-text-primary);
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
  background: var(--t-accent-dim);
  color: var(--t-accent);
  border: 1px solid var(--t-accent);
}

.cat-badge { border: 1px solid currentColor; }
.cat-荤菜 { color: #e05c4b; background: rgba(224, 92, 75, 0.1); }
.cat-素菜 { color: #3fc87a; background: rgba(63, 200, 122, 0.1); }
.cat-汤羹 { color: #4a9fe8; background: rgba(74, 159, 232, 0.1); }
.cat-主食 { color: #f0a500; background: rgba(240, 165, 0, 0.1); }

.ingredient-count {
  font-size: 11px;
  color: var(--t-text-muted);
}

.servings-control {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.servings-btn {
  flex: 1;
  padding: 5px 0;
  border: 1px solid var(--t-border);
  border-radius: 6px;
  background: var(--t-bg-surface);
  color: var(--t-text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.servings-btn:hover { border-color: var(--t-primary); color: var(--t-primary); }
.servings-btn.active { background: var(--t-primary); border-color: var(--t-primary); color: var(--t-text-inverse); }

/* Action buttons */
.card-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.recipe-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  width: 26px;
  height: 26px;
  background: var(--t-bg-elevated);
  border: 1px solid var(--t-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--t-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}
.action-btn svg { width: 13px; height: 13px; }
.action-btn:hover { background: var(--t-bg-hover); color: var(--t-text-primary); }
.delete-btn:hover { background: var(--t-accent-dim); border-color: var(--t-accent); color: var(--t-accent); }

.selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: var(--t-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.2s ease;
}
.check-icon { width: 13px; height: 13px; color: var(--t-text-inverse); }
</style>
