const { baseData: { work_order_priority }} = window

export const priorityForm = [
  {
    prop: 'priority',
    label: '处理优先级',
    type: 'radio',
    options: work_order_priority,
    rules: [
      // 校验
      { required: true, message: '请选择优先级' }
    ]
  },
  {
    prop: 'handleComent',
    label: '优先级理由',
    type: 'textarea', // 选择器,
    defaultVal: '',
    placeholder: '请输入优先级理由'
  }
]

export const formActions = ({ cancel, ensure }) => {
  return {
    submit: {
      hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    ensure: {
      click: (values) => ensure(values, 1),
      type: 'button',
      label: '确定',
      attr: {
        type: 'primary'
      }
    },
    cancel: {
      click: (values) => cancel(0, 0),
      type: 'button',
      label: '取消'
    }
  }
}
