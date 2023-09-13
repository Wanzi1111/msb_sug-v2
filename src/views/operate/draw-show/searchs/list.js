/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

export default [
  {
    prop: 'author',
    label: '关键词',
    type: 'input',
    attr: {
      placeholder: '视频编号/作者(昵称、ID、手机号)'
    }
  },
  {
    prop: 'status',
    label: '视频状态',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      {
        label: '已上线', value: 2
      },
      {
        label: '已下线', value: 3
      },
      {
        label: '待审核', value: 1
      },
      {
        label: '已驳回', value: 0
      }
    ]
  },
  {
    prop: 'isRecommend',
    label: '首页展示',
    type: 'select',
    attr: {
      clearable: true,
      placeholder: '全部'
    },
    options: [
      {
        label: '展示', value: 1
      },
      {
        label: '不展示', value: 0
      }
    ]
  }
]

