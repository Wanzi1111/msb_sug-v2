import childProblem from '../tableChild/problem-child'
export default [
  {
    type: 'expand',
    align: 'center',
    render: (h, dat, row) => {
      console.log('执行了几次')
      return h(childProblem, {
        props: { row }
      })
    }
  },
  {
    prop: 'problemIdNew',
    label: '问题序号',
    align: 'center'
    // fixed: true,
    // width: 140
  },
  {
    prop: 'problemName',
    label: '问题类型',
    align: 'center'
    // fixed: true,
    // width: 180
  },
  {
    prop: 'problemCount',
    label: '问题数量',
    align: 'center'
    // fixed: true,
    // width: 180
  },
  {
    prop: 'problemRate',
    label: '问题占比',
    align: 'center'
    // fixed: true,
    // width: 180
  }
  // {
  //   action: true,
  //   label: '状态',
  //   name: 'status',
  //   prop: 'status',
  //   align: 'center'
  //   // fixed: true,
  //   // width: 140
  // },
  // {
  //   action: true,
  //   name: 'action',
  //   width: 280,
  //   prop: 'action',
  //   label: '操作',
  //   align: 'center'
  // }
]
