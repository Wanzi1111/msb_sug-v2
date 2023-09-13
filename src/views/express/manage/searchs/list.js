/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import moment from 'moment'
import { houseListApi } from '@/api/goods/manage'

let pickerMinDate = ''
export default [
  {
    prop: 'businessCode',
    label: '业务线',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'orderNo',
    label: '物流单号',
    type: 'input',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '请输入物流单号'
    }
  },
  {
    prop: 'time',
    label: '创建时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    // hide: true,
    defaultVal: [`${moment().subtract(7, 'days').format('YYYY-MM-DD')} 00:00:00`, `${moment().format('YYYY-MM-DD')} 23:59:59`],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      clearable: true,
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
  },
  {
    prop: 'productCode',
    label: '商品编码',
    type: 'input',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '请输入商品编码'
    }
  },
  // {
  //   prop: 'warehouseNo',
  //   label: '发货仓库',
  //   type: 'select',
  //   // hide: true,
  //   attr: {
  //     placeholder: '全部'
  //   },
  //   options: []
  // },
  {
    prop: 'warehouseNo',
    label: '发货仓库',
    type: 'cascader', // 级联选择器,
    attr: {
      clearable: true,
      options: [],
      placeholder: '请选择发货仓库',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          console.log(node)
          if (node.level !== 0) {
            let data = {}
            if (node.level === 1) {
              data = {
                businessCode: node.value
              }
            } else {
              data = {
                businessCode: node.data.businessCode,
                supplierId: node.value
              }
            }
            houseListApi(data).then(res => {
              const data = res.data || {}
              const nodes = []
              const ids = []
              data.map(item => {
                if (node.level === 1) {
                  if (!ids.includes(item.supplierId)) {
                    ids.push(item.supplierId)
                    nodes.push({
                      businessCode: item.businessCode,
                      label: item.supplierName,
                      value: item.supplierId,
                      leaf: false
                    })
                  }
                } else {
                  nodes.push({
                    value: item.warehouseCode,
                    label: item.warehouseName,
                    leaf: true
                  })
                }
              })
              console.log(nodes)
              resolve(nodes)
            })
          }
        }
      }
    }
  },
  {
    prop: 'city',
    label: '收货区域',
    type: 'cascader', // 级联选择器,
    attr: {
      clearable: true,
      options: [],
      placeholder: '请选择省市区'
    }
  },
  {
    prop: 'consigneeMobile',
    label: '手机号',
    type: 'input',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '请输入手机号'
    }
  },
  {
    prop: 'expressCode', // TODO
    label: '快递公司',
    type: 'select',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'trackingNum',
    label: '快递单号',
    type: 'input',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '请输入快递单号'
    }
  },
  {
    prop: 'batchId',
    label: '导入批次',
    type: 'input',
    // hide: true,
    attr: {
      clearable: true,
      placeholder: '请输入导入批次'
    }
  }
]

