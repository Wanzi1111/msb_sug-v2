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
    prop: 'versionDesc',
    label: '版本号',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择版本号'
    },
    options: [],
    rules: [
      { required: true, message: '版本号不能为空' }
    ]
  },
  {
    prop: 'reviewType',
    label: '审核类型',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择审核类型'
    },
    options: [],
    rules: [
      { required: true, message: '审核类型不能为空' }
    ]
  },
  {
    prop: 'enableState',
    label: '是否启用',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择是否启用'
    },
    defaultVal: '0',
    options: [
      {
        label: '启用',
        value: '1'
      },
      {
        label: '禁用',
        value: '0'
      }
    ],
    rules: [
      { required: true, message: '是否启用不能为空' }
    ]
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '确认',
      confirm: true,
      confirmConfig: {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        label: '提示',
        text: '确认发布通知？'
      }
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
