// 投诉统计
import Layout from '@/layout'

const WorkBenchRouter = {
  path: '/workOrder',
  component: Layout,
  redirect: '/workOrder/workOrderCreateList',
  alwaysShow: true,
  name: 'workOrder',
  meta: {
    title: '工单管理',
    icon: 'workorder'
  },
  children: [
    {
      path: 'workOrderCreateList',
      component: () => import('@/views/work-order/work-order-create/workCreateList'),
      name: 'workOrderCreateList',
      meta: { title: '创建工单', noCache: true }
    },
    {
      path: 'workOrderCreate/:type',
      component: () => import('@/views/work-order/work-order-create/components/Form'),
      name: 'workOrderCreate',
      meta: { title: '创建工单', noCache: true, activeMenu: '/workOrder/workOrderCreateList' },
      hidden: true
    },
    {
      path: 'batchImport/:type',
      component: () =>
        import('@/views/work-order/work-order-create/components/BatchImport'),
      name: 'batchImport',
      meta: { title: '批量导入投诉单', noCache: true, activeMenu: '/workOrder/workOrderCreateList' },
      hidden: true
    },
    {
      path: 'complain', // 工单列表
      component: () => import('@/views/work-order/new/complain/list'),
      name: 'OperateNewComplain',
      meta: { title: '工单列表', noCache: true }
    },
    {
      path: 'detail/:id', // 投诉列表详情
      component: () => import('@/views/work-order/new/complain/detail'),
      name: 'OperateComplainDetail',
      meta: { title: '列表详情', noCache: true, activeMenu: '/workOrder/complain' },
      hidden: true
    },
    {
      path: 'newAfterSaleDetail/:id', // 新售后详情
      component: () => import('@/views/work-order/new/complain/detail/newAfterSaleDetail'),
      name: 'newAfterSaleDetail',
      meta: { title: '列表详情', noCache: true, activeMenu: '/workOrder/complain' },
      hidden: true
    }
  ]
}

export default WorkBenchRouter
