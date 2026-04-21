import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe, RecipeCategory } from '@/types'
import { builtinRecipes } from '@/data/recipes'
import { builtinRecipeImages } from '@/data/recipeImages'

export const useRecipesStore = defineStore(
  'recipes',
  () => {
    const customRecipes = ref<Recipe[]>([])
    const builtinOverrides = ref<Record<string, Partial<Recipe>>>({})

    const allRecipes = computed<Recipe[]>(() => allRecipesWithImages.value)

    function addCustomRecipe(recipe: Recipe) {
      customRecipes.value.push({ ...recipe, isCustom: true })
    }

    function deleteCustomRecipe(id: string) {
      customRecipes.value = customRecipes.value.filter(r => r.id !== id)
    }

    function updateCustomRecipe(id: string, updates: Partial<Recipe>) {
      const idx = customRecipes.value.findIndex(r => r.id === id)
      if (idx !== -1) {
        customRecipes.value[idx] = { ...customRecipes.value[idx], ...updates }
      }
    }

    function updateRecipeImage(id: string, image: string) {
      // For builtin recipes, store image in a separate map
      recipeImages.value[id] = image
    }

    function updateBuiltinRecipe(id: string, updates: Partial<Recipe>) {
      builtinOverrides.value[id] = {
        ...(builtinOverrides.value[id] || {}),
        ...updates,
      }
    }

    const recipeImages = ref<Record<string, string>>({})

    const allRecipesWithImages = computed<Recipe[]>(() => [
      ...builtinRecipes.map(r => ({
        ...r,
        ...(builtinOverrides.value[r.id] || {}),
        image: (builtinOverrides.value[r.id]?.image || recipeImages.value[r.id]) || builtinRecipeImages[r.id],
      })),
      ...customRecipes.value,
    ])

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

    return { customRecipes, builtinOverrides, allRecipes, recipeImages, addCustomRecipe, deleteCustomRecipe, updateCustomRecipe, updateBuiltinRecipe, updateRecipeImage, getRecipeById, filterRecipes }
  },
  {
    persist: {
      key: 'meal-planner-recipes',
      pick: ['customRecipes', 'recipeImages', 'builtinOverrides'],
    },
  },
)
