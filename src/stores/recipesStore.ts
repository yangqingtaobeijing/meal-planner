import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe, RecipeCategory } from '@/types'
import { builtinRecipes } from '@/data/recipes'

export const useRecipesStore = defineStore(
  'recipes',
  () => {
    const customRecipes = ref<Recipe[]>([])

    const allRecipes = computed<Recipe[]>(() => [
      ...builtinRecipes,
      ...customRecipes.value,
    ])

    function addCustomRecipe(recipe: Recipe) {
      customRecipes.value.push({ ...recipe, isCustom: true })
    }

    function deleteCustomRecipe(id: string) {
      customRecipes.value = customRecipes.value.filter(r => r.id !== id)
    }

    function getRecipeById(id: string): Recipe | undefined {
      return allRecipes.value.find(r => r.id === id)
    }

    function filterRecipes(category: RecipeCategory | '全部', query: string): Recipe[] {
      return allRecipes.value.filter(r => {
        const matchCat = category === '全部' || r.category === category
        const matchQ = !query || r.name.includes(query)
        return matchCat && matchQ
      })
    }

    return { customRecipes, allRecipes, addCustomRecipe, deleteCustomRecipe, getRecipeById, filterRecipes }
  },
  {
    persist: {
      key: 'meal-planner-recipes',
      pick: ['customRecipes'],
    },
  },
)
