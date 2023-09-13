import Clock from '../components/Clock'
const { baseDataMap: { work_order_source_map }} = window

export default [
  {
    type: 'selection',
    align: 'left'
  },
  {
    prop: 'complaintNo',
    slot: 'complaintNo',
    label: '投诉单',
    align: 'left',
    width: 170
  },
  {
    prop: 'channelPName',
    slot: 'channelPName',
    label: '投诉来源',
    align: 'left',
    width: 160
  },
  {
    prop: 'userName',
    slot: 'userName',
    label: '投诉人',
    align: 'left',
    width: 180
  },
  {
    prop: 'userType',
    slot: 'userType',
    label: '用户类型',
    align: 'left',
    width: 100
  },
  {
    prop: 'userLabel',
    slot: 'userLabel',
    label: '责任人',
    align: 'left',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'problemsType',
    slot: 'problemsType',
    label: '问题分类',
    align: 'left',
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    prop: 'cpProblems',
    slot: 'cpProblems',
    label: '投诉内容',
    align: 'left',
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    action: true,
    slot: 'currentStaffName',
    prop: 'currentStaffName',
    width: 120,
    label: '处理人',
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    slot: 'nodeStartTime',
    prop: 'nodeStartTime',
    width: 135,
    label: '节点时效',
    render: (h, item, data) => {
      return (
        <div>
         <Clock key={item} columns={data} disabled={[3, 6, 7, 8, 203, 204]} />
        </div>
      )
    },
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    name: 'tag',
    prop: 'cpStatus',
    label: '处理状态',
    width: 100,
    align: 'center'
  },
  {
    slot: 'handleOperateTypeInfo',
    prop: 'handleOperateTypeInfo',
    width: 90,
    label: '',
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    name: 'action',
    width: 200,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const workColumns = [
  {
    prop: 'workOrderType',
    label: '工单类型',
    align: 'left',
    slot: 'workOrderType'
    // width: 160
  },
  {
    prop: 'complaintNo',
    label: '工单编号',
    align: 'center',
    width: 160
  },
  {
    prop: 'workChannel',
    label: '工单来源',
    align: 'center',
    // width: 120,
    render: (_, text) => work_order_source_map[text] || ''
  },
  {
    prop: 'userName',
    label: '用户信息',
    slot: 'userName',
    align: 'center'
    // width: 180
  },
  {
    prop: 'userRemarkContent',
    label: '备注信息',
    showOverflowTooltip: true,
    align: 'center',
    render: (_, text) => text || '--'
  },
  {
    prop: 'dingUserName',
    label: '被投诉人',
    align: 'center',
    render: (_, text) => text || '--'
  },
  {
    prop: 'cpComent',
    label: '问题描述',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'workUrl',
    slot: 'workUrl',
    label: '附件',
    align: 'center'
  },
  {
    prop: 'currentStaffName',
    label: '处理人',
    align: 'center',
    // width: 120,
    render: (_, text) => text || '--'
  },
  {
    prop: 'cpStatus',
    slot: 'cpStatus',
    label: '处理状态',
    // width: 100,
    align: 'center'
  },
  {
    prop: 'createUserName',
    label: '创建人',
    width: 120,
    align: 'center',
    render: (_, text) => text || '--'
  }
]
export const afterSaleColumns = [
  {
    type: 'selection',
    align: 'left',
    selectable: (row) => row.afterSaleSource !== 2 // 单子不是有赞商城的才能被选中
  },
  {
    prop: 'complaintNo',
    slot: 'complaintNo',
    label: '售后单',
    align: 'left',
    width: 170
  },
  {
    prop: 'channelPName',
    slot: 'channelPName',
    label: '售后来源/途径',
    align: 'left',
    width: 160
  },
  {
    prop: 'userName',
    slot: 'userName',
    label: '售后人',
    align: 'left',
    width: 180
  },
  {
    prop: 'userType',
    slot: 'userType',
    label: '用户类型',
    align: 'left',
    width: 100
  },
  {
    prop: 'userLabel',
    slot: 'userLabel',
    label: '责任人',
    align: 'left',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    prop: 'problemsType',
    slot: 'problemsType',
    label: '售后类型/原因',
    align: 'left',
    width: 170
  },
  {
    prop: 'cpProblems',
    slot: 'cpProblems',
    label: '售后内容',
    align: 'left',
    minWidth: 240,
    showOverflowTooltip: true
  },
  {
    action: true,
    slot: 'currentStaffName',
    prop: 'currentStaffName',
    width: 120,
    label: '处理人',
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    slot: 'nodeStartTime',
    prop: 'nodeStartTime',
    width: 135,
    label: '节点时效',
    render: (h, item, data) => {
      return (
        <div>
         <Clock key={item} columns={data} disabled={[3, 6, 7, 8, 203, 204]} />
        </div>
      )
    },
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    name: 'tag',
    prop: 'cpStatus',
    label: '处理状态',
    width: 100,
    align: 'center'
  },
  {
    slot: 'handleOperateTypeInfo',
    prop: 'handleOperateTypeInfo',
    width: 90,
    label: '',
    align: 'left',
    layout: 'vertical'
  },
  {
    action: true,
    name: 'afterAction',
    width: 200,
    prop: 'afterAction',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const actions = ({ setInvalid, visitRecord, multipleAction, solve, tableAction, cpStatusData }) => {
  return {
    tag: (dat, row, index) => {
      const type = ['', 'success', 'warning', 'warning', 'info', 'danger', 'danger', 'info']
      // const typeText = ['', '待处理', '处理中', '待回访', '评价满意', '评价不满意', '无效投诉', '已解决']
      const successStatus = row.workType === 4 && [3, 203, 204].includes(row.cpStatus)
      return [
        {
          type: 'tag',
          label: successStatus ? '处理成功' : cpStatusData[row.workType === 4 && row.cpStatus === 3 ? row.cpStatus : (row.cpStatusSub || row.cpStatus)], // 如果是新售后单取一级状态 否则二级状态优先
          attr: {
            type: successStatus ? 'success' : type[row.cpStatus]
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
    problemType: (dat, row, index) => {
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
      let action = []
      switch (row.cpStatus) {
        case 1: // 待处理
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            },
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            }
          ]
          break
        case 2: // 处理中
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            },
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            }
          ]
          break
        case 3: // 已关闭
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: true,
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
        case 4: // 已解决
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: true,
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: true,
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
        case 5: // 未解决
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: row.channelName === '支付宝平台投诉',
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
        case 6: // 无效投诉
          action = [
            {
              label: '关闭投诉',
              attr: {
                disabled: true,
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            },
            {
              label: '设为无效',
              attr: {
                disabled: true,
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
        default: // 其他各种状态统一为禁止点击
          action = [
            {
              label: '设为无效',
              attr: {
                disabled: true,
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
      }

      return [
        {
          type: 'button',
          label: '立即处理',
          click: (dat, row, index) => tableAction(dat, row, index, 'doItNow'),
          attr: {
            // disabled: !![3, 4, 6].includes(row.cpStatus),
            size: 'mini',
            icon: 'el-icon-s-operation',
            type: 'default'
          }
        },
        {
          type: 'button', // 按钮
          // label: '更多操作',
          attr: {
            icon: 'el-icon-more',
            size: 'mini'
            // type: 'primary'
            // iconLayout: 'right'
          },
          click: () => {},
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            attr: {
              trigger: 'click'
            },
            command: (e, dat, row, index) => tableAction(dat, row, index, e),
            item: action
          }
        }
      ]
    },
    afterAction: (dat, row, index) => {
      let action = []
      switch (row.cpStatus) {
        case 1: // 待处理
          action = [
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            }
          ]
          break
        case 2: // 处理中
          action = [
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            },
            {
              label: '关闭工单',
              attr: {
                disabled: !(['REPLENISHMENT', 'EXCHANGE_GOODS'].includes(row.asType) && row.cpStatusSub === 28), // 换货、补货 （物流已发货）才可点击关闭工单
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            }
          ]
          break
        case 3: // 已关闭
          action = [
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            }
          ]
          break
        case 203: // 处理成功
          action = [
            {
              label: '关闭工单',
              attr: {
                disabled: !(['REPLENISHMENT', 'EXCHANGE_GOODS'].includes(row.asType) && row.cpStatusSub === 28) || row.afterSaleSource === 2,
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            }
          ]
          break
        case 204: // 处理失败
          action = [
            {
              label: '关闭工单',
              attr: {
                disabled: !(['REPLENISHMENT', 'EXCHANGE_GOODS'].includes(row.asType) && row.cpStatusSub === 28) || row.afterSaleSource === 2,
                command: 'closeComplaint',
                icon: 'el-icon-circle-close'
              }
            }
          ]
          break
        case 8: // 已取消
          action = [
            {
              label: '设置优先级',
              attr: {
                command: 'setPriority',
                icon: 'el-icon-edit'
              }
            }
          ]
          break
        default: // 其他各种状态统一为禁止点击
          action = [
            {
              label: '关闭工单',
              attr: {
                disabled: !(['REPLENISHMENT', 'EXCHANGE_GOODS'].includes(row.asType) && row.cpStatusSub === 28),
                command: 'setInvalid',
                icon: 'el-icon-warning'
              }
            }
          ]
          break
      }

      return [
        {
          type: 'button',
          label: '立即处理',
          click: (dat, row, index) => tableAction(dat, row, index, 'doItNow'),
          attr: {
            disabled: row.afterSaleSource === 2,
            size: 'mini',
            icon: 'el-icon-s-operation',
            type: 'default'
          }
        },
        {
          type: 'button', // 按钮
          attr: {
            icon: 'el-icon-more',
            size: 'mini'
          },
          click: () => {},
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            attr: {
              trigger: 'click'
            },
            command: (e, dat, row, index) => tableAction(dat, row, index, e),
            item: action
          }
        }
      ]
    }
  }
}
