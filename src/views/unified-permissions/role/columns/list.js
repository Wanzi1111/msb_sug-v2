/**
 * @author: huzhifu
 * @description:
 * @date: 2020/5/11
 */
export default [
  {
    prop: 'id',
    label: '序号',
    align: 'center',
    width: 60
  },
  {
    prop: 'roleName',
    label: '角色名称',
    align: 'center'
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    align: 'center'
  },
  {
    prop: 'actions',
    label: '操作',
    align: 'center',
    action: true,
    name: 'actions'
  }
]
export const actions = ({ handleEdit }) => {
  return {
    actions: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '编辑',
          click: handleEdit,
          attr: {
            size: 'mini',
            icon: 'el-icon-edit',
            type: 'success'
          }
        }
      ]
    }
  }
}
