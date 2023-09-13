/**
 * @author: Liwei
 * @description: 商品列表表头配置
 * @date:
 */
export default [
  {
    type: 'selection',
    width: 40,
    align: 'center'
  },
  {
    width: 60,
    prop: 'id',
    label: '编号',
    align: 'center'
  },
  {
    width: 200,
    prop: 'name',
    label: '商品名称',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'type',
    label: '商品类别',
    align: 'center'
  },
  {
    prop: 'category',
    label: '商品分类',
    align: 'center'
  },
  {
    prop: 'time',
    label: '上架时间',
    align: 'center'
  },
  {
    prop: 'state',
    label: '状态',
    align: 'center',
    render: (dat) => {
      return dat ? '上架中' : '已下架'
    }
  },
  {
    name: 'action',
    prop: 'action',
    label: '操作',
    width: 260,
    align: 'center',
    action: true
  }
]
export const actions = ({ view, put, del }) => {
  return {
    action: [
      {
        type: 'button',
        click: view,
        label: '商品详情',
        attr: {
          size: 'mini',
          icon: 'el-icon-view'
        }
      },
      {
        type: 'button',
        click: put,
        label: '上架',
        attr: {
          size: 'mini',
          type: 'primary',
          // icon: 'el-icon-sold-out'
          icon: 'el-icon-sell'
        }
      },
      {
        type: 'button',
        click: del,
        label: '删除',
        attr: {
          size: 'mini',
          type: 'danger',
          icon: 'el-icon-delete'
        }
      }
    ]
  }
}
