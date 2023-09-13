/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 13:57:10
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-28 18:51:54
 */
export default [
  // {
  //   prop: 'businessId',
  //   label: '业务线',
  //   type: 'select', // 选择器,
  //   attr: {
  //     // clearable: true,
  //     size: 'small',
  //     placeholder: '全部'
  //   },
  //   options: []
  // },
  {
    prop: 'channelPid',
    label: '投诉来源',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      // multiple: true,
      collapseTags: true,
      placeholder: '全部'
    },
    options: [
      {
        value: '1011',
        label: '1v1用户'
      },
      {
        value: '1012',
        label: '1v1老师'
      },
      {
        value: '1021',
        label: '小班课用户'
      },
      {
        value: '1022',
        label: '小班课老师'
      },
      {
        value: '1031',
        label: '小熊用户'
      },
      {
        value: '1041',
        label: '书法用户'
      },
      {
        value: '1051',
        label: '小熊音乐'
      }
    ]
  }
]
