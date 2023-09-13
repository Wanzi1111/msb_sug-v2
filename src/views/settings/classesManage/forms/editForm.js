export default [
  {
    prop: 'schedulingName',
    label: '上班班次',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入班次名称'
    },
    rules: [
      { required: true, message: '上班班次不能为空' }
    ]
  },
  {
    prop: 'schedulingTime',
    label: '上班时间',
    type: 'rangeTimePicker', // 时间选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请选择上班时间'
    },
    rules: [
      { required: true, message: '上班时间不能为空' }
    ]
  }
]

export const actions = ({ cancel, editForm }) => {
  return {
    submit: { // 默认按钮一
      hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    editForm: {
      click: editForm,
      type: 'button',
      label: '确认',
      attr: {
        type: 'primary'
      }
    },
    cancel: {
      click: cancel,
      type: 'button',
      label: '取消'
    }
  }
}
