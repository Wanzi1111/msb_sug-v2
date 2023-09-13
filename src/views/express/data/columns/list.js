/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

export default [
  {
    prop: 'createDate',
    label: '日期',
    width: 100,
    align: 'center'
  },
  {
    prop: 'productName',
    // slot: 'productName',
    minWidth: 150,
    label: '商品信息',
    align: 'center'
  },
  {
    prop: 'productCode',
    label: '商品编码',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'supplierDelivery',
    label: '发货方式',
    align: 'center',
    render: (h, dat) => {
      return ['', '仓储发货', '线下发货'][dat]
    }
  },
  {
    prop: 'supplierName',
    label: '承运商',
    align: 'center'
  },
  {
    prop: 'warehouseName',
    label: '仓库',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'totalOrderNum',
    label: '物流单总数',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'dshOrderNum',
    label: '待审核',
    align: 'center'
  },
  {
    prop: 'dfhOrderNum',
    label: '待发货',
    align: 'center'
  },
  {
    prop: 'yfhOrderNum',
    label: '已发货',
    align: 'center'
  },
  {
    prop: 'yqsOrderNum',
    label: '已签收',
    align: 'center'
  },
  {
    prop: 'yqxOrderNum',
    label: '已取消',
    align: 'center'
  },
  {
    prop: 'ysbOrderNum',
    label: '出库失败',
    align: 'center'
  }
]

export const actions = ({ look }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '查看物流单',
          click: look,
          attr: {
            size: 'mini',
            icon: 'el-icon-truck'
          }
        }
      ]
    }
  }
}

