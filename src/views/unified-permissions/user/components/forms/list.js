/**
 * @author: huzhifu
 * @description: 表单配置
 * @date: 2020/5/11
 */

const checkpassword = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  if (!/^[a-zA-z0-9]{6,}$/.test(value)) {
    callback(new Error('密码至少6位，数字或字母组合'))
  } else {
    callback()
  }
}

export default [
  {
    hide: true,
    prop: 'id',
    label: ''
  },
  {
    prop: 'name',
    label: '员工姓名',
    type: 'input',
    attr: {
      placeholder: '请输入',
      disabled: true
    }
  },
  {
    prop: 'phone',
    label: '手机号',
    type: 'input',
    attr: {
      placeholder: '请输入',
      disabled: true
    }
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    attr: {
      placeholder: '请输入',
      disabled: true
    }
  },
  {
    prop: 'password',
    label: '密码',
    type: 'input',
    attr: {
      placeholder: '请输入密码'
    },
    defaultVal: '666666',
    rules: [
      { required: true, message: '密码不能为空' },
      { validator: checkpassword, trigger: 'change' }
    ]
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '开通账号'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
