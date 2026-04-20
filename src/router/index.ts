import { createRouter, createWebHashHistory } from 'vue-router'
import RecipeLibrary from '@/views/RecipeLibrary.vue'
import ShoppingListView from '@/views/ShoppingListView.vue'

const router = createRouter({
  history: createWebHashHistory('/meal-planner/'),
  routes: [
    {
      path: '/',
      name: 'recipes',
      component: RecipeLibrary,
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: ShoppingListView,
    },
  ],
})

export default router
