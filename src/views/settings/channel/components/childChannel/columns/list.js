/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:13:34
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-29 19:33:43
 */
export default [
  {
    prop: 'id',
    label: '接口调用',
    align: 'center'
    // width: 180
  },
  {
    prop: 'cpSource',
    label: '投诉途径',
    align: 'center'
    // width: 180
  },
  {
    action: true,
    name: 'status',
    prop: 'status',
    label: '状态',
    align: 'center'
    // width: 180
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    label: '操作',
    align: 'center',
    width: 280
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
      return [
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
                label: '编辑',
                attr: {
                  command: 'editChannelType',
                  icon: 'el-icon-edit'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
