import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailyMenu, DayOfWeek, ShoppingList, MergedIngredient, IngredientGroup } from '@/types'
import { useRecipesStore } from './recipesStore'
import { getIngredientGroup, GROUP_ORDER } from '@/data/ingredientGroups'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const weeklyPlan = ref<DailyMenu[]>([
      { dayOfWeek: 'Monday', recipes: [] },
      { dayOfWeek: 'Tuesday', recipes: [] },
      { dayOfWeek: 'Wednesday', recipes: [] },
      { dayOfWeek: 'Thursday', recipes: [] },
      { dayOfWeek: 'Friday', recipes: [] },
      { dayOfWeek: 'Saturday', recipes: [] },
      { dayOfWeek: 'Sunday', recipes: [] },
    ])

    const recipesStore = useRecipesStore()

    const hasSelection = computed(() => weeklyPlan.value.some(day => day.recipes.length > 0))
    const selectionCount = computed(() => {
      return weeklyPlan.value.reduce((total, day) => total + day.recipes.length, 0)
    })

    function getRecipesForDay(day: DayOfWeek) {
      return weeklyPlan.value.find(d => d.dayOfWeek === day)?.recipes ?? []
    }

    function addRecipeToDay(day: DayOfWeek, recipeId: string) {
      const dayPlan = weeklyPlan.value.find(d => d.dayOfWeek === day)
      if (!dayPlan) return

      const existing = dayPlan.recipes.find(r => r.recipeId === recipeId)
      if (existing) {
        existing.servings += 1
      } else {
        dayPlan.recipes.push({ recipeId, servings: 1 })
      }
    }

    function updateServings(day: DayOfWeek, recipeId: string, servings: number) {
      if (servings < 1) return
      const dayPlan = weeklyPlan.value.find(d => d.dayOfWeek === day)
      if (!dayPlan) return
      const item = dayPlan.recipes.find(r => r.recipeId === recipeId)
      if (item) {
        item.servings = servings
      }
    }

    function removeRecipeFromDay(day: DayOfWeek, recipeId: string) {
      const dayPlan = weeklyPlan.value.find(d => d.dayOfWeek === day)
      if (!dayPlan) return
      dayPlan.recipes = dayPlan.recipes.filter(r => r.recipeId !== recipeId)
    }

    function clearAll() {
      weeklyPlan.value.forEach(day => {
        day.recipes = []
      })
    }

    const shoppingList = computed<ShoppingList>(() => {
      const ingredientMap = new Map<
        string,
        { amounts: Map<string, number | string>; sources: Set<string>; group: IngredientGroup }
      >()
      const spiceMap = new Map<string, Set<string>>()

      for (const dayPlan of weeklyPlan.value) {
        for (const sel of dayPlan.recipes) {
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
              if (!entry.amounts.has(unit)) {
                entry.amounts.set(unit, rawAmount)
              }
            }
          }
        }
      }

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
      weeklyPlan,
      hasSelection,
      selectionCount,
      shoppingList,
      getRecipesForDay,
      addRecipeToDay,
      updateServings,
      removeRecipeFromDay,
      clearAll,
      generateCopyText,
    }
  },
  {
    persist: {
      key: 'meal-planner-menu-weekly',
      pick: ['weeklyPlan'],
    },
  },
)
