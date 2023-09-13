/**
 * @author: hzf
 * @description:
 * @date: 2020/7/21
 */

import { houseListApi } from '@/api/goods/manage'

export default [
  {
    prop: 'businessCode',
    label: '业务线',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      // { label: '美术宝1v1', value: '11' },
      // { label: '美术宝小班课', value: '12' },
      // { label: '小熊美术', value: '13' },
      // { label: '物流中台', value: '99' }
    ]
  },
  {
    prop: 'groupId',
    label: '规则组',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: []
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
        checkStrictly: true,
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
    prop: 'appointSupplier',
    label: '条件',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      { label: '不指定承运商', value: 0 },
      { label: '指定承运商', value: 1 }
    ]
  },
  {
    prop: 'areas',
    label: '配送区域',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '请选择区域'
    },
    options: []
  }
]

