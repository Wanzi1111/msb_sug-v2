export default [
  {
    prop: 'listType',
    label: '勿扰类型',
    type: 'select', // 选择器,
    defaultVal: [],
    attr: {
      multiple: true,
      size: 'small',
      collapseTags: true,
      placeholder: '请选择勿扰类型',
      clearable: true
    },
    options: []
  },
  {
    prop: 'disturbMobile',
    label: '手机号',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入手机号',
      clearable: true
    }
  },
  {
    prop: 'inputName',
    slot: 'handlePeople',
    label: '操作人'
    // attr: {
    //   size: 'small',
    //   placeholder: '请输入操作人',
    //   clearable: true
    // }
  },
  {
    prop: 'selectName',
    defaultVal: '1',
    hide: true,
    visible: false
  }
]
