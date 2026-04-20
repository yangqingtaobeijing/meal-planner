<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box animate-scale-in">
        <div class="modal-header">
          <h2 class="modal-title">添加自定义菜谱</h2>
          <button class="close-btn" @click="$emit('close')">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <form class="modal-body" @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label>菜名 *</label>
              <input v-model="form.name" type="text" placeholder="如：红烧肉" required />
            </div>
            <div class="form-group">
              <label>分类 *</label>
              <select v-model="form.category">
                <option value="荤菜">荤菜</option>
                <option value="素菜">素菜</option>
                <option value="汤羹">汤羹</option>
                <option value="主食">主食</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <div class="ingredients-header">
              <label>食材列表</label>
              <button type="button" class="add-row-btn" @click="addRow">+ 添加行</button>
            </div>

            <div class="ingredients-table-head">
              <span>原料名</span>
              <span>用量</span>
              <span>单位</span>
              <span>调料</span>
              <span></span>
            </div>

            <div
              v-for="(row, idx) in form.ingredients"
              :key="idx"
              class="ingredient-row"
            >
              <input v-model="row.name" type="text" placeholder="如：鸡胸肉" />
              <input v-model.number="row.amount" type="number" min="0" placeholder="300" />
              <input v-model="row.unit" type="text" placeholder="g" />
              <label class="spice-toggle">
                <input type="checkbox" v-model="row.isSpice" />
                <span class="toggle-track">
                  <span class="toggle-thumb"></span>
                </span>
              </label>
              <button type="button" class="remove-row-btn" @click="removeRow(idx)">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <div v-if="form.ingredients.length === 0" class="no-rows">暂无食材，点击上方添加</div>
          </div>

          <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="$emit('close')">取消</button>
            <button type="submit" class="btn-save">保存菜谱</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRecipesStore } from '@/stores/recipesStore'
import type { RecipeCategory } from '@/types'

const emit = defineEmits<{ (e: 'close'): void }>()

const recipesStore = useRecipesStore()

interface IngredientForm {
  name: string
  amount: number
  unit: string
  isSpice: boolean
}

const form = reactive({
  name: '',
  category: '荤菜' as RecipeCategory,
  ingredients: [] as IngredientForm[],
})

const errorMsg = ref('')

function addRow() {
  form.ingredients.push({ name: '', amount: 0, unit: 'g', isSpice: false })
}

function removeRow(idx: number) {
  form.ingredients.splice(idx, 1)
}

function handleSubmit() {
  errorMsg.value = ''

  if (!form.name.trim()) {
    errorMsg.value = '请填写菜名'
    return
  }

  if (form.ingredients.length === 0) {
    errorMsg.value = '请至少添加一种食材'
    return
  }

  const validIng = form.ingredients.filter(i => i.name.trim())
  if (validIng.length === 0) {
    errorMsg.value = '请填写食材名称'
    return
  }

  const id = `custom-${Date.now()}`
  recipesStore.addCustomRecipe({
    id,
    name: form.name.trim(),
    category: form.category,
    servings: 2,
    ingredients: validIng.map(i => ({
      name: i.name.trim(),
      amount: i.amount || 0,
      unit: i.unit || 'g',
      isSpice: i.isSpice,
    })),
    isCustom: true,
  })

  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  width: 640px;
  max-width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.close-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.modal-body {
  padding: 20px 24px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.form-group input,
.form-group select {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 9px 12px;
  color: var(--color-text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-primary);
}

.form-group select option {
  background: var(--color-bg-elevated);
}

.ingredients-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ingredients-header label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.add-row-btn {
  background: var(--color-primary-dim);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.add-row-btn:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.ingredients-table-head {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 60px 36px;
  gap: 8px;
  padding: 0 0 6px;
  border-bottom: 1px solid var(--color-border-subtle);
  margin-bottom: 4px;
}

.ingredients-table-head span {
  font-size: 11px;
  color: var(--color-text-muted);
  font-weight: 600;
  letter-spacing: 0.03em;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 60px 36px;
  gap: 8px;
  align-items: center;
  padding: 4px 0;
}

.ingredient-row input[type="text"],
.ingredient-row input[type="number"] {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 7px 10px;
  color: var(--color-text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

.ingredient-row input:focus {
  border-color: var(--color-primary);
}

/* Toggle switch */
.spice-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.spice-toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  display: block;
  width: 34px;
  height: 18px;
  border-radius: 9px;
  background: var(--color-border);
  position: relative;
  transition: background 0.2s;
}

.spice-toggle input:checked + .toggle-track {
  background: var(--color-primary);
}

.toggle-thumb {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: left 0.2s;
}

.spice-toggle input:checked + .toggle-track .toggle-thumb {
  left: 19px;
}

.remove-row-btn {
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  padding: 0;
}

.remove-row-btn svg {
  width: 14px;
  height: 14px;
}

.remove-row-btn:hover {
  background: var(--color-accent-dim);
  color: var(--color-accent);
}

.no-rows {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
  font-size: 13px;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
}

.error-msg {
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
}

.btn-cancel {
  padding: 10px 20px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  border-color: var(--color-text-secondary);
  color: var(--color-text-primary);
}

.btn-save {
  padding: 10px 24px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: var(--color-text-inverse);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  background: var(--color-primary-hover);
}
</style>
