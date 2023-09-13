/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import moment from 'moment'

let pickerMinDate = ''
export default [
  {
    prop: 'changeType',
    label: '变更类型',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [{
      label: '系统失败返还', value: '1,1'
    }, {
      label: '商品出库扣减', value: '2,1'
    }, {
      label: '人工添加库存', value: '1,2'
    }, {
      label: '人工扣减库存', value: '2,2'
    }]
  },
  {
    prop: 'period',
    label: '时间范围',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    defaultVal: [`${moment().subtract(7, 'days').format('YYYY-MM-DD')} 00:00:00`, `${moment().format('YYYY-MM-DD')} 23:59:59`],
    attr: {
      clearable: true,
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      pickerOptions: {
        // pickerMinDate: '',
        onPick: ({ maxDate, minDate }) => {
          pickerMinDate = minDate.getTime()
          if (maxDate) {
            pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (pickerMinDate !== '') {
            const day62 = (62 - 1) * 24 * 3600 * 1000
            let maxTime = pickerMinDate + day62
            const minTime = pickerMinDate - day62
            if (maxTime > new Date()) {
              maxTime = new Date()
            }
            return time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > moment(`${moment().format('YYYY-MM-DD')} 23:59:59`)
        }
      }
    },
    actions: {}
  }
]

