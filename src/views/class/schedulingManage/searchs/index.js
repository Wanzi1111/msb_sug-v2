import moment from 'moment'
export default [
  {
    prop: 'month',
    label: '月份',
    type: 'dateMonthPicker', // 选择月份,
    defaultVal: moment(),
    attr: {
      placeholder: '请选择月份'
    }
  },
  {
    prop: 'staffName',
    label: '员工姓名',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入员工姓名'
    }
  }
]
