/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:13:34
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:25:24
 */
import live4List from '../../../live4List/childQuestion'
export default [
  {
    type: 'expand',
    align: 'center',
    render: (h, dat, row) => {
      return h(live4List, {
        props: { row }
      })
    }
  },
  {
    prop: 'problemIdNew',
    label: '序号',
    align: 'center'
    // width: 180
  },
  {
    prop: 'cpType',
    label: '三级分类',
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
    align: 'center'
    // width: 180
  }
]

export const actions = ({ tableAction }) => {
  return {
    status: (dat, row, index) => {
      return [
        {
          type: 'tag',
          label: row.problemStatus === 0 ? '启用中' : '已停用',
          attr: {
            type: row.problemStatus === 0 ? 'success' : 'info'
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
                  command: 'editQuestionType',
                  icon: 'el-icon-edit'
                }
              },
              {
                label: '上移',
                attr: {
                  disabled: false,
                  command: 'setUp',
                  icon: 'el-icon-top'
                }
              },
              {
                label: '下移',
                attr: {
                  disabled: false,
                  command: 'setDown',
                  icon: 'el-icon-bottom'
                }
              },
              {
                label: row.problemStatus ? '设为启用' : '设为停用',
                attr: {
                  command: 'setStatus',
                  icon: 'el-icon-open'
                }
              },
              {
                label: '添加四级分类',
                attr: {
                  command: 'addComplintQuestion',
                  icon: 'el-icon-plus'
                }
              }
            ]
          }
        }
      ]
    }
  }
}
