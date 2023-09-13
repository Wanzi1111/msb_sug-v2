/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/3/9
 */
export default [
  {
    prop: 'clientTypeId',
    label: '客户端',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择客户端'
    },
    options: [],
    rules: [
      { required: true, message: '客户端不能为空' }
    ]
  },
  {
    prop: 'upgradeTypeId',
    label: '升级类型',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择升级类型'
    },
    options: [],
    rules: [
      { required: true, message: '升级类型不能为空' }
    ]
  },
  {
    prop: 'version',
    label: '版本号',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择版本号'
    },
    options: [],
    rules: [
      { required: true, message: '版本号不能为空' }
    ]
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '添加'
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
