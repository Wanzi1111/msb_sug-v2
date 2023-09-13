/**
 * @author: hzf
 * @description:
 * @date: 2020/7/21
 */

import ChildRule from '../components/ChildRule'

export default [
  {
    align: 'center',
    type: 'expand',
    render: (h, dat, row) => {
      return h(ChildRule, {
        props: { row }
      })
    }
  },
  {
    label: '规则组名',
    slot: 'groupName'
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
    width: 280,
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
          label: row.status ? '启用中' : '已停用',
          attr: {
            type: row.status ? 'success' : 'info'
          }
        }
      ]
    },
    action: (dat, row, index) => {
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
            item: [
              {
                label: '编辑',
                attr: {
                  command: 'editRuleGroup'
                }
              },
              {
                label: '添加路由',
                attr: {
                  command: 'addRoute'
                }
              },
              {
                label: row.status ? '设为停用' : '设为启用',
                attr: {
                  command: row.status ? 'setStop' : 'setStart'
                }
              },
              {
                label: '上移',
                attr: {
                  command: 'setRuleGroupUp'
                }
              },
              {
                label: '下移',
                attr: {
                  command: 'setRuleGroupDown'
                }
              }
            ]
          }
        }
      ]
    }
  }
}

