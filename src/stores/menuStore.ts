import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SelectedRecipe, ShoppingList, MergedIngredient, IngredientGroup } from '@/types'
import { useRecipesStore } from './recipesStore'
import { getIngredientGroup, GROUP_ORDER } from '@/data/ingredientGroups'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const selectedRecipes = ref<SelectedRecipe[]>([])

    const recipesStore = useRecipesStore()

    const hasSelection = computed(() => selectedRecipes.value.length > 0)
    const selectionCount = computed(() => selectedRecipes.value.length)

    function isSelected(recipeId: string): boolean {
      return selectedRecipes.value.some(s => s.recipeId === recipeId)
    }

    function getServings(recipeId: string): number {
      return selectedRecipes.value.find(s => s.recipeId === recipeId)?.servings ?? 1
    }

    function toggleRecipe(recipeId: string) {
      const idx = selectedRecipes.value.findIndex(s => s.recipeId === recipeId)
      if (idx >= 0) {
        selectedRecipes.value.splice(idx, 1)
      } else {
        selectedRecipes.value.push({ recipeId, servings: 1 })
      }
    }

    function setServings(recipeId: string, servings: number) {
      const item = selectedRecipes.value.find(s => s.recipeId === recipeId)
      if (item) item.servings = servings
    }

    function removeRecipe(recipeId: string) {
      selectedRecipes.value = selectedRecipes.value.filter(s => s.recipeId !== recipeId)
    }

    function clearAll() {
      selectedRecipes.value = []
    }

    const shoppingList = computed<ShoppingList>(() => {
      // Map: ingredientName -> { amounts, sources }
      const ingredientMap = new Map<
        string,
        { amounts: Map<string, number | string>; sources: Set<string>; group: IngredientGroup }
      >()
      const spiceMap = new Map<string, Set<string>>()

      for (const sel of selectedRecipes.value) {
        const recipe = recipesStore.getRecipeById(sel.recipeId)
        if (!recipe) continue
        const multiplier = sel.servings

        for (const ing of recipe.ingredients) {
          if (ing.isSpice) {
            if (!spiceMap.has(ing.name)) spiceMap.set(ing.name, new Set())
            spiceMap.get(ing.name)!.add(recipe.name)
            continue
          }

          const key = ing.name
          if (!ingredientMap.has(key)) {
            ingredientMap.set(key, {
              amounts: new Map(),
              sources: new Set(),
              group: getIngredientGroup(key),
            })
          }
          const entry = ingredientMap.get(key)!
          entry.sources.add(recipe.name)

          // Accumulate amounts by unit
          const unit = ing.unit
          const rawAmount = ing.amount
          if (typeof rawAmount === 'number') {
            const current = entry.amounts.get(unit)
            if (current === undefined) {
              entry.amounts.set(unit, rawAmount * multiplier)
            } else if (typeof current === 'number') {
              entry.amounts.set(unit, current + rawAmount * multiplier)
            }
          } else {
            // String amount (e.g. "适量") — just keep as-is
            if (!entry.amounts.has(unit)) {
              entry.amounts.set(unit, rawAmount)
            }
          }
        }
      }

      // Build grouped ingredients
      const groups: Record<IngredientGroup, MergedIngredient[]> = {
        '肉类': [],
        '蔬菜': [],
        '海鲜水产': [],
        '豆制品': [],
        '蛋奶': [],
        '其他': [],
      }

      for (const [name, data] of ingredientMap) {
        const amounts: { amount: number | string; unit: string }[] = []
        for (const [unit, amount] of data.amounts) {
          amounts.push({ amount, unit })
        }
        const merged: MergedIngredient = {
          name,
          group: data.group,
          amounts,
          sources: Array.from(data.sources),
          isRepeated: data.sources.size >= 2,
        }
        groups[data.group].push(merged)
      }

      // Build spices
      const spices = Array.from(spiceMap.entries()).map(([name, sources]) => ({
        name,
        sources: Array.from(sources),
      }))

      return { ingredients: groups, spices }
    })

    function generateCopyText(): string {
      const list = shoppingList.value
      const lines: string[] = ['🛒 购物清单\n']

      for (const group of GROUP_ORDER) {
        const items = list.ingredients[group]
        if (!items || items.length === 0) continue
        lines.push(`【${group}】`)
        for (const item of items) {
          const amtStr = item.amounts
            .map(a => `${a.amount}${a.unit}`)
            .join(' + ')
          const repeatMark = item.isRepeated ? '🔁 ' : ''
          const sourceStr = item.sources.join('、')
          lines.push(`- ${repeatMark}${item.name} ${amtStr}（来自：${sourceStr}）`)
        }
        lines.push('')
      }

      if (list.spices.length > 0) {
        lines.push('【调料】')
        for (const spice of list.spices) {
          lines.push(`- ${spice.name}`)
        }
      }

      return lines.join('\n')
    }

    return {
      selectedRecipes,
      hasSelection,
      selectionCount,
      shoppingList,
      isSelected,
      getServings,
      toggleRecipe,
      setServings,
      removeRecipe,
      clearAll,
      generateCopyText,
    }
  },
  {
    persist: {
      key: 'meal-planner-menu',
      pick: ['selectedRecipes'],
    },
  },
)
