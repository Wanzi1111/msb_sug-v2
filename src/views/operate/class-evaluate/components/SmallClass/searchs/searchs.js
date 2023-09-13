/*
 * @Author: shasen
 * @Date: 2020-01-06 19:12:36
 * @Last Modified by: shasen
 * @Last Modified time: 2020-02-06 12:39:09
 */

import moment from 'moment'

let pickerMinDate = ''
export default [
  {
    prop: 'stuId',
    label: '用户ID',
    type: 'inputNumber', // 选择器,
    attr: {
      placeholder: '请输入用户ID',
      min: -2147483648,
      max: 2147483648,
      controlsPosition: 'right',
      class: 'input-number-left'
    }
  },
  {
    prop: 'lessonType',
    label: '课程类型',
    type: 'select', // 选择器,
    attr: {
      placeholder: '全部',
      clearable: true
    },
    options: [
      {
        label: '正式课',
        value: 1
      },
      {
        label: '专题课',
        value: 2
      },
      {
        label: '试听课',
        value: 3
      }
    ]
  },
  {
    prop: 'tecId',
    label: '上课老师',
    type: 'inputNumber', // 选择器,
    attr: {
      placeholder: '请输入老师ID',
      min: -2147483648,
      max: 2147483648,
      controlsPosition: 'right',
      class: 'input-number-left'
    }
  },
  {
    prop: 'score',
    label: '评价分数',
    type: 'select', // 选择器,
    attr: {
      placeholder: '全部',
      clearable: true
    },
    options: [
      {
        label: '5星',
        value: 5
      },
      {
        label: '4星',
        value: 4
      },
      {
        label: '3星',
        value: 3
      },
      {
        label: '2星',
        value: 2
      },
      {
        label: '1星',
        value: 1
      }
    ]
  },
  {
    prop: 'classTime',
    label: '上课时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    defaultVal: [moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      clearable: false,
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
            const day30 = (30 - 1) * 24 * 3600 * 1000
            let maxTime = pickerMinDate + day30
            const minTime = pickerMinDate - day30
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

