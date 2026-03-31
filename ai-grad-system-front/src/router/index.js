import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes, asyncRoutes } from './routes'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 合并所有路由
const routes = [...constantRoutes, ...asyncRoutes]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// 白名单路由
const whiteList = ['/login', '/404']

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  NProgress.done()
})

export default router
