// 员工管理
 import Layout from '@/layout'
 const staffRouter = {
   path: '/employee',
   redirect: '/employee/staffList',
   name: 'Employee',
   component: Layout,
   meta: {
     title: '员工管理',
     icon: 'staff',
     roles: ['admin']
   },
   children: [
     {
       path: '/employee/staffList',
       name: 'StaffList',
       component: () => import('@/views/class/staff/index'),
       meta: { title: '员工列表', noCache: true }
     },
     {
       path: '/employee/scheduling',
       name: 'Scheduling',
       component: () => import('@/views/class/schedulingManage/index'),
       meta: { title: '排班管理', noCache: true }
     }
   ]
 }
 export default staffRouter
