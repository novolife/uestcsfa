import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const AUTH_STORAGE = 'ue-stc-auth'

const DEFAULT_TITLE = '电子科技大学科幻协会'
const TITLE_SUFFIX = ' | 成电幻协'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: '关于我们' },
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
      meta: { title: '活动报道' },
    },
    {
      path: '/activities/reports/:slug',
      name: 'activity-report',
      component: () => import('../views/ActivityReportView.vue'),
      meta: { title: '活动详情' },
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
      meta: { title: '加入我们' },
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
    {
      path: '/ue-stc/ops',
      name: 'command-ops',
      component: () => import('../views/CommandOpsView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/map',
      name: 'command-map',
      component: () => import('../views/CommandMapView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/logistics',
      name: 'command-logistics',
      component: () => import('../views/CommandLogisticsView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/comms',
      name: 'command-comms',
      component: () => import('../views/CommandCommsView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/decipher',
      name: 'command-decipher',
      component: () => import('../views/CommandDecipherView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/memetic',
      name: 'command-memetic',
      component: () => import('../views/CommandMemeticView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/ending',
      name: 'command-ending',
      component: () => import('../views/CommandEndingView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/about',
      name: 'command-about',
      component: () => import('../views/CommandAboutView.vue'),
      meta: { command: true, requiresAuth: true },
    },
    {
      path: '/ue-stc/:pathMatch(.*)*',
      name: 'command-not-found',
      component: () => import('../views/CommandNotFoundView.vue'),
      meta: { command: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  // SEO：根据路由设置页面标题
  const title = to.meta?.title
  if (title) {
    document.title = `${title}${TITLE_SUFFIX}`
  } else {
    document.title = to.meta?.command ? `UE-STC 指挥部${TITLE_SUFFIX}` : DEFAULT_TITLE + TITLE_SUFFIX
  }

  // 如果是指挥部页面，并且不是登录页本身
  if (to.meta.command && to.name !== 'command-login') {
    if (!sessionStorage.getItem(AUTH_STORAGE)) {
      next({ path: '/ue-stc' })
      return
    }
  }
  next()
})

export default router
