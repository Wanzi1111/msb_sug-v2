/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

export default [
  {
    prop: 'productCode',
    label: '商品ID',
    align: 'center'
  },
  {
    prop: 'productName',
    label: '商品名称',
    align: 'center'
  },
  {
    prop: 'stockNum',
    label: '库存数量',
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ choice }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '选择',
          click: () => choice(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-check',
            type: 'primary'
          }
        }

      ]
    }
  }
}

