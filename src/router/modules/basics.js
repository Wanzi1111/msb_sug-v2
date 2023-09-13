/**
 * @author: Liwei
 * @description: 公共基础组件使用示例
 * @date: 2020/1/3
 */

import Layout from '@/layout'

const noticeRouter = {
  path: '/basics',
  component: Layout,
  redirect: '/basics/action',
  alwaysShow: true,
  name: 'Basics',
  meta: {
    title: '公共组件',
    icon: 'component'
  },
  children: [
    {
      path: 'action', // 操作条
      component: () => import('@/views/basics/action/index'),
      name: 'BasicsAction',
      meta: { title: '操作条', noCache: true }
    },
    {
      path: 'block', // 标题容器
      component: () => import('@/views/basics/block'),
      name: 'BasicsBlock',
      meta: { title: '标题容器', noCache: true }
    },
    {
      path: 'title', // 内容标题
      component: () => import('@/views/basics/title'),
      name: 'BasicsTitles',
      meta: { title: '内容标题', noCache: true }
    },
    {
      path: 'info', // 详情页
      component: () => import('@/views/basics/info'),
      name: 'BasicsInfos',
      meta: { title: '详情页', noCache: true }
    },
    {
      path: 'form', // 表单
      component: () => import('@/views/basics/form'),
      name: 'BasicsForms',
      meta: { title: '表单', noCache: true }
    },
    {
      path: 'search', // 搜索
      component: () => import('@/views/basics/search'),
      name: 'BasicsSearchs',
      meta: { title: '搜索', noCache: true }
    },
    {
      path: 'table', // 数据表格
      component: () => import('@/views/basics/table'),
      name: 'BasicsTables',
      meta: { title: '数据表格', noCache: true }
    },
    {
      path: 'demo-goods', // [模拟场景]商品管理
      component: () => import('@/views/basics/demo-goods/list'),
      name: 'BasicsDemoGoods',
      meta: { title: '[模拟场景]商品管理', noCache: true }
    },
    {
      path: 'demo-goods/create', // [模拟场景]商品管理
      component: () => import('@/views/basics/demo-goods/create'),
      name: 'BasicsDemoGoodsCreate',
      meta: { title: '[模拟场景]创建商品', noCache: true },
      hidden: true
    },
    {
      path: 'demo-goods/detail', // [模拟场景]商品管理
      component: () => import('@/views/basics/demo-goods/detail'),
      name: 'BasicsDemoGoodsDetail',
      meta: { title: '[模拟场景]商品详情', noCache: true },
      hidden: true
    }
  ]
}

export default noticeRouter
