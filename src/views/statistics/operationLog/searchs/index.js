import store from '@/store'
export default [
  {
    prop: 'operationPid',
    label: '功能模块',
    type: 'select', // 选择器,
    attr: {
      placeholder: '全部'
    },
    options: store.getters.operationEum
  },
  {
    prop: 'operationId',
    label: '操作',
    type: 'select', // 选择器,
    attr: {
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'staffName',
    label: '操作人',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入操作人'
    }
  }
]
