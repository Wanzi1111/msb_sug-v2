/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-10 18:44:04
 */
/**
 * ss 运营维护路由
 */

import Layout from '@/layout'

const operateRouter = {
  path: '/operate',
  component: Layout,
  redirect: '/operate/complain',
  alwaysShow: true,
  name: 'Operate',
  meta: {
    title: '客服平台',
    icon: 'form'
  },
  children: [
    {
      path: 'complain', // 投诉列表
      component: () => import('@/views/operate/complain/list'),
      name: 'OperateComplain',
      meta: { title: '投诉列表', noCache: true }
    }
    /* {
      path: 'class-evaluate', // 课后评价统计
      component: () => import('@/views/operate/class-evaluate/index'),
      name: 'OperateClassEvaluate',
      meta: { title: '课后评价统计', noCache: true }
    },
    {
      path: 'service-satisfaction', // 服务满意度调查
      component: () => import('@/views/operate/service-satisfaction/index'),
      name: 'ServiceSatisfaction',
      meta: { title: '服务满意度调查', noCache: true }
    },
    {
      path: 'draw-show', // 小画家作品秀
      component: () => import('@/views/operate/draw-show/index'),
      name: 'OperateDrawShow',
      meta: { title: '小画家作品秀', noCache: true }
    } */
  ]
}

export default operateRouter
