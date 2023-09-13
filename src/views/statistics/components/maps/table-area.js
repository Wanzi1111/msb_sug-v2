const options_1 = [
  {
    label: '班主任-大区',
    value: 4
  },
  {
    label: '班主任-部',
    value: 5
  },
  {
    label: '班主任-班',
    value: 6
  }
]
const options_2 = [
  {
    label: '汇总',
    value: 7
  }
]
const options_3 = [
  {
    label: '体验课-战队',
    value: 9
  },
  {
    label: '系统课-战队',
    value: 10
  }
]
const options_4 = [
  {
    label: '全部',
    value: 11
  }
]
export const radioMap = new Map()
radioMap.set(1011, options_1)
radioMap.set(1012, options_2)
radioMap.set(1021, options_4)
radioMap.set(1022, options_4)
radioMap.set(1031, options_3)
radioMap.set(1041, options_3)
radioMap.set(1051, options_3)
radioMap.set(1071, options_3)

const columns_1 = [
  {
    label: '',
    prop: 'areaName'
  },
  {
    label: '投诉总量',
    prop: 'total'
  },
  {
    label: '销售（课程顾问）',
    prop: 'problemOne'
  },
  {
    label: '班主任问题',
    prop: 'problemTwo'
  },
  {
    label: '老师问题',
    prop: 'problemThree'
  },
  {
    label: '课程内容问题',
    prop: 'problemFour'
  },
  {
    label: '费用问题',
    prop: 'problemFive'
  },
  {
    label: '赠品问题',
    prop: 'problemSix'
  },
  {
    label: '其他问题',
    prop: 'problemSeven'
  }
]
const columns_2 = [
  {
    label: '',
    prop: 'areaName'
  },
  {
    label: '投诉总量',
    prop: 'total'
  },
  {
    label: '销售（课程顾问）',
    prop: 'problemOne'
  },
  {
    label: '班主任问题',
    prop: 'problemTwo'
  },
  {
    label: '教管问题',
    prop: 'problemThree'
  },
  {
    label: '课程内容问题',
    prop: 'problemFour'
  },
  {
    label: '上课设备问题',
    prop: 'problemFive'
  },
  {
    label: '培训考核问题',
    prop: 'problemSix'
  },
  {
    label: '其他问题',
    prop: 'problemSeven'
  }
]
const columns_3 = [
  {
    label: '',
    prop: 'areaName'
  },
  {
    label: '投诉总量',
    prop: 'total'
  },
  {
    label: '销售（课程顾问）',
    prop: 'problemOne'
  },
  {
    label: '班主任问题',
    prop: 'problemTwo'
  },
  {
    label: '老师问题',
    prop: 'problemThree'
  },
  {
    label: '课程内容问题',
    prop: 'problemFour'
  },
  {
    label: '费用问题',
    prop: 'problemFive'
  },
  {
    label: '赠品问题',
    prop: 'problemSix'
  },
  {
    label: '其他问题',
    prop: 'problemSeven'
  }
]
const columns_4 = [
  {
    label: '',
    prop: 'areaName'
  },
  {
    label: '投诉总量',
    prop: 'total'
  },
  {
    label: '销售（课程顾问）',
    prop: 'problemOne'
  },
  {
    label: '班主任问题',
    prop: 'problemTwo'
  },
  {
    label: '教管问题',
    prop: 'problemThree'
  },
  {
    label: '课程内容问题',
    prop: 'problemFour'
  },
  {
    label: '上课设备问题',
    prop: 'problemFive'
  },
  {
    label: '培训考核问题',
    prop: 'problemSix'
  },
  {
    label: '其他问题',
    prop: 'problemSeven'
  }
]
const columns_5 = [
  {
    label: '',
    prop: 'areaName'
  },
  {
    label: '投诉总量',
    prop: 'total'
  },
  {
    label: '辅导老师（体验课）',
    prop: 'problemOne'
  },
  {
    label: '辅导老师（系统课）',
    prop: 'problemTwo'
  },
  {
    label: '课程内容问题',
    prop: 'problemThree'
  },
  {
    label: '赠品问题',
    prop: 'problemFour'
  },
  {
    label: '其他问题',
    prop: 'problemFive'
  }
]

export const columnMap = new Map()
columnMap.set(1011, columns_1)
columnMap.set(1012, columns_2)
columnMap.set(1021, columns_3)
columnMap.set(1022, columns_4)
columnMap.set(1031, columns_5)
columnMap.set(1041, columns_5)
columnMap.set(1051, columns_5)
columnMap.set(1071, columns_5)
columnMap.set(1081, columns_5)

export const typeMap = new Map()
typeMap.set('课程顾问-大区', 1)
typeMap.set('课程顾问-部', 2)
typeMap.set('课程顾问-战队', 3)
typeMap.set('班主任-大区', 4)
typeMap.set('班主任-部', 5)
typeMap.set('班主任-班', 6)
typeMap.set('教管-校区', 7)
typeMap.set('教管-大区', 8)
typeMap.set('体验课-战队', 9)
typeMap.set('系统课-战队', 10)
typeMap.set('全部', 11)
