/**
 * lw 奖品管理
 */

import Layout from '@/layout'

const prizeRouter = {
  path: '/prize',
  component: Layout,
  redirect: '/prize/awards',
  alwaysShow: true,
  name: 'Prize',
  meta: {
    title: '奖品管理',
    icon: 'gift'
  },
  children: [
    {
      path: 'awards',
      component: () => import('@/views/prize/awards/index'),
      name: 'PrizeAwards',
      meta: { title: '获奖信息', noCache: true }
    },
    {
      path: 'set', // 添加 - 公告文章
      component: () => import('@/views/prize/set/index'),
      name: 'PrizeSet',
      meta: { title: '上传奖品信息', noCache: true }
    }
  ]
}

export default prizeRouter
