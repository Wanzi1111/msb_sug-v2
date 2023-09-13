/*
 * @Author: shasen
 * @Date: 2020-01-06 19:12:36
 * @Last Modified by: shasen
 * @Last Modified time: 2020-03-17 17:13:59
 */
import moment from 'moment'

let pickerMinDate = ''
const defaultEnd = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 23:59:59`)
const defaultStart = moment(`${moment().subtract(8, 'days').format('YYYY-MM-DD')} 23:59:59`)
const defaultStart15 = moment(`${moment().subtract(16, 'days').format('YYYY-MM-DD')} 23:59:59`)
export default ({ search }) => [
  {
    prop: 'businessId',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      multiple: false,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'pushType',
    label: '推送类型',
    type: 'select', // 选择器,
    attr: {
      multiple: false,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'reachType',
    label: '触达方式',
    type: 'select', // 选择器,
    attr: {
      multiple: false,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'group',
    label: '消息分组',
    type: 'select', // 选择器,
    attr: {
      multiple: false,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'pushTarget',
    label: '推送对象',
    type: 'select', // 选择器,
    attr: {
      multiple: false,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'sendDate',
    label: '推送时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    defaultVal: [defaultStart.format('YYYY-MM-DD HH:mm:ss'), defaultEnd.format('YYYY-MM-DD HH:mm:ss')],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      clearable: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick() {
            search.searchs.set({
              type: 'defaultVal',
              data: {
                sendDate: [defaultStart.format('YYYY-MM-DD HH:mm:ss'), defaultEnd.format('YYYY-MM-DD HH:mm:ss')]
              }
            })
          }
        }, {
          text: '最近十五天',
          onClick() {
            search.searchs.set({
              type: 'defaultVal',
              data: {
                sendDate: [defaultStart15.format('YYYY-MM-DD HH:mm:ss'), defaultEnd.format('YYYY-MM-DD HH:mm:ss')]
              }
            })
          }
        }],
        onPick: ({ maxDate, minDate }) => {
          pickerMinDate = minDate.getTime()
          if (maxDate) {
            pickerMinDate = ''
          }
        },
        disabledDate: (time) => {
          if (pickerMinDate !== '') {
            const day30 = (15 - 1) * 24 * 3600 * 1000
            let maxTime = pickerMinDate + day30
            const minTime = pickerMinDate - day30
            if (maxTime > new Date()) {
              maxTime = defaultEnd
            }
            return time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > defaultEnd
        }
      }
    },
    actions: {}
  }
]

