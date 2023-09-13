/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
import store from '@/store'
export default [
  {
    prop: 'businessType',
    label: '业务类型',
    type: 'select', // 选择器,
    options: store.getters.adConfig.businessType,
    attr: {
      placeholder: '请选择业务类型'
    },
    rules: [
      { required: true, message: '请选择业务类型' }
    ],
    defaultVal: store.getters.adConfig.businessType[0].label
  },
  {
    prop: 'userType',
    label: '用户定向',
    type: 'checkbox', // 单选框,
    options: [],
    rules: [
      { required: true, message: '用户定向不能为空' }
    ]
  },
  {
    prop: 'advertIds',
    label: '广告位',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择广告位'
    },
    options: [],
    rules: [
      { required: true, message: '请选择一个广告位' }
    ]
  },
  {
    prop: 'startTime',
    label: '开始时间',
    type: 'dateTimePicker', // 日期选择器,
    attr: {
      type: 'datetime',
      placeholder: '请选择投放开始时间'
    },
    rules: [
      { required: true, message: '投放开始时间不能为空' }
    ]
  },
  {
    prop: 'endTime',
    label: '结束时间',
    type: 'dateTimePicker', // 日期选择器,
    attr: {
      type: 'datetime',
      defaultTime: '23:59:59',
      placeholder: '请选择投放结束时间'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '不填表示不限制'
    }
  },
  {
    prop: 'use',
    label: '已投放数',
    type: 'text', // 文本,
    defaultVal: '0/0'
  },
  {
    prop: 'media',
    label: '选择物料',
    slot: 'media',
    rules: [
      { required: true, message: '物料不能为空' }
    ]
  },
  {
    prop: 'enabled',
    label: '是否开启',
    type: 'switch', // 开关,
    defaultVal: true
  }
]

export const actions = {
  submit: {
    label: '投放',
    attr: {
      icon: 'el-icon-upload'
    }
  }
}

