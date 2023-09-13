/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-08 16:02:55
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-10 15:58:26
 */
import { getStaffEnumConfig } from '@/api/operate/staff-list'
import { tranFormSelectData } from '@/utils/index'
const state = {
  staffEnum: {}
}
const mutations = {
  getStaffEnumConfig: (state, data) => {
    const obj = {}
    Object.keys(data).forEach(item => {
      obj[item] = tranFormSelectData(data[item].payload)
    })
    state.staffEnum = { ...obj }
  }
}
const actions = {
  getEnumConfig({ commit }) {
    commit('getStaffEnumConfig', {})
    return new Promise((resolve, reject) => {
      getStaffEnumConfig().then(res => {
        commit('getStaffEnumConfig', res.payload)
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
