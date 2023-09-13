export default [
  {
    type: 'selection',
    width: 80,
    align: 'center'
  },
  {
    width: 60,
    prop: 'id',
    label: '编号',
    fixed: true,
    align: 'center'
  },
  {
    width: 200,
    prop: 'content',
    label: '物料名称',
    align: 'center',
    fixed: true,
    showOverflowTooltip: true
  },
  {
    prop: 'author',
    label: '物料ID',
    align: 'center',
    render: (h, dat, row, index) => {
      if (dat === 'David') {
        return 'ddddddddddddd'
      } else if (dat === 'Mark') {
        return 'mmmmmmmmmmmm'
      } else {
        return dat
      }
    }
  },
  {
    prop: 'importance',
    label: '物料类型',
    align: 'center'
  },
  {
    prop: 'type',
    label: '上传时间',
    align: 'center'
  },
  {
    name: 'one',
    width: 200,
    align: 'center',
    prop: 'action',
    label: '操作',
    action: true
  }
]

export const actions = ({ ok }) => {
  return {
    one: [
      {
        type: 'button',
        click: ok,
        label: 'ok',
        attr: {
          size: 'mini',
          plain: true
        }
      },
      {
        type: 'button',
        click: ok,
        label: 'ok2',
        attr: {
          size: 'mini',
          plain: true
        }
      }
    ]
  }
}
