import { createRouter, createWebHashHistory } from 'vue-router'
import WeeklyPlannerView from '@/views/WeeklyPlannerView.vue'
import RecipeLibrary from '@/views/RecipeLibrary.vue'
import ShoppingListView from '@/views/ShoppingListView.vue'

const router = createRouter({
  history: createWebHashHistory('/meal-planner/'),
  routes: [
    {
      path: '/',
      name: 'planner',
      component: WeeklyPlannerView,
    },
    {
      path: '/recipes',
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
