/**
 * hzf    统一权限管理router配置
 */

import Layout from '@/layout'

const permissionsRouter = {
  path: '/unified-permissions',
  component: Layout,
  redirect: '/unified-permissions/user',
  alwaysShow: true,
  name: 'UnifiedPermissions',
  meta: {
    title: '统一权限管理',
    icon: 'lock'
  },
  children: [
    {
      path: 'user', // 用户管理
      component: () => import('@/views/unified-permissions/user/index'),
      name: 'User',
      meta: { title: '用户管理', noCache: true }
    },
    {
      path: 'resources', // 资源管理
      component: () => import('@/views/unified-permissions/resources/index'),
      name: 'Resources',
      meta: { title: '资源管理', noCache: true }
    },
    {
      path: 'role', // 角色管理
      component: () => import('@/views/unified-permissions/role/index'),
      name: 'Role',
      meta: { title: '角色管理', noCache: true }
    }
  ]
}

export default permissionsRouter
