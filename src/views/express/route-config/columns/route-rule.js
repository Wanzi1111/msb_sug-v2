/**
 * @author: hzf
 * @description:
 * @date: 2020/7/21
 */

const appointSupplierMap = {
  0: '不指定承运商',
  1: '指定承运商'
}

export default [
  {
    prop: 'title',
    label: '规则优先级',
    align: 'center',
    render: (h, dat, row) => {
      return h('div', [
        h('span', row.title),
        h('span', {
          style: {
            color: '#999',
            display: 'block'
          }
        }, row.routName)
      ])
    }
  },
  {
    prop: 'routGroupName',
    label: '规则组',
    align: 'center',
    render: (h, dat, row) => {
      return h('div', [
        h('span', row.businessLabel),
        h('span', {
          style: {
            color: '#999',
            display: 'block'
          }
        }, row.routGroupName)
      ])
    }
  },
  {
    prop: 'appointSupplier',
    label: '条件',
    align: 'center',
    render: (h, dat, row) => {
      return h('div', [
        h('span', '仓储发货'),
        h('span', {
          style: {
            color: '#999',
            display: 'block'
          }
        }, appointSupplierMap[dat])
      ])
    }
  },
  {
    prop: 'areas',
    label: '配送区域',
    align: 'center',
    render: (h, dat, row) => {
      return h('div', [
        h('span', dat === '全国' ? '全国' : '区域'),
        h('span', {
          style: {
            color: '#999',
            display: 'block'
          }
        }, dat === '全国' ? '不含港澳台' : dat)
      ])
    }
  },
  {
    prop: 'wareHouseCode',
    label: '发货仓库',
    align: 'center',
    render: (h, dat, row) => {
      return h('div', [
        h('span', row.wareHouseName),
        h('span', {
          style: {
            color: '#999',
            display: 'block'
          }
        }, `${row.businessLabel}-${row.supplierName}`)
      ])
    }
  },
  {
    action: true,
    name: 'status',
    prop: 'status',
    label: '状态',
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

export const actions = ({ setUp, setDown, tableAction }) => {
  return {
    status: (dat, row, index) => {
      return [
        {
          type: 'tag',
          label: Number(row.status) ? '启用中' : '已停用',
          attr: {
            type: Number(row.status) ? 'success' : 'info'
          }
        }
      ]
    },
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          attr: {
            size: 'mini',
            icon: 'el-icon-top'
          },
          click: setUp
        },
        {
          type: 'button',
          click: setDown,
          attr: {
            size: 'mini',
            icon: 'el-icon-bottom'
          }
        },
        {
          type: 'button', // 按钮
          attr: {
            icon: 'el-icon-more',
            size: 'mini'
          },
          click: () => {},
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            attr: {
              trigger: 'click'
            },
            command: (e, dat, row, index) => tableAction(dat, row, index, e),
            item: [
              {
                label: Number(row.status) ? '设为停用' : '设为启用',
                attr: {
                  command: Number(row.status) ? 'setRuleEnd' : 'setRuleStart'
                }
              },
              {
                label: '编辑路由',
                attr: {
                  command: 'editRoute'
                }
              },
              {
                label: '删除路由',
                attr: {
                  command: 'delRoute'
                }
              }
            ]
          }
        }
      ]
    }
  }
}

