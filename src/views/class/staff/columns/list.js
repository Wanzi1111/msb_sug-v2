/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-04 14:19:58
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-29 20:30:36
 */
export default [
  {
    prop: 'staffName',
    label: '员工姓名',
    align: 'center'
    // width: 200
  },
  {
    prop: 'businessCard',
    label: '对外名片',
    align: 'center'
    // width: 200
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    align: 'center'
    // width: 200
  },
  {
    prop: 'roleName',
    label: '员工角色',
    align: 'center'
    // width: 200
  },
  {
    prop: 'manageBusinessName',
    label: '管理业务线',
    align: 'center',
    minWidth: 180,
    showOverflowTooltip: true
    // width: 200
  },
  {
    action: true,
    prop: 'statusName',
    label: '状态',
    name: 'tag',
    align: 'center',
    width: 200
  },
  {
    action: true,
    name: 'action',
    width: 200,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
    // disabled: true
  }
]

export const actions = ({ tableAction }) => {
  return {
    tag: (dat, row, index) => {
      const type = ['warning', 'success']
      return [
        {
          type: 'tag',
          label: dat,
          attr: {
            type: type[row.status]
          }
        }
      ]
    },
    action: (dat, row, index) => {
      let action = []
      action = [
        {
          label: '编辑名片',
          attr: {
            command: 'edit',
            icon: 'el-icon-edit-outline'
          }
        },
        {
          label: '重置密码',
          attr: {
            command: 'reset',
            icon: 'el-icon-refresh-right'
          }
        },
        {
          label: '删除',
          attr: {
            command: 'delete',
            icon: 'el-icon-delete'
          }
        }
      ]
      return [
        {
          type: 'button',
          label: row.status === 0 ? '设为停用' : '设为启用',
          click: (dat, row, index) => tableAction(dat, row, index, 'open'),
          attr: {
            // disabled: !![3, 4, 6].includes(row.cpStatus),
            size: 'mini',
            icon: 'el-icon-open'
            // type: 'default'
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
