/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/4
 */
import store from '@/store'
export default [
  {
    prop: 'resourceName',
    label: '物料名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入物料名称'
    }
  },
  {
    prop: 'advertType',
    label: '广告类型',
    type: 'select', // 选择器,
    options: store.getters.adConfig.advertType,
    attr: {
      placeholder: '请选择广告类型'
    }
  },
  {
    prop: 'time',
    label: '投放时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    prop: 'publishStatus',
    label: '投放状态',
    type: 'select', // 选择器,
    options: [
      {
        label: '投放中',
        value: '0'
      },
      {
        label: '等待投放',
        value: '1'
      },
      {
        label: '投放结束',
        value: '2'
      },
      {
        label: '未投放',
        value: '3'
      }
    ],
    attr: {
      placeholder: '请选择投放状态'
    }
  }
]

