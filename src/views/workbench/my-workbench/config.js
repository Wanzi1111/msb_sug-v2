const TabListOne = [
  {
    label: '全部',
    value: '0',
    key: 'myAll'
  },
  {
    label: '分配给我的',
    value: '1',
    key: 'myDistribution'
  },
  {
    label: '我创建的',
    value: '2',
    key: 'myCreate'
  },
  {
    label: '我创建的已分配',
    value: '3',
    key: 'myCreateDistribution'
  }
]
const TabListTwo = [
  {
    label: '全部',
    value: '0',
    key: 'myAllChannel'
  },
  {
    label: '1v1用户',
    value: '1011',
    key: 'myOneToOne'
  },
  {
    label: '1v1老师',
    value: '1012',
    key: 'myOneToOneTeacher'
  },
  {
    label: '小班课用户',
    value: '1021',
    key: 'myXbkUser'
  },
  {
    label: '小班课老师',
    value: '1022',
    key: 'myXbkTeacher'
  },
  {
    label: '小熊用户',
    value: '1031',
    key: 'myBear'
  },
  {
    label: '书法用户',
    value: '1041',
    key: 'myWrite'
  },
  {
    label: '小熊音乐',
    value: '1051',
    key: 'myMusic'
  },
  {
    label: '书画院用户',
    value: '1061',
    key: 'myWriteArt'
  },
  {
    label: '小熊舞蹈用户',
    value: '1071',
    key: 'myDanceArt'
  },
  {
    label: '小熊手工',
    value: '1081',
    key: 'handWorkApp'
  },
  {
    label: '绘本创作',
    value: '2011',
    key: 'handCreation'
  }
]
const TaskStatusList = [
  {
    label: '待处理',
    value: '1',
    key: 'myNoHandle'
  },
  {
    label: '今日未跟进',
    value: '14',
    key: 'myTodayOverTime'
  },
  {
    label: '超48时未跟进',
    value: '15',
    key: 'myTwoDayOverTime'
  },
  {
    label: '超72时未关闭',
    value: '9',
    key: 'myOverTime'
  },
  {
    label: '处理中',
    value: '2',
    key: 'myHandle'
  },
  {
    label: '已转业务',
    value: '10',
    key: 'myTurnBusiness'
  },
  {
    label: '已转销售',
    value: '11',
    key: 'myTurnSale'
  },
  {
    label: '已转教管',
    value: '12',
    key: 'myTurnManage'
  },
  {
    label: '已转教辅',
    value: '13',
    key: 'myTurnAssits'
  },
  {
    label: '已关闭',
    value: '3',
    key: 'myClose'
  },
  {
    label: '已回访',
    value: '7',
    key: 'myReturn'
  },
  {
    label: '无效投诉',
    value: '6',
    key: 'myInvalid'
  }
]

const PriorityType = {
  '1': {
    color: 'danger', // 急
    id: 1,
    name: '急'
  },
  '2': {
    color: 'warning', // 高
    id: 2,
    name: '高'
  },
  '3': {
    color: '', // 中
    id: 3,
    name: '中'
  },
  '4': {
    color: 'success', // 低
    id: 4,
    name: '低'
  }
  // 5 普通
}

export {
  TabListOne,
  TabListTwo,
  TaskStatusList,
  PriorityType
}
