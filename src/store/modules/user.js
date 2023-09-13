import { login, getAuthorityUser, getUserInfo, ssoLogin } from '@/api/login/index'
import { findStaffByMobile } from '@/api/myExamine'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken('token'),
  name: getToken('cname'),
  avatar: '',
  introduction: '',
  roles: [],
  operationRoles: [],
  serviceObject: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_OPERATION_ROLES: (state, operationRoles) => {
    state.operationRoles = operationRoles
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SERVICEOBJECT: (state, serviceObject) => {
    state.serviceObject = serviceObject
  }
}

const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    // console.log('A')
    const { mobile, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: mobile.trim(), password: password }).then(async response => {
        const { payload } = response
        // 触发获取身份权限
        const Xtoken = payload.access_token && `Bearer ${payload.access_token}`
        if (Xtoken) {
          commit('SET_TOKEN', Xtoken || '')
          setToken('token', Xtoken || '')
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // sso令牌获取token
  ssoLogin({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      try {
        ssoLogin(params)
          .then(({ token }) => {
            const Xtoken = token && `Bearer ${token}`
            setToken('token', Xtoken || '')
            commit('SET_TOKEN', Xtoken || '')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      } catch (error) {
        reject(error)
      }
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise(async(resolve, reject) => {
      const userInfo = await getUserInfo()
      const { code, payload } = userInfo
      if (code !== 0) {
        return reject('身份获取失败!')
      }
      // 用户可看业务线
      commit('SET_SERVICEOBJECT', payload.serviceObject || '')
      setToken('cname', payload.staffName || '')
      setToken('userId', payload?.id || '')
      setToken('userMobile', payload.staffMobile || '')

      // 菜单&操作权限
      const authorityData = await getAuthorityUser({ id: payload?.id })
      if (authorityData.code !== 0) {
        return reject('您不是有效的身份!')
      }
      // - ***** - ***** - ***** -
      // 每当需要鉴权时，获取权限，可以在登录actions中设置
      // - ***** - ***** - ***** -
      const { menuAuthority, operationAuthority } = authorityData.payload
      const data = {
        roles: menuAuthority ? ['admin'] : ['casher'], // 控制路由权限
        operationRoles: operationAuthority ? ['admin'] : ['casher'], // 操作权限
        introduction: '',
        avatar: '',
        name: payload.staffName || ''
      }
      commit('SET_ROLES', data.roles)
      commit('SET_OPERATION_ROLES', data.operationRoles)
      commit('SET_NAME', data.name)
      commit('SET_AVATAR', data.avatar)
      commit('SET_INTRODUCTION', data.introduction)
      resolve(data)
    })
  },

  // 触发获取boss详情信息
  getBossInfo({ commit }) {
    return new Promise((resolve, reject) => {
      findStaffByMobile({
        mobile: getToken('userMobile')
      }).then(res => {
        if (res?.payload) {
          sessionStorage.setItem('bossinfo', JSON.stringify(res?.payload))
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // - ***** - ***** - ***** -
      // 退出登录，清空token和权限，重置路由权限
      // - ***** - ***** - ***** -

      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_OPERATION_ROLES', [])
      removeToken('token')
      removeToken('cname')
      removeToken('userId')
      removeToken('userMobile')
      sessionStorage.setItem('bossinfo', {})
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_OPERATION_ROLES', [])
      removeToken('token')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken('token', token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

