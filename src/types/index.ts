export interface Ingredient {
  name: string
  amount: number | string
  unit: string
  isSpice: boolean
}

export type RecipeCategory = '荤菜' | '素菜' | '汤羹' | '主食'

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  servings: number
  ingredients: Ingredient[]
  isCustom?: boolean
  image?: string  // base64 data URL
}

export interface SelectedRecipe {
  recipeId: string
  servings: number
}

export type IngredientGroup = '肉类' | '蔬菜' | '海鲜水产' | '豆制品' | '蛋奶' | '其他'

export interface MergedIngredient {
  name: string
  group: IngredientGroup
  amounts: { amount: number | string; unit: string }[]
  sources: string[]
  isRepeated: boolean
}

export interface ShoppingList {
  ingredients: Record<IngredientGroup, MergedIngredient[]>
  spices: { name: string; sources: string[] }[]
}
