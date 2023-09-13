/**
 * @author: Liwei
 * @description: 快速投放表单配置
 * @date: 2020/1/4
 */
import store from '@/store'

const idsRule = (rule, value, callback) => {
  if (!value.length) {
    callback(new Error('请至少选择一个广告位'))
  } else {
    callback()
  }
}

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
    type: 'checkbox', // 多选框
    options: [],
    rules: [
      { required: true, message: '用户定向不能为空' }
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
    prop: 'advertIds',
    label: '选择广告位',
    type: 'checkbox-table', // 表格选择器,
    defaultVal: [],
    rules: [
      { validator: idsRule, trigger: ['blur', 'change'] }
    ],
    table: {
      attr: {
        'class': 'samll-checkbox-table',
        style: {
          minWidth: '400px'
        }
      },
      column: [
        {
          prop: 'name',
          label: '广告位名称',
          align: 'center'
        },
        {
          prop: 'num',
          label: '已投放广告数量',
          align: 'right',
          width: 120
        }
      ],
      data: []
    }
  },
  {
    prop: 'enabled',
    label: '是否开启',
    type: 'switch', // 开关,
    defaultVal: true
  }
]

export const actions = ({ quit }) => {
  return {
    submit: {
      label: '提交'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '关闭',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
