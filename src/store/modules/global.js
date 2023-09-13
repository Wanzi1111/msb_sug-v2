import baseData from '@/assets/baseData'
import { getBusinessTypeSupplierNameList } from '@/api/disturb/index'
import { getComplaintStatusEumDtoEnum } from '@/api/operate/complainNew'

const state = {
  baseData: {},
  baseDataMap: {},
  BusinessListData: {},
  cpStatusData: {}
}

const mutations = {
  UP_BASEDATA: (state, { baseData }) => {
    state['baseData'] = baseData
  },
  UP_BASEDATAMAP: (state, { baseDataMap }) => {
    state['baseDataMap'] = baseDataMap
  },
  UP_BUSINESSLISTDATA: (state, { newBaseData }) => {
    state['BusinessListData'] = newBaseData
  },
  UP_CPSTATUSDATA: (state, { cpStatusData }) => {
    state['cpStatusData'] = cpStatusData
  }
}

const actions = {
  handleBaseData({ commit }) {
    if (baseData) {
      const baseDataMap = {}
      Object.keys(baseData).forEach(v => {
        if (Object.prototype.toString.call(baseData[v]) === '[object Array]') {
          const obj = {}
          baseData[v].forEach(val => {
            obj[val.value] = val.label
          })
          baseDataMap[`${v}_map`] = obj
        } else if (Object.prototype.toString.call(baseData[v]) === '[object Object]') {
          baseDataMap[v] = baseData[v]
        }
      })
      window.baseData = baseData
      window.baseDataMap = baseDataMap
      commit('UP_BASEDATA', { baseData })
      commit('UP_BASEDATAMAP', { baseDataMap })
    }
    // commit('CHANGE_SETTING', data)
  },
  BusinessTypeSupplierNameList({ commit }) {
    return Promise.race([getBusinessTypeSupplierNameList()]).then(res => {
      let newBaseData = {}
      if (res?.payload) {
        Object.keys(res.payload)?.forEach(vv => {
          res.payload[vv] = res.payload[vv].map(vvv => {
            return {
              ...vvv,
              value: vvv.channelId || vvv.code,
              label: vvv.channelName || vvv.desc
            }
          })
        })
        newBaseData = { ...newBaseData, ...res?.payload }
      }
      // 二次处理处理

      newBaseData.businessClassificationLIst = newBaseData.businessClassificationLIst.map((v) => {
        return {
          ...v,
          type: v.childName ? 'submenu' : 'item',
          title: v.label,
          children: v.childName ? newBaseData[v.childName]?.map(vv => {
            return {
              ...vv,
              type: 'item',
              title: vv.label,
              value: `${vv.value}_${vv.wuraoList}`
            }
          }) : undefined
        }
      })
      window.BusinessListData = newBaseData
      commit('UP_BUSINESSLISTDATA', { newBaseData })
    })
  },
  // 获取工单的处理状态——公共
  getComplaintStatusEumDtoEnum({ commit }) {
     return new Promise((resolve, reject) => {
     getComplaintStatusEumDtoEnum().then((res) => {
      if (res.code === 0) {
        const cpStatusData = {}
        res.payload.map(val => {
          cpStatusData[val.id] = val.content
       })
       commit('UP_CPSTATUSDATA', { cpStatusData })
       resolve()
       }
     }).catch((error) => {
       reject(error)
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

