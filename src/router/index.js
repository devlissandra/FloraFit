import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView      from '../views/HomeView.vue'
import FastView      from '../views/FastView.vue'
import NutritionView from '../views/NutritionView.vue'
import WeeklyView    from '../views/WeeklyView.vue'

const routes = [
  { path: '/',         name: 'home',     component: HomeView      },
  { path: '/jejum',    name: 'jejum',    component: FastView      },
  { path: '/nutricao', name: 'nutricao', component: NutritionView },
  { path: '/semanal',  name: 'semanal',  component: WeeklyView    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router