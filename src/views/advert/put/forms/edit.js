import store from '@/store'

export default [
  {
    prop: 'businessType',
    label: '业务类型',
    type: 'select', // 选择器,
    options: store.getters.adConfig.businessType,
    attr: {
      placeholder: '请选择业务类型',
      disabled: true
    }
  },
  {
    prop: 'userType',
    label: '用户定向',
    type: 'checkbox', // 多选框
    options: [],
    rules: [
      { required: true, message: '用户定向不能为空' }
    ]
  },
  {
    prop: 'advertIds',
    label: '广告位',
    type: 'select', // 选择器,
    attr: {
      disabled: true
    },
    options: []
  },
  {
    prop: 'startTime',
    label: '开始时间',
    type: 'dateTimePicker', // 日期选择器,
    attr: {
      type: 'datetime',
      placeholder: '请选择投放开始时间'
    },
    rules: [
      { required: true, message: '投放开始时间不能为空' }
    ]
  },
  {
    prop: 'endTime',
    label: '结束时间',
    type: 'dateTimePicker', // 日期选择器,
    attr: {
      type: 'datetime',
      defaultTime: '23:59:59',
      placeholder: '请选择投放结束时间'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '不填表示不限制'
    }
  },
  {
    prop: 'enabled',
    label: '是否开启',
    type: 'switch' // 开关,
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '提交'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '关闭',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
