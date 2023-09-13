/**
 * 商品中心
 */

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/manage',
  name: 'Goods',
  meta: {
    title: '商品中心',
    icon: 'goods'
  },
  children: [
    {
      path: 'manage', // 商品管理
      component: () => import('@/views/goods/manage/list'),
      name: 'GoodsManage',
      meta: { title: '商品管理', noCache: true }
    },
    {
      path: 'stock', // 库存
      component: () => import('@/views/goods/stock/list'),
      name: 'GoodsStock',
      meta: { title: '库存查询', noCache: true }
    },
    {
      path: 'stock/detail', // 库存详情
      component: () => import('@/views/goods/stock/detail'),
      name: 'GoodsStockDetail',
      meta: { title: '库存明细', noCache: true, activeMenu: '/goods/stock' },
      hidden: true
    },
    {
      path: 'category', // 商品分类
      component: () => import('@/views/goods/category/list'),
      name: 'GoodsCategory',
      meta: { title: '商品分类', noCache: true }
    }
  ]
}

export default goodsRouter
