/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

export default [
  {
    prop: 'order',
    slot: 'order',
    label: '物流单',
    minWidth: 180,
    fixed: true,
    align: 'center'
  },
  {
    prop: 'product',
    slot: 'product',
    label: '商品信息',
    minWidth: 160,
    align: 'center'
  },
  {
    prop: 'consignee',
    slot: 'consignee',
    label: '收件人信息',
    minWidth: 300,
    align: 'center'
  },
  {
    prop: 'supplier',
    slot: 'supplier',
    label: '仓储信息',
    minWidth: 160,
    align: 'center'
  },
  {
    prop: 'express',
    slot: 'express',
    label: '快递信息',
    minWidth: 160,
    align: 'center'
  },
  {
    prop: 'status',
    slot: 'status',
    label: '物流状态',
    minWidth: 180,
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    fixed: 'right',
    width: 160,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ tableAction }) => {
  return {
    action: (dat, row, index) => {
      let action = []
      // 1:待审核
      // 2:
      // 3:待发货
      // 4:已发货
      // 5:已签收
      // 6:已取消
      // 7:出库失败
      switch (row.status) {
        case 0:
          break
        case 1:
          action = [
            {
              label: '修改',
              attr: {
                command: 'ExpressManageCreate',
                icon: 'el-icon-edit'
              }
            },
            {
              label: '审核',
              attr: {
                command: 'examine',
                icon: 'el-icon-s-check'
              }
            },
            {
              label: '删除',
              attr: {
                command: 'deletes',
                icon: 'el-icon-delete'
              }
            }
          ]
          break
        case 3:
          action = [
            {
              label: '撤回',
              attr: {
                command: 'back',
                icon: 'el-icon-refresh-left'
              }
            },
            {
              label: '回填单号',
              attr: {
                command: 'returns',
                icon: 'el-icon-edit'
              }
            },
            {
              label: '取消',
              attr: {
                command: 'cancel',
                icon: 'el-icon-close'
              }
            }
          ]
          break
        case 4:
          action = [
            {
              label: '取消',
              attr: {
                command: 'cancel',
                icon: 'el-icon-close'
              }
            },
            {
              label: '撤回',
              attr: {
                command: 'back',
                icon: 'el-icon-refresh-left'
              }
            }
          ]
          break
        case 5:
          action = [
            {
              label: '取消',
              attr: {
                command: 'cancel',
                icon: 'el-icon-close'
              }
            }
            // {
            //   label: '退货',
            //   attr: {
            //     disabled: true,
            //     command: 'backGoods',
            //     icon: 'el-icon-sell'
            //   }
            // }
          ]
          break
        case 6:
          action = [
            {
              label: '重审',
              attr: {
                command: 'againExamine',
                icon: 'el-icon-s-check'
              }
            },
            {
              label: '撤回',
              attr: {
                command: 'back',
                icon: 'el-icon-refresh-left'
              }
            }
          ]
          break
        case 7:
          action = [
            {
              label: '重审',
              attr: {
                command: 'againExamine',
                icon: 'el-icon-s-check'
              }
            }
          ]
          break
      }
      return [
        // {
        //   type: 'button',
        //   label: '物流详情',
        //   click: (dat, row, index) => tableAction(dat, row, index, 'deliver'),
        //   attr: {
        //     size: 'mini',
        //     icon: 'el-icon-truck',
        //     type: 'primary'
        //   }
        // },
        {
          type: 'button',
          label: '查看订单',
          click: (dat, row, index) => tableAction(dat, row, index, 'order'),
          attr: {
            size: 'mini',
            icon: 'el-icon-view'
          }
        },
        {
          type: 'button', // 按钮
          // label: '更多操作',
          attr: {
            icon: 'el-icon-more',
            size: 'mini'
            // type: 'primary'
            // iconLayout: 'right'
          },
          click: () => {},
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            attr: {
              trigger: 'click'
            },
            command: (e, dat, row, index) => tableAction(dat, row, index, e),
            item: action
          }
        }
      ]
    }
  }
}

