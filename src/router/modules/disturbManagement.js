import Layout from '@/layout'

const DisturbRouter = {
  path: '/disturbs',
  component: Layout,
  redirect: '/disturbs/blacklist',
  alwaysShow: true,
  name: 'Disturb',
  meta: {
    title: '用户信息',
    icon: 'userinfo'
  },
  children: [
    {
      path: 'blacklist',
      component: () => import('@/views/disturb/disturbList'),
      name: 'DisturbBlacklist',
      meta: { title: '勿扰名单', noCache: true }
    },
    {
      path: 'outboundRecords',
      component: () => import('@/views/disturb/outboundRecords'),
      name: 'OutboundRecords',
      meta: { title: '呼叫记录', noCache: true }
    },
    {
      path: 'noteRecords',
      component: () => import('@/views/disturb/messageList'),
      name: 'NoteRecords',
      meta: { title: '短信记录', noCache: true }
    }
  ]
}

export default DisturbRouter
