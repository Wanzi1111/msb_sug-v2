/**
 * @author: huzhifu
 * @description: 表单配置
 * @date: 2020/5/12
 */

export default [
  {
    prop: 'id',
    type: 'hidden',
    label: ''
  },
  {
    prop: 'level',
    type: 'hidden',
    label: ''
  },
  {
    prop: 'name',
    label: '菜单名称',
    type: 'input',
    attr: {
      placeholder: '请输入菜单名称'
    },
    rules: [
      { required: true, message: '菜单名称不能为空', trigger: 'blur' },
      { max: 15, message: '长度不能超过15个字符', trigger: 'blur' }
    ]
  },
  {
    prop: 'parentMenu',
    label: '父菜单',
    type: 'cascader',
    attr: {
      placeholder: '请选择',
      clearable: true,
      options: [],
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'id'
      }
    }
    // rules: [
    //   { required: true, message: '父菜单不能为空', trigger: 'change' }
    // ]
  },
  {
    prop: 'type',
    label: '类型',
    type: 'select',
    attr: {
      placeholder: '请选择'
    },
    options: [
      { label: '菜单目录', value: 1 }
    ],
    rules: [
      { required: true, message: '类型不能为空', trigger: 'change' }
    ]
  },
  {
    prop: 'url',
    label: '请求路径',
    type: 'input',
    attr: {
      placeholder: '请输入请求路径'
    },
    rules: [
      { required: true, message: '请求路径不能为空' }
    ]
  }
]

export const actions = ({ closeMenuDialog }) => {
  return {
    submit: {
      label: '提交'
    },
    back: {
      hide: true
    },
    quit: {
      click: closeMenuDialog,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
