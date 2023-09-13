import { getScene } from '@/api/myExamine'
const state = {
  claimsType: []
}
const mutations = {
    getClaimsTypeConfig: (state, data) => {
    const newData = data.map(item => {
      item.scenes.map((val, index) => {
          val.label = val.sceneName
          val.value = index
          val.reasons = val?.reasons?.map((ival, i) => {
            return {
              label: ival,
              value: i
            }
          }) || []
        return val
      })
      return item
    })
    state.claimsType = newData
  }
}
const actions = {
  getClaimsConfig({ commit }) {
    return new Promise((resolve, reject) => {
        getScene().then(res => {
        commit('getClaimsTypeConfig', res.payload)
        resolve(res.payload)
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
