
export default [
  {
    prop: 'id',
    slot: 'id',
    label: '序号',
    align: 'center',
    fixed: true
  },
  {
    prop: 'complaintsStringUser',
    label: '投诉来源',
    align: 'center'
  },
  {
    prop: 'username',
    slot: 'username',
    label: '投诉人',
    align: 'center'
  },
  {
    prop: 'userOrigin',
    slot: 'userOrigin',
    label: '投诉人备注',
    align: 'center'
  },
  {
    prop: 'complaintsStringType',
    slot: 'complaintsStringType',
    label: '问题',
    align: 'center',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    action: true,
    name: 'mobile',
    prop: 'mobile',
    width: 120,
    label: '处理人',
    align: 'center',
    layout: 'vertical'
  },
  {
    action: true,
    name: 'tag',
    prop: 'operationStringStatus',
    label: '处理状态',
    width: 100,
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    width: 300,
    prop: 'action',
    label: '操作',
    align: 'center'
  }
]
export const actions = ({ setInvalid, visitRecord, multipleAction, solve }) => {
  return {
    tag: (dat, row, index) => {
      const type = ['warning', '', 'success', 'info']
      return [
        {
          type: 'tag',
          label: dat,
          attr: {
            type: type[row.operationStatus]
          }
        }
      ]
    },
    mobile: (dat, row, index) => {
      const userDto = row.userDto || {}
      return [
        {
          type: 'span',
          label: userDto.userName || ''
        },
        {
          type: 'span',
          label: userDto.phone || ''
        }
      ]
    },
    action: (dat, row, index) => {
      let setInvalid_ = {}
      let visitRecord_ = {}
      let multipleAction_ = {}

      switch (row.operationStatus) {
        case 0: // 未处理
          setInvalid_ = {
            label: '设置无效',
            attr: {
              size: 'mini',
              icon: 'el-icon-warning',
              type: 'primary'
            }
          }
          visitRecord_ = {
            label: '回访记录',
            attr: {
              // disabled: true,
              size: 'mini',
              icon: 'el-icon-sort',
              type: 'primary'
            }
          }
          multipleAction_ = {
            label: '已解决',
            attr: {
              disabled: true,
              size: 'mini',
              icon: 'el-icon-success',
              type: 'info'
            }
          }
          break
        case 1: // 跟踪中
          setInvalid_ = {
            label: '设置无效',
            attr: {
              size: 'mini',
              icon: 'el-icon-warning',
              type: 'primary'
            }
          }
          visitRecord_ = {
            label: '回访记录',
            attr: {
              // disabled: true,
              size: 'mini',
              icon: 'el-icon-sort',
              type: 'primary'
            }
          }
          multipleAction_ = {
            click: solve,
            label: '已解决',
            attr: {
              size: 'mini',
              icon: 'el-icon-success',
              type: 'success'
            }
          }
          break
        case 2: // 已解决
          setInvalid_ = {
            label: '设置无效',
            attr: {
              disabled: true,
              size: 'mini',
              icon: 'el-icon-warning',
              type: 'info'
            }
          }
          visitRecord_ = {
            label: '回访记录',
            attr: {
              size: 'mini',
              icon: 'el-icon-sort',
              type: 'primary'
            }
          }
          multipleAction_ = {
            label: '重新开启',
            attr: {
              disabled: true,
              size: 'mini',
              icon: 'el-icon-success',
              type: 'info'
            }
          }
          break
        case 3: // 无效投诉
          setInvalid_ = {
            label: '设置无效',
            attr: {
              disabled: true,
              size: 'mini',
              icon: 'el-icon-warning',
              type: 'info'
            }
          }
          visitRecord_ = {
            label: '回访记录',
            attr: {
              disabled: true,
              size: 'mini',
              icon: 'el-icon-sort',
              type: 'info'
            }
          }
          multipleAction_ = {
            click: multipleAction,
            label: '重新开启',
            attr: {
              size: 'mini',
              icon: 'el-icon-success',
              type: 'warning'
            }
          }
          break
      }

      return [
        {
          type: 'button',
          click: setInvalid,
          ...setInvalid_
        },
        {
          type: 'button',
          click: visitRecord,
          ...visitRecord_
        },
        {
          type: 'button',
          ...multipleAction_
        }
      ]
    }
  }
}
