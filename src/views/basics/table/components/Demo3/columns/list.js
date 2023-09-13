/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */
const ChrTable = () => import('../components/ChrTable')

export default ({ openDl, switchState, edit, del }) => {
  return [
    {
      align: 'center',
      prop: 'ss',
      type: 'expand',
      customRender: (h, dat, row) => h(ChrTable, { props: { row: row }})
    },
    {
      prop: 'messageName',
      label: '序号',
      align: 'center'
    },
    {
      prop: 'group',
      label: '类型名称',
      align: 'center'
    },
    {
      prop: 'pushType',
      label: '类型描述',
      align: 'center'
    },
    {
      prop: 'pushType',
      label: '二级分类',
      align: 'center'
    },
    {
      action: true,
      name: 'action',
      prop: 'action',
      width: 280,
      label: '操作',
      align: 'center'
    }
  ]
}

export const actions = ({ switchState, edit, del }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '停用',
          click: switchState,
          attr: {
            size: 'mini',
            icon: 'el-icon-warning',
            type: 'danger'
          }
        },
        // {
        //   type: 'button',
        //   label: '启用',
        //   click: switchState,
        //   attr: {
        //     size: 'mini',
        //     icon: 'el-icon-check',
        //     type: 'success'
        //   }
        // },
        {
          type: 'button',
          label: '编辑',
          click: edit,
          attr: {
            size: 'mini',
            icon: 'el-icon-edit',
            type: 'primary'
          }
        },
        {
          type: 'button',
          label: '删除',
          click: del,
          attr: {
            size: 'mini',
            icon: 'el-icon-delete',
            type: 'danger'
          }
        }
      ]
    }
  }
}

