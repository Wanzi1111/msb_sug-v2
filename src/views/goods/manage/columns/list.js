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
    width: 300,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ set, editNum, edit, del }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '设置仓库',
          click: () => set(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-coin'
          }
        },
        {
          type: 'button',
          label: '修改库存',
          click: () => editNum(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-s-order'
          }
        },
        {
          type: 'button',
          label: '编辑',
          click: () => edit(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-edit-outline',
            type: 'primary'
          }
        }
        // {
        //   type: 'button',
        //   label: '删除',
        //   click: () => del(row),
        //   attr: {
        //     size: 'mini',
        //     icon: 'el-icon-delete',
        //     type: 'danger'
        //   }
        // }
      ]
    }
  }
}

