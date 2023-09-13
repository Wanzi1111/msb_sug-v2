/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import moment from 'moment'

let pickerMinDate = ''
export default [
  {
    prop: 'type',
    label: '导入类型',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      { label: '创建订单类型', value: 1 },
      { label: '批量回填类型', value: 2 }
    ]
  },
  {
    prop: 'time',
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

