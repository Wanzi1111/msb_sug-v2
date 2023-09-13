/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

export default [
  {
    prop: 'productName',
    label: '商品信息',
    minWidth: 200,
    align: 'center'
  },
  {
    prop: 'productCode',
    label: '商品编码',
    align: 'center'
  },
  {
    prop: 'businessName',
    label: '业务线',
    align: 'center'
  },
  {
    prop: 'supplierName',
    label: '仓储公司',
    align: 'center'
  },
  {
    prop: 'warehouseName',
    label: '仓库',
    align: 'center'
  },
  {
    prop: 'stockNum',
    label: '剩余库存',
    align: 'center'
  },
  {
    prop: 'totalStockNum',
    label: '累计库存',
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    width: 120,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ view }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '查看明细',
          click: () => view(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-view'
          }
        }
      ]
    }
  }
}

