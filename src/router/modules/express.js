/**
 * 物流管理
 */

import Layout from '@/layout'

const expressRouter = {
  path: '/express',
  component: Layout,
  redirect: '/express/manage',
  name: 'Express',
  meta: {
    title: '物流管理',
    icon: 'car'
  },
  children: [
    {
      path: 'manage', // 物流数据
      component: () => import('@/views/express/manage/list'),
      name: 'ExpressManage',
      meta: { title: '物流数据', noCache: true }
    },
    {
      path: 'manage/create', // 创建物流
      component: () => import('@/views/express/manage/create'),
      name: 'ExpressManageCreate',
      meta: { title: '创建物流', noCache: true, activeMenu: '/express/manage' },
      hidden: true
    },
    {
      path: 'manage/batch', // 批量导入物流信息
      component: () => import('@/views/express/manage/batch'),
      name: 'ExpressManageBatch',
      meta: { title: '批量发货', noCache: true, activeMenu: '/express/manage' },
      hidden: true
    },
    {
      path: 'import-log', // 导入记录
      component: () => import('@/views/express/import-log/index'),
      name: 'ExpressImportLog',
      meta: { title: '导入记录', noCache: true }
    },
    {
      path: 'data', // 数据统计
      component: () => import('@/views/express/data/index'),
      name: 'ExpressData',
      meta: { title: '数据统计', noCache: true }
    },
    {
      path: 'route-config', // 路由配置
      component: () => import('@/views/express/route-config/index'),
      name: 'RouteConfig',
      meta: { title: '路由配置', noCache: true }
    }
  ]
}

export default expressRouter
