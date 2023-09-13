import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/* import advertRouter from './modules/advert'
import noticeRouter from './modules/notice' */
// import basicsRouter from './modules/basics'
/* import prizeRouter from './modules/prize'
import messageRouter from './modules/message'
import appUpgradeRouter from './modules/app-upgrade'
import permissionsRouter from './modules/unified-permissions'
import expressRouter from './modules/express'
import goodsRouter from './modules/goods' */
// import operateRouter from './modules/operate'

// import operateNewRouter from './modules/newOperate'
import statisticsRouter from './modules/statistics'
import settingsRouter from './modules/settings'
import workbenchRouter from './modules/workbench'
import workOrderRouter from './modules/work-order'
import MessageNotificationRouter from './modules/message-notification'
import disturbRouter from './modules/disturbManagement'
import staffRouter from './modules/staffManagement'
import downloadRouter from './modules/downloadCenter'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/sso-login'),
    // component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
   workbenchRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // workbenchRouter,
  // operateNewRouter,
  workOrderRouter, // 工单管理
  disturbRouter, // 用户信息管理
  staffRouter, // 员工管理
  statisticsRouter, // 数据统计
  MessageNotificationRouter, // 消息通知
  downloadRouter, // 下载中心
  settingsRouter, // 设置
  // operateRouter,
  /* advertRouter,
  noticeRouter,
  prizeRouter,
  messageRouter,
  appUpgradeRouter,
  expressRouter,
  goodsRouter,
  permissionsRouter, */
  // basicsRouter,
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
