/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import moment from 'moment'
import { categoryList } from '@/api/goods/category'
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
    prop: 'supplierDelivery',
    label: '发货方式',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      {
        label: '仓储发货',
        value: 1
      },
      {
        label: '线下发货',
        value: 2
      }
    ]
  },
  {
    prop: 'period',
    label: '时间范围',
    type: 'dateTimePicker',
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
    }
  },
  {
    prop: 'productType',
    label: '商品类型',
    type: 'cascader',
    attr: {
      clearable: true,
      placeholder: '全部',
      collapseTags: true,
      props: {
        // checkStrictly: true,
        lazy: true,
        multiple: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          const { level } = node
          categoryList({
            pcode: level === 1 ? node.value : 0,
            level: level + 1,
            status: 1,
            pageAble: 'false'
          }).then(res => {
            const data = res.data || {}
            const list = data.rows || []

            const nodes = []
            list.map(item => {
              nodes.push({
                value: item.code,
                label: item.typeName,
                leaf: level === 1
              })
            })
            resolve(nodes)
          })
        }
      }
    }
  },
  {
    prop: 'productCode',
    label: '商品编码',
    type: 'input',
    attr: {
      clearable: true,
      placeholder: '请输入商品编码'
    }
    // options: []
  },
  {
    prop: 'warehouseNo',
    label: '发货仓库',
    type: 'cascader',
    attr: {
      clearable: true,
      options: [],
      placeholder: '全部',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
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
              resolve(nodes)
            })
          }
        }
      }
    }
    // options: []
  },
  {
    prop: 'consigneeProvince',
    label: '收货区域',
    type: 'cascader', // 级联选择器,
    attr: {
      clearable: true,
      options: [],
      placeholder: '请选择收货区域',
      props: {
        value: 'label',
        label: 'label'
      }
    }
  },
  {
    prop: 'supplierId', // expressCode
    label: '快递公司',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: []
  }
]

