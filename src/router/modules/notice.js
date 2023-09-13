/**
 * lw 公告管理路由
 */

import Layout from '@/layout'

const noticeRouter = {
  path: '/notice',
  component: Layout,
  redirect: '/notice/article',
  alwaysShow: true,
  name: 'Notice',
  meta: {
    title: '公告管理',
    icon: 'bullhorn'
  },
  children: [
    {
      path: 'article', // 公告文章
      component: () => import('@/views/notice/article/list'),
      name: 'Article',
      meta: { title: '公告文章', noCache: true }
    },
    {
      path: 'article/create', // 添加 - 公告文章
      component: () => import('@/views/notice/article/create'),
      name: 'CreateArticle',
      meta: { title: '添加公告文章', noCache: true, activeMenu: '/notice/article' },
      hidden: true
    },
    {
      path: 'article/edit/:id(\\d+)', // 修改 - 公告文章
      component: () => import('@/views/notice/article/edit'),
      name: 'EditArticle',
      meta: { title: '修改公告文章', noCache: true, activeMenu: '/notice/article' },
      hidden: true
    }
  ]
}

export default noticeRouter
