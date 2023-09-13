/**
 * @author: huzhifu
 * @description:
 * @date: 2020/5/11
 */
export default [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
    width: 60
  },
  {
    prop: 'name',
    label: '员工姓名',
    align: 'center'
  },
  {
    prop: 'position',
    label: '职位',
    minWidth: 150,
    align: 'center'
  },
  {
    prop: 'phone',
    label: '手机号',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'email',
    label: '邮箱',
    minWidth: 200,
    align: 'center'
  },
  {
    prop: 'roleName',
    label: '角色',
    align: 'center'
  },
  {
    prop: 'actions',
    label: '操作',
    align: 'center',
    width: 180,
    fixed: 'right',
    action: true,
    name: 'actions'
  }
]
export const actions = ({ handleAssignRole, handleCreateAccount }) => {
  return {
    actions: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '分配角色',
          click: handleAssignRole,
          attr: {
            size: 'mini',
            type: 'success',
            disabled: !row.assignRole
          }
        },
        {
          type: 'button',
          label: '开通账号',
          click: handleCreateAccount,
          attr: {
            size: 'mini',
            type: 'primary'
          }
        }
      ]
    }
  }
}
