/**
 * 消息通知
 */
import Layout from '@/layout'

const MessageNotificationRouter = {
  path: '/message',
  component: Layout,
  redirect: '/message/notification',
  alwaysShow: true,
  name: 'notification',
  meta: {
    title: '消息通知',
    icon: 'message-notification'
  },
  children: [
    {
      path: 'notification',
      name: 'notification',
      component: () => import('@/views/message-notification/index'),
      meta: { title: '消息通知', noCache: true }
    }
  ]
}

export default MessageNotificationRouter
