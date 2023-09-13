import childChannel from '../components/childChannel'
export default [
  {
    type: 'expand',
    align: 'center',
    render: (h, dat, row) => {
      return h(childChannel, {
        props: { row }
      })
    }
  },
  {
    prop: 'id',
    label: '投诉来源ID',
    align: 'center'
    // fixed: true,
    // width: 140
  },
  {
    prop: 'cpSource',
    label: '投诉来源',
    align: 'center'
    // fixed: true,
    // width: 180
  },
  {
    prop: 'businessName',
    label: '业务线',
    align: 'center'
    // fixed: true,
    // width: 180
  },
  {
    action: true,
    label: '状态',
    name: 'status',
    prop: 'status',
    align: 'center'
    // fixed: true,
    // width: 140
  },
  {
    action: true,
    name: 'action',
    width: 280,
    prop: 'action',
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ tableAction }) => {
  return {
    status: (dat, row, index) => {
      return [
        {
          type: 'tag',
          label: row.status === 0 ? '启用中' : '已停用',
          attr: {
            type: row.status === 0 ? 'success' : 'info'
          }
        }
      ]
    },
    action: (dat, row, index) => {
      let action = []
      action = [
        {
          label: '编辑',
          attr: {
            command: 'editChannelType',
            icon: 'el-icon-edit'
          }
        },
        // {
        //   label: row.status ? '设为启用' : '设为停用',
        //   attr: {
        //     command: 'setStatus',
        //     icon: 'el-icon-open'
        //   }
        // },
        {
          label: '新增投诉途径',
          attr: {
            command: 'addComplintChannel',
            icon: 'el-icon-plus'
          }
        }
      ]
      return [
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
