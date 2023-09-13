 import Layout from '@/layout'

 const messageRouter = {
   path: '/downloadCenter',
   component: Layout,
   redirect: '/downloadCenter/downloadPage',
   alwaysShow: true,
   name: 'downloadCenter',
   meta: {
     title: '下载中心',
     icon: 'downloadicon'
   },
   children: [
     {
       path: 'downloadPage', // 推送管理
       component: () => import('@/views/downloadCenter'),
       name: 'downloadPage',
       meta: { title: '下载中心', noCache: true, activeMenu: '/downloadCenter/downloadPage' }
     }
   ]
 }

 export default messageRouter
