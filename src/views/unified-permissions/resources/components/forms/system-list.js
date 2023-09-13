/**
 * @author: huzhifu
 * @description: 表单配置
 * @date: 2020/5/12
 */

export default [
  {
    hide: true,
    prop: 'id',
    label: ''
  },
  {
    prop: 'name',
    label: '系统名称',
    type: 'input',
    attr: {
      placeholder: '请输入系统名称'
    },
    rules: [
      { required: true, message: '系统名称不能为空', trigger: 'blur' },
      { max: 25, message: '长度不能超过25个字符', trigger: 'blur' }
    ]
  },
  {
    prop: 'url',
    label: '请求地址',
    type: 'input',
    attr: {
      placeholder: '请输入请求地址'
    },
    rules: [
      { required: true, message: '请求地址不能为空' }
    ]
  }
  // {
  //   prop: 'code',
  //   label: '系统编码',
  //   type: 'input',
  //   attr: {
  //     placeholder: '请输入系统编码'
  //   },
  //   rules: [
  //     { required: true, message: '系统编码不能为空' }
  //   ]
  // }
]

export const actions = ({ closeSysDialog }) => {
  return {
    submit: {
      label: '提交'
    },
    back: {
      hide: true
    },
    quit: {
      click: closeSysDialog,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
