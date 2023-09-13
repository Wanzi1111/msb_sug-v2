// const { channelList, allCallStatusList } = window.baseData

const searchs = [
  {
    prop: 'callUserIntention',
    label: '用户意向',
    type: 'select',
    attr: {
      size: 'small',
      placeholder: '全部',
      clearable: true
    },
    options: []
  },
  {
    prop: 'callStatus',
    label: '通话状态',
    type: 'select',
    attr: {
      size: 'small',
      placeholder: '全部',
      clearable: true
    },
    options: []
  },
  {
    prop: 'userId',
    label: '用户ID',
    type: 'input',
    visible: true,
    attr: {
      size: 'small',
      placeholder: '请输入用户ID'
    }
  },
  {
    prop: 'complaintNo',
    label: '投诉单号',
    type: 'input',
    visible: true,
    attr: {
      size: 'small',
      placeholder: '请输入投诉单号'
    }
  },
  {
    prop: 'staffName',
    label: '操作人',
    type: 'input',
    visible: true,
    attr: {
      size: 'small',
      placeholder: '请输入操作人'
    }
  }
]

export default searchs

