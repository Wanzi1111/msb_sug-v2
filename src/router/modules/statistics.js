// 投诉统计
import Layout from '@/layout'

const statisticsRouter = {
  path: '/statistics',
  component: Layout,
  redirect: '/statistics/status',
  name: 'statisticsHome',
  meta: {
    title: '数据统计',
    icon: 'chart'
  },
  children: [
    {
      path: 'dataBoard',
      component: () => import('@/views/statistics/dataBoard'),
      name: 'dataBoard',
      meta: { title: '数据看版', noCache: true }
    },
    {
      path: 'area',
      component: () => import('@/views/statistics/statisticsHome'),
      name: 'StatisticsArea',
      meta: { title: '大区统计', noCache: true }
    },
    {
      path: 'problem',
      component: () => import('@/views/statistics/statisticsHome'),
      name: 'StatisticsProblems',
      meta: { title: '问题统计', noCache: true }
    },
    {
      path: 'status',
      component: () => import('@/views/statistics/statisticsHome'),
      name: 'StatisticsStatus',
      meta: { title: '状态统计', noCache: true }
    },
    {
      path: 'operationLog',
      component: () => import('@/views/statistics/operationLog'),
      name: 'operationLog',
      meta: { title: '操作日志', noCache: true }
    },
    {
      path: 'performance',
      component: () => import('@/views/statistics/performance'),
      name: 'performance',
      meta: { title: '工作绩效', noCache: true }
    }
  ]
}
export default statisticsRouter
