import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const AUTH_STORAGE = 'ue-stc-auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
    },
    {
      path: '/ue-stc',
      name: 'command-login',
      component: () => import('../views/CommandLoginView.vue'),
      meta: { command: true },
    },
    {
      path: '/ue-stc/dashboard',
      name: 'command-dashboard',
      component: () => import('../views/CommandDashboardView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/intel',
      name: 'command-intel',
      component: () => import('../views/CommandIntelView.vue'),
      meta: { command: true, requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !sessionStorage.getItem(AUTH_STORAGE)) {
    next({ path: '/ue-stc' })
  } else {
    next()
  }
})

export default router
