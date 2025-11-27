import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'   // 顶部补这一行

import LoginView from '@/components/LoginView.vue'
import PreviewView from '@/components/PreviewView.vue'
import SettingsView from '@/components/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'preview',
      component: PreviewView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isLoggedIn } = useAuth()

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    // 没登录还想进需要登录的页面 -> 拦截，跳登录页
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
