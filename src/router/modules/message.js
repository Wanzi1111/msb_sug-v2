/**
 * ss 消息推送路由
 */

import Layout from '@/layout'

const messageRouter = {
  path: '/message',
  component: Layout,
  redirect: '/message/message-push',
  name: 'Message',
  meta: {
    title: '消息推送',
    icon: 'email'
  },
  children: [
    {
      path: 'message-push', // 推送管理
      component: () => import('@/views/message/message-push/list'),
      name: 'MessagePush',
      meta: { title: '推送管理', noCache: true, activeMenu: '/message/message-push' },
      children: [

      ]
    }
  ]
}

export default messageRouter
