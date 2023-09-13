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
  },
  {
    prop: 'updateLevel',
    label: '升级策略',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择升级策略'
    },
    options: [
      {
        label: '非强制升级',
        value: 1
      },
      {
        label: '强制升级',
        value: 2
      }
    ],
    rules: [
      { required: true, message: '升级策略不能为空' }
    ]
  },
  {
    prop: 'pushType',
    label: '是否通知',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择是否通知'
    },
    options: [
      {
        label: '无消息通知',
        value: 1
      },
      {
        label: '消息通知',
        value: 2
      }
    ],
    rules: [
      { required: true, message: '是否通知不能为空' }
    ]
  },
  {
    prop: 'updateDesc',
    label: '更新描述',
    type: 'input', // 选择器,
    attr: {
      placeholder: '请输入更新描述',
      type: 'textarea',
      rows: '6'
    },
    rules: [
      { required: true, message: '更新描述不能为空' }
    ]
  },
  {
    prop: 'state',
    label: '是否启用',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择是否启用'
    },
    defaultVal: 0,
    options: [
      {
        label: '启用',
        value: 1
      },
      {
        label: '禁用',
        value: 0
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
