import Cookies from 'js-cookie'
import { advertConfig } from '@/api/advert/ad-position'
import { getOperationEumList } from '@/api/log/operationLog'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  adConfig: null,
  operationEum: []
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_OPERATIONEUM: (state, operationEum) => {
    state.operationEum = operationEum
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_CONFIG: (state, res) => {
    state.adConfig = res
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  async getOperation({ commit }) {
    let operationEum = { payload: [] }
    try {
      operationEum = await getOperationEumList()
    } catch (error) {
      console.log(error)
    }
    const eumList = operationEum.payload.map(item => {
      const list = item.sonList.map(one => {
        return {
          label: one.name,
          value: one.id
        }
      })
      return {
        label: item.name,
        value: item.id,
        sonList: list
      }
    })
    commit('SET_OPERATIONEUM', eumList)
  },
  getAdConfig({ commit }) {
    return new Promise((resolve, reject) => {
      advertConfig().then(res => {
        const business = res.data.businessType || []
        const advert = res.data.advertType || []
        const lopp = (type) => {
          const list = []
          type.map(item => {
            list.push({
              label: item,
              value: item
            })
          })
          return list
        }
        const businessType = lopp(business)
        const advertType = lopp(advert)
        commit('SET_CONFIG', {
          advertType,
          businessType,
          userType: res.data.userType || {},
          clientType: res.data.clientType || {}
        })
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
