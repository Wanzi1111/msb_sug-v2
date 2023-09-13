/**
 * @author: Liwei
 * @description: 新建广告位表单配置
 * @date: 2020/1/4
 */
import store from '@/store'
export default [
  {
    prop: 'businessType',
    label: '业务类型',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择业务类型'
    },
    options: store.getters.adConfig.businessType,
    rules: [
      { required: true, message: '业务类型不能为空' }
    ],
    defaultVal: store.getters.adConfig.businessType[0].label || ''
  },
  {
    prop: 'clientType',
    label: '客户端',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择客户端'
    },
    // options: store.getters.adConfig.clientType,
    rules: [
      { required: true, message: '客户端不能为空' }
    ]
  },
  {
    prop: 'advertType',
    label: '广告类型',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择广告类型'
    },
    options: store.getters.adConfig.advertType,
    rules: [
      { required: true, message: '广告类型不能为空' }
    ]
  },
  {
    prop: 'totalCount',
    label: '广告数量',
    type: 'inputNumber', // 计数器,
    defaultVal: 1,
    rules: [
      { required: true, message: '广告数量不能为空' }
    ],
    attr: {
      min: 1,
      max: 99,
      placeholder: '请输入广告数量'
    }
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '新增'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
