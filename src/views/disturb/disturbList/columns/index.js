
export default [
  {
    prop: 'areaCode',
    label: '区号',
    align: 'left',
    width: 50
  },
  {
    prop: 'disturbMobile',
    slot: 'disturbMobile',
    label: '手机号',
    align: 'left',
    width: 160
  },
  {
    prop: 'listType',
    slot: 'listType',
    label: '勿扰标签',
    align: 'left',
    width: 180
  },
  {
    prop: 'remark',
    slot: 'remark',
    label: '原因备注',
    align: 'left',
    minWidth: 250
  },
  {
    prop: 'enjoinTime',
    slot: 'enjoinTime',
    label: '加入时间',
    align: 'left',
    minWidth: 200
  },
  {
    prop: 'entryUser',
    slot: 'entryUser',
    label: '操作人',
    align: 'left',
    minWidth: 140
  },
  {
    action: true,
    name: 'action',
    width: 140,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]

export const actions = ({ removeblacklist }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '移出勿扰',
          click: (dat, row, index) => removeblacklist(dat, row, index),
          attr: {
            size: 'mini',
            type: 'default'
          }
        }
      ]
    }
  }
}
