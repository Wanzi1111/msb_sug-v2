/**
 * @author: huzhifu
 * @description:
 * @date: 2020/5/11
 */
export default [
  {
    type: 'selection', // 设置该列为可选列
    width: 40,
    align: 'center'
  },
  {
    prop: 'roleName',
    label: '角色名称',
    align: 'center'
  }
  // {
  //   prop: 'actions',
  //   label: '操作',
  //   align: 'center',
  //   // minWidth: 260,
  //   action: true,
  //   name: 'actions'
  // }
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
            type: 'success'
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
