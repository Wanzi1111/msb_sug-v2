/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */

import moment from 'moment'

export default [
  {
    prop: 'userId',
    label: '用户ID',
    align: 'center',
    minWidth: 100,
    fixed: true
  },
  // {
  //   prop: 'nickName',
  //   label: '用户昵称',
  //   align: 'center',
  //   minWidth: 100
  // },
  // {
  //   prop: 'sex',
  //   label: '性别',
  //   align: 'center',
  //   render: (h, dat) => {
  //     return ['未知', '男', '女'][dat]
  //   }
  // },
  // {
  //   prop: 'teacher',
  //   label: '班主任',
  //   align: 'center'
  // },
  // {
  //   prop: 'groupName',
  //   label: '组别',
  //   align: 'center',
  //   minWidth: 60
  // },
  // {
  //   prop: 'region',
  //   label: '大区',
  //   align: 'center',
  //   minWidth: 100
  // },
  {
    prop: 'prizeType',
    label: '奖品类型',
    align: 'center',
    render: (h, dat) => {
      return ['', '试听奖励', '分享海报奖励', '排行榜奖励', '月度转介绍活动'][dat]
    }
  },
  {
    prop: 'awardTime',
    label: '领奖时间',
    minWidth: 110,
    align: 'center',
    render: (h, dat) => {
      return dat && dat !== '0' ? moment(parseInt(dat)).format('YYYY-MM-DD') : ''
    }
  },
  {
    prop: 'prizeMonth',
    label: '获奖时间',
    align: 'center'
  },
  {
    prop: 'prizeName',
    label: '奖品名称',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'receiverName',
    label: '收货人姓名',
    minWidth: 120,
    align: 'center'
  },
  {
    prop: 'receiverMobile',
    label: '联系电话',
    align: 'center'
  },
  {
    prop: 'receiverProvince',
    label: '邮寄地址',
    showOverflowTooltip: true,
    align: 'center',
    minWidth: 180,
    render: (h, dat, row) => {
      return `${row.receiverProvince}${row.receiverCity}${row.receiverArea}${row.receiverAddress}`
    }
  },
  {
    prop: 'requestId',
    label: '订单号',
    align: 'center',
    minWidth: 180
  },
  {
    prop: 'expressCompany',
    label: '快递公司',
    align: 'center'
  },
  {
    prop: 'expressNumber',
    label: '快递单号',
    align: 'center'
  },
  {
    prop: 'action',
    label: '操作',
    action: true,
    minWidth: 100,
    align: 'center',
    name: 'action'
  }
]

export const actions = ({ view }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '详情',
          click: () => view(row.id),
          attr: {
            // type: 'primary',
            // plain: true,
            size: 'mini',
            icon: 'el-icon-view'
          }
        }
      ]
    }
  }
}
