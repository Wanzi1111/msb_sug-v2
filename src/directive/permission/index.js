import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const operationRoles = store.getters && store.getters.operationRoles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = operationRoles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
