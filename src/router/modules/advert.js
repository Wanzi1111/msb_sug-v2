/**
 * lw 广告管理路由
 */

import Layout from '@/layout'

const advertRouter = {
  path: '/advert',
  component: Layout,
  redirect: '/advert/materiel',
  name: 'Advert',
  meta: {
    title: '广告管理',
    icon: 'ad'
  },
  children: [
    {
      path: 'materiel', // 物料
      component: () => import('@/views/advert/materiel/list'),
      name: 'Materiel',
      meta: { title: '物料管理', noCache: true }
    },
    {
      path: 'materiel/create', // 添加物料
      component: () => import('@/views/advert/materiel/create'),
      name: 'CreateMateriel',
      meta: { title: '上传物料', noCache: true, activeMenu: '/advert/materiel' },
      hidden: true
    },
    {
      path: 'materiel/edit/:id(\\d+)', // 更换物料
      component: () => import('@/views/advert/materiel/edit'),
      name: 'EditMateriel',
      meta: { title: '更换物料', noCache: true, activeMenu: '/advert/materiel' },
      hidden: true
    },
    {
      path: 'put', // 投放
      component: () => import('@/views/advert/put/list'),
      name: 'Put',
      meta: { title: '投放管理', noCache: true }
    },
    {
      path: 'put/create', // 新建投放
      component: () => import('@/views/advert/put/create'),
      name: 'CreatePut',
      meta: { title: '新建投放', noCache: true, activeMenu: '/advert/put' },
      hidden: true
    },
    {
      path: 'ad-position', // 广告位
      component: () => import('@/views/advert/ad-position/list'),
      name: 'AdPosition',
      meta: { title: '广告位管理', noCache: true }
    },
    {
      path: 'put-log', // 数据统计
      component: () => import('@/views/advert/put-log/list'),
      name: 'PutLog',
      meta: { title: '数据统计', noCache: true }
    },
    {
      path: 'put-log/:id(\\d+)', // 数据统计 - 详情
      component: () => import('@/views/advert/put-log/detail'),
      name: 'PutLogDetail',
      meta: { title: '数据详情', noCache: true, activeMenu: '/advert/put-log' },
      hidden: true
    }
  ]
}

export default advertRouter
