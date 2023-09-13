// 设置
import Layout from '@/layout'
const SettingRouter = {
  path: '/settings',
  component: Layout,
  redirect: '/settings/ProblemSet',
  alwaysShow: true,
  name: 'Settings',
  meta: {
    title: '设置',
    icon: 'shezhi',
    roles: ['admin']
  },
  children: [
    {
      path: 'problemSet',
      name: 'ProblemSetting',
      component: () => import('@/views/settings/question'),
      meta: { title: '问题设置', noCache: true }
    },
    {
      path: 'channelSet',
      name: 'ChannelSetting',
      component: () => import('@/views/settings/channel'),
      meta: { title: '渠道设置', noCache: true }
    },
    {
      path: 'classesManage',
      name: 'ClassesManage',
      component: () => import('@/views/settings/classesManage'),
      meta: { title: '班次设置', noCache: true }
    },
    {
      path: 'assignComplaint',
      name: 'AssignComplaintSetting',
      component: () => import('@/views/settings/assign-complaint'),
      meta: { title: '自动分配设置', noCache: true }
    }
  ]
}

export default SettingRouter
