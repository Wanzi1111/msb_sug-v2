import { ROLE_MAP } from '../config'

export const TableColumns = [
  {
    type: 'selection',
    align: 'center',
    width: 45
  },
  {
    prop: 'staffName',
    label: '员工姓名',
    align: 'center'
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    width: 120,
    align: 'center'
  },
  {
    slot: 'status',
    headerSlot: 'statusHeader',
    label: '参与状态',
    width: 200,
    align: 'center'
  },
  {
    slot: 'serviceUpperNum',
    headerSlot: 'serviceUpperNumHeader',
    label: '服务上限',
    width: 130,
    align: 'center'
  },
  {
    prop: 'role',
    label: '员工角色',
    width: 120,
    align: 'center',
    render: (_, text) => text ? ROLE_MAP[text] : '-'
  },
  {
    prop: 'manageBusinessName',
    label: '管理业务线',
    align: 'center',
    minWidth: 240
    // showOverflowTooltip: true
  },
  {
    prop: 'serviceObject',
    slot: 'serviceObject',
    // showOverflowTooltip: true,
    label: '服务对象',
    align: 'center',
    minWidth: 240
  },
  {
    prop: 'problemId',
    slot: 'problemId',
    label: '投诉问题',
    align: 'center',
    // showOverflowTooltip: true,
    minWidth: 300
  },
  {
    name: 'action',
    label: '操作',
    width: 80,
    align: 'center',
    action: true,
    fixed: 'right'
  }
]

export const TableColumnsAdd = [
  {
    type: 'selection',
    align: 'center',
    width: 45,
    selectable: (row) => !!row.autoDistribution
  },
  {
    prop: 'staffName',
    label: '员工姓名',
    align: 'center'
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'role',
    label: '员工角色',
    minWidth: 120,
    align: 'center',
    render: (_, text) => text ? ROLE_MAP[text] : '-'
  },
  {
    prop: 'manageBusinessName',
    label: '管理业务线',
    minWidth: 120,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'serviceObject',
    slot: 'serviceObject',
    showOverflowTooltip: true,
    label: '服务对象',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'problemAllName',
    label: '服务问题',
    minWidth: 120,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'autoDistribution',
    label: '是否在名单中',
    minWidth: 140,
    align: 'center',
    render: (_, data) => data ? '否' : '是'
  }
]

export const TableActions = ({ handleDelte }) => ({
  action: () => [{
    type: 'button',
    click: (data, row) => handleDelte(data, row),
    attr: {
      icon: 'el-icon-delete',
      size: 'mini'
    }
  }]
})
