export default [
  {
    prop: 'SMSType',
    slot: 'SMSType',
    label: '短信类型',
    align: 'left',
    width: 180
  },
  {
    prop: 'uid',
    slot: 'uid',
    label: '发送对象',
    align: 'left',
    width: 260
  },
  {
    prop: 'messageContent',
    slot: 'messageContent',
    label: '短信内容',
    align: 'left',
    width: 600
  },
  {
    prop: 'numberWords',
    slot: 'numberWords',
    label: '字数/拆分条数',
    align: 'left',
    width: 120
  },
  {
    prop: 'sendTime',
    slot: 'sendTime',
    label: '发送时间',
    align: 'left',
    width: 160
  },
  {
    action: true,
    prop: 'messageStatus',
    label: '短信状态',
    name: 'tag',
    align: 'center',
    minWidth: 200
  },
  {
    action: true,
    name: 'action',
    width: 120,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]

export const actions = ({ tableAction }) => {
  return {
    tag: (dat, row, index) => {
      const type = ['primary', 'primary', 'success', 'danger', 'warning', 'warning', 'warning']
      return [
        {
          type: 'tag',
          label: row.messageStatus,
          attr: {
            type: type[+row.sendStatus]
          }
        },
        {
          type: 'tips',
          label: row.failReason,
          class: 'el-icon-warning-outline'
        }
      ]
    },
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '短信详情',
          click: (dat, row, index) => tableAction(dat, row, index),
          attr: {
            size: 'mini',
            icon: 'el-icon-s-operation',
            type: 'default'
          }
        }
      ]
    }
  }
}
