// 投诉统计
import Layout from '@/layout'

const WorkBenchRouter = {
  path: '/',
  component: Layout,
  redirect: '/workBench',
  alwaysShow: true,
  meta: {
    title: '工作台',
    icon: 'workbench'
  },
  children: [
    {
      path: 'backlog',
      component: () => import('@/views/workbench/my-backlog'),
      name: 'MyBacklog',
      meta: { title: '我的待办', noCache: true }
    },
    {
      path: 'workBench',
      component: () => import('@/views/workbench/my-workbench'),
      name: 'MyWorkBench',
      meta: { title: '我的工单', noCache: true }
    },
    {
      path: 'examine',
      component: () => import('@/views/workbench/my-examine'),
      name: 'MyExamine',
      meta: { title: '我的审批', noCache: true }
    },
    {
      path: 'claimsApproval',
      component: () => import('@/views/workbench/claimsApproval'),
      name: 'ClaimsApproval',
      meta: { title: '赔付审批', noCache: true }
    }
  ]
}

export default WorkBenchRouter
