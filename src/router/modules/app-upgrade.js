/**
 * lw APP升级配置
 */

import Layout from '@/layout'

const noticeRouter = {
  path: '/app-upgrade',
  component: Layout,
  redirect: '/app-upgrade/version',
  alwaysShow: true,
  name: 'AppUpgrade',
  meta: {
    title: 'App升级管理',
    icon: 'appstore'
  },
  children: [
    {
      path: 'version', // 版本管理
      component: () => import('@/views/app-upgrade/version/list'),
      name: 'Version',
      meta: { title: '版本管理', noCache: true }
    },
    {
      path: 'upgrade', // 升级管理
      component: () => import('@/views/app-upgrade/upgrade/list'),
      name: 'Upgrade',
      meta: { title: '升级管理', noCache: true }
    }
  ]
}

export default noticeRouter
