// 添加勿扰标签
export const categorieDatas = [
  {
    value: 32,
    label: '艺术宝'
  },
  {
    value: 1,
    label: '美术宝1对1'
  },
  {
    value: 2,
    label: '美术宝小班课'
  },
  {
    value: 3,
    label: '小熊美术'
  },
  {
    value: 4,
    label: '小熊书法'
  },
  {
    value: 5,
    label: '小熊音乐'
  },
  {
    value: 6,
    label: '小熊舞蹈'
  }
]
export const disturbForm = [
  {
    prop: 'types',
    label: '勿扰类型',
    type: 'checkbox',
    options: [
      { label: '营销短信勿扰', value: 1 },
      { label: '营销电话勿扰', value: 2 }
    ],
    rules: [
      // 校验
      { required: true, message: '勿扰类型必选' }
    ]
  },
  {
    prop: 'categories',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true
    },
    options: categorieDatas,
    rules: [ // 校验
      { required: true, message: '业务线必选！' }
    ]
  },
  {
    prop: 'areaCode',
    label: '区号',
    type: 'input',
    defaultVal: '+86',
    attr: {
      placeholder: '请输入区号'
    },
    rules: [ // 校验
      { required: true, message: '区号必填！' }
    ]
  },
  {
    prop: 'mobiles',
    label: '手机号',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入（多个一行一个）'
    },
    rules: [ // 校验
      { required: true, message: '手动输入必填！' }
    ]
  },
  {
    prop: 'effectDays',
    label: '有效期',
    type: 'radio',
    options: [
      { label: '一个月', value: '30' },
      { label: '三个月', value: '60' },
      { label: '永久', value: '0' }
    ],
    rules: [
      // 校验
      { required: true, message: '勿扰类型必选' }
    ]
  },
  {
    prop: 'remark',
    label: '备注原因',
    type: 'textarea',
    attr: {
      placeholder: '请输入备注原因'
    }
  }
]
export const actions = ({ cancel, ensure }) => {
  return {
    submit: {
      // 默认按钮一
      hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    ensure: {
      click: ensure,
      type: 'button',
      label: '确定',
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
