import childQuestion from '../components/childQuestion'
export default [
  {
    type: 'expand',
    align: 'center',
    render: (h, dat, row) => {
      return h(childQuestion, {
        props: { row }
      })
    }
  },
  {
    prop: 'problemIdNew',
    label: '序号',
    align: 'center',
    width: 140
  },
  {
    prop: 'cpType',
    label: '问题类型',
    align: 'center',
    minWidth: 280
  },
  {
    prop: 'channelName',
    label: '投诉来源',
    align: 'center',
    width: 180
  },
  {
    prop: 'cpProblemRemark',
    label: '问题备注',
    align: 'center',
    width: 180
  },
  {
    action: true,
    label: '状态',
    name: 'status',
    prop: 'status',
    align: 'center',
    width: 280
  },
  {
    action: true,
    name: 'action',
    width: 200,
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
          label: row.problemStatus === 0 ? '启用中' : '已停用',
          attr: {
            type: row.problemStatus === 0 ? 'success' : 'info'
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
          label: '添加投诉问题',
          attr: {
            command: 'addComplintQuestion',
            icon: 'el-icon-plus'
          }
        }
      ]
      return [
        // {
        //   type: 'button',
        //   label: '立即处理',
        //   click: (dat, row, index) => tableAction(dat, row, index, 'doItNow'),
        //   attr: {
        //     // disabled: !![3, 4, 6].includes(row.cpStatus),
        //     size: 'mini',
        //     icon: 'el-icon-s-operation',
        //     type: 'default'
        //   }
        // },
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
