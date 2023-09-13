import moment from 'moment'

/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
import store from '@/store'
export default [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
    width: 60,
    fixed: true
  },
  {
    prop: 'advertName',
    label: '广告位',
    align: 'center',
    minWidth: 260
  },
  {
    prop: 'resourceName',
    label: '物料名称',
    align: 'center',
    minWidth: 200
  },
  {
    prop: 'advertType',
    label: '广告类型',
    align: 'center'
  },
  {
    prop: 'userType',
    label: '用户类型',
    render: (h, dat, row, index) => {
      const { userType } = store.getters.adConfig
      const userTypeOption = Object.keys(userType[row.bussinessName]).map(v => {
        return {
          value: ~~v ? v : userType[row.bussinessName][v],
          label: ~~v ? userType[row.bussinessName][v] : v
        }
      })
      const renderString = []
      dat.split(',').map(v => {
        userTypeOption.find(vv => {
          if (vv.value === v) {
            renderString.push(vv.label)
          }
        })
      })
      return renderString.join()
    }
  },
  {
    prop: 'startTime',
    label: '投放开始时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'endTime',
    label: '投放结束时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      const endTime = dat ? moment(dat).format('YYYY-MM-DD HH:mm:ss') : '不限'
      return endTime
    }
  },
  {
    action: true,
    name: 'publishStatus',
    prop: 'publishStatus',
    label: '投放状态',
    width: 110,
    align: 'center'
  },
  {
    prop: 'enabled',
    label: '是否启用',
    align: 'center',
    render: (h, dat, row, index) => {
      return dat ? '启用' : '禁用'
    }
  },
  {
    prop: 'updateTime',
    label: '操作时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    action: true,
    name: 'action',
    width: 250, // 默认三个mini2字按钮220，换一个4字按钮+24
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const actions = ({ viewMateruel, adjustOrder, stopPut }) => {
  return {
    publishStatus: (dat, row, index) => {
      const userType = [
        {
          label: '投放中',
          attr: {
            type: 'success'
          }
        },
        {
          label: '等待投放'
        },
        {
          label: '投放结束',
          attr: {
            type: 'info'
          }
        },
        {
          label: '未投放'
        }
      ]
      return [{ type: 'tag', ...userType[dat] }]
    },
    action: (dat, row, index) => {
      let putBtn = {}
      let adjust = {}
      if (row.enabled) {
        putBtn = {
          label: '修改',
          attr: {
            size: 'mini',
            icon: 'el-icon-success',
            type: 'success'
          }
        }
        adjust = {
          click: adjustOrder,
          attr: {
            size: 'mini',
            icon: 'el-icon-sort',
            type: 'primary'
          }
        }
      } else {
        putBtn = {
          label: '修改',
          attr: {
            size: 'mini',
            icon: 'el-icon-success',
            type: 'success'
          }
        }
        adjust = {
          attr: {
            disabled: true,
            size: 'mini',
            icon: 'el-icon-sort',
            type: 'info'
          }
        }
      }

      return [
        {
          type: 'button',
          label: '查看',
          click: viewMateruel,
          attr: {
            size: 'mini',
            icon: 'el-icon-view'
          }
        },
        {
          type: 'button',
          label: '调序',
          ...adjust
        },
        {
          type: 'button',
          click: stopPut,
          ...putBtn
        }
      ]
    }
  }
}
