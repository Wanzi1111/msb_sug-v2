/**
 * @author: hzf
 * @description: 表单配置
 * @date: 2020/7/21
 */

const validateName = (rule, value, callback) => {
  if (value.length < 10 || value.length > 51) {
    callback(new Error('规则组名称10~50个字符'))
  } else {
    callback()
  }
}

export default [
  {
    prop: 'id',
    type: 'hidden',
    label: ''
  },
  {
    prop: 'businessCode',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择业务线',
      clearable: true
    },
    options: [
      // { label: '美术宝1v1', value: '11' },
      // { label: '美术宝小班课', value: '12' },
      // { label: '小熊美术', value: '13' },
      // { label: '物流中台', value: '99' }
    ],
    rules: [
      { required: true, message: '业务线不能为空' }
    ]
  },
  {
    prop: 'routGroupName',
    label: '规则组名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入规则组名称'
    },
    rules: [
      { required: true, message: '规则组名称不能为空' },
      { required: true, trigger: 'blur', validator: validateName }
    ]
  }
]

export const actions = ({ closeDl }) => {
  return {
    submit: {
      label: '确定'
    },
    back: {
      hide: true
    },
    quit: {
      click: closeDl,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
