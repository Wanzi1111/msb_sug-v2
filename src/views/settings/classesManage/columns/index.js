import moment from 'moment'
export default [
  {
    prop: 'schedulingName',
    label: '班次',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'time',
    label: '上班时间',
    slot: 'time',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'staffName',
    label: '操作人',
    minWidth: 130,
    align: 'center'
  },
  {
    prop: 'ctime',
    label: '操作时间',
    slot: 'ctime',
    minWidth: 140,
    align: 'center',
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    action: true,
    name: 'action',
    width: 130,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]

export const tableAction = ({ deleteRow, editRow }) => ({
  action: (dat, row, index) => {
    return [
      // {
      //   type: 'button',
      //   label: '编辑',
      //   click: (dat, row) => editRow(row),
      //   attr: {
      //     type: 'text',
      //     size: 'mini'
      //   }
      // },
      {
        type: 'button',
        label: '删除',
        click: (dat, row) => deleteRow(row),
        attr: {
          type: 'text',
          size: 'mini'
        }
      }
    ]
  }
})

