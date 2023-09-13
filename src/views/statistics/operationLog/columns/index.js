import moment from 'moment'
export default [
  {
    prop: 'operationPidName',
    label: '功能模块',
    minWidth: 120,
    align: 'left'
  },
  {
    prop: 'operationIdName',
    label: '操作',
    minWidth: 120,
    align: 'left'
  },
  {
    prop: 'operationComent',
    label: '备注',
    slot: 'course',
    minWidth: 230,
    align: 'left'
  },
  {
    prop: 'ctime',
    label: '时间',
    slot: 'mony',
    minWidth: 140,
    align: 'left',
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'currentStaffName',
    label: '操作人',
    minWidth: 80,
    align: 'left'
  },
  {
    prop: 'currentStaffMobile',
    label: '操作人手机号',
    minWidth: 120,
    align: 'left'
  }
]

