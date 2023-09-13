import {
  regtypeMap,
  subjectMap,
  statusMap,
  typeMap,
  refundwayMap,
  statMap,
  one_v1_regtypeMap,
  classPackageTypeMap,
  billStatusMap,
  orderStatusMap,
  paymentTypeMap,
  goodsTypeMap,
  paymentMethodMap,
  expressStatusMap
  } from '../config'
import moment from 'moment'
export const User1V1List = [
  {
    prop: 'buyId',
    label: '订单号',
    align: 'left'
  },
  {
    prop: 'orderType',
    label: '订单类型',
    align: 'left',
    render: (h, dat) => {
      return one_v1_regtypeMap[dat] || '-'
    }
  },
  {
    prop: 'classPackageType',
    label: '课时包类型',
    align: 'left',
    render: (h, dat) => {
      return classPackageTypeMap[dat] || '-'
    }
  },
  {
    prop: 'productInfo',
    label: '套餐信息',
    align: 'left',
    width: '150'
  },
  {
    prop: 'giftInfo',
    label: '赠品',
    align: 'left',
    width: '150'
  },
  {
    prop: 'courseTotal',
    label: '总共课时',
    align: 'left',
    render: (h, dat) => {
      return `${Number(dat) ? dat + '节' : '-'}`
    }
  },
  {
    prop: 'discount',
    label: '折扣',
    align: 'left',
    render: (h, dat) => {
      return `${Number(dat) ? dat + '折' : '-'}`
    }
  },
  {
    prop: 'amount',
    label: '价格',
    align: 'left',
    width: '150',
    render: (h, dat, row) => {
      const amounts = dat?.split(' ')
    return h('div', [
      h('div', `${amounts && amounts[0]}`),
      h('div', `${amounts && amounts[1]}`),
      h('div', `${amounts && amounts[2]}`)
    ])
    }
  },
  {
    prop: 'payTime',
    label: '支付时间',
    align: 'left',
    width: '150',
    render: (h, dat) => {
      return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
    }
  },
  {
    prop: 'creatTime',
    label: '创建时间',
    align: 'left',
    width: '150',
    render: (h, dat) => {
      return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
    }
  },
  {
    prop: 'validity',
    label: '订单有效期',
    align: 'left',
    render: (h, dat) => {
      return `${dat || '-'}个月`
    }
  },
  {
    prop: 'refundValidity',
    label: '有效退费期',
    align: 'left',
    render: (h, dat) => {
      return `${dat || '-'}天`
    }
  },
  {
    prop: 'creater',
    label: '创建人',
    align: 'left'
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
    align: 'left',
    render: (h, dat) => {
      return orderStatusMap[dat] || '-'
    }
  },
  {
    prop: 'billStatus',
    label: '开票状态',
    align: 'left',
    render: (h, dat) => {
      return billStatusMap[dat] || '-'
    }
  },
  {
    prop: 'action',
    name: 'action',
    slot: 'action',
    width: 200,
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const BearList = [
    {
      prop: 'subject',
      label: '所属科目',
      align: 'left',
      render: (h, dat) => {
        return subjectMap[dat] || '-'
      }
    },
    {
      prop: 'regtype',
      label: '订单类型',
      align: 'left',
      render: (h, dat) => {
        return regtypeMap[dat] || '-'
      }
    },
    {
      prop: 'ctime',
      label: '下单时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'packages_name',
      label: '商品信息',
      align: 'left',
      width: '150',
      render: (h, dat, row) => {
      return h('div', [
        h('div', `${row.packages_name}`),
        h('div', `套餐价格:${row.total_amount}人民币`)
      ])
      }
    },
    {
      prop: 'amount',
      label: '实付信息',
      align: 'left',
      width: '170',
      render: (h, dat, row) => {
      return h('div', [
        h('div', `优惠劵:${row.discount_amount}元`),
        h('div', `实付金额:${row.amount}人民币`)
      ])
      }
    },
    {
      prop: 'packages_course_day',
      label: '课程信息',
      align: 'left',
      width: '170',
      render: (h, dat, row) => {
        // 体验课 1、15=天
        // 系统课 周
      let type = ''
      if ([1, 15].includes(+row?.regtype)) { // 体验课区分单双周
        if (+row.packages_course_day === 0) { // 天数没有就是周
          type = '周'
        } else {
          type = '天'
        }
      } else { // 系统课
         type = '周'
      }
      return h('div', [
        h('div', `购买${type}数: ${type === '周' ? row.packages_course_week : row.packages_course_day}${type}`),
        h('div', `剩余${type}数: ${row.remaining_week}${type}`)
      ])
      }
    },
    {
      prop: 'period_name',
      label: '购买期数',
      align: 'left',
      width: '170',
      render: (h, dat, row) => {
      return h('div', [
        h('div', `购买期数:${row.period_name}`),
        h('div', `购买级别:${row.sup_text}`),
        h('div', `支付方式:${row.trade_type_text}`),
        h('div', `购课方式:${row.client_from}`),
        h('div', `订单状态:${row.order_status}`)
      ])
      }
    },
    {
      prop: 'channel_outer_name',
      label: '渠道信息',
      align: 'left',
      width: '170',
      render: (h, dat, row) => {
      return h('div', [
        h('div', `渠道: ${dat}`),
        h('div', { style: { color: 'red' }}, `渠道说明: -`),
        h('div', `推荐人: -`),
        h('div', `赠课人: -`)
      ])
      }
    },
    {
      prop: 'promotionsList',
      slot: 'promotionsList',
      label: '赠品信息',
      align: 'left',
      width: '200'
    },
    {
      prop: 'express_total',
      slot: 'express_total',
      label: '随材物流',
      align: 'left'
    },
    {
      prop: 'out_trade_no',
      label: '订单号',
      align: 'left',
      width: '180'
    },
    {
      prop: 'invoice_status_text',
      label: '开票状态',
      align: 'left'
    },
    {
      prop: 'rmbRefundStatusText',
      label: '退费状态',
      align: 'left'
    },
    {
      prop: 'action',
      name: 'action',
      slot: 'action',
      width: 200,
      label: '操作',
      align: 'center',
      fixed: 'right'
    }
]
export const AwardList = [
    {
      prop: 'id',
      label: '订单ID',
      align: 'left'
    },
    {
      prop: 'type',
      label: '订单类型',
      align: 'left',
      render: (h, dat) => {
        return '奖励订单'
      }
    },
    {
      prop: 'name',
      label: '交易类型',
      align: 'left'
    },
    {
      prop: 'append',
      label: '赠送课时',
      align: 'left',
      render: (h, dat, row) => {
        return `${row.append ? row.append + '节(1v1课时)' : row.appendv6 + '节(小班课课时)'}`
      }
    },
    {
      prop: 'optime',
      label: '报名时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'ctime',
      label: '创建时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'validity',
      label: '课时有效期',
      align: 'left',
      render: (h, dat) => {
        return `${dat}天`
      }
    },
    {
      prop: 'creater',
      label: '创建人',
      align: 'left'
    },
    {
      prop: 'status',
      label: '订单状态',
      align: 'left',
      render: (h, dat) => {
        return statusMap[dat] || '-'
      }
    }
]
export const ReturnList = [
    {
      prop: 'id',
      label: '退费单号',
      align: 'left'
    },
    {
      prop: 'type',
      label: '退费类型',
      align: 'left',
      render: (h, dat) => {
        return typeMap[dat] || '-'
      }
    },
    {
      prop: 'orderId',
      label: '关联缴费订单',
      align: 'left'
    },
    {
      prop: 'lessonNum',
      label: '退费课时',
      align: 'left',
      render: (h, dat) => {
        return `${Number(dat) ? dat + '节' : '-'}`
      }
    },
    {
      prop: 'money',
      label: '退费金额',
      align: 'left',
      render: (h, dat) => {
        return `${Number(dat) ? dat + '元' : '-'}`
      }
    },
    {
      prop: 'refundWays',
      label: '退费途径',
      align: 'left',
      render: (h, dat) => {
        return refundwayMap[dat] || '-'
      }
    },
    {
      prop: 'applyName',
      label: '退费申请人',
      align: 'left'
    },
    {
      prop: 'applytime',
      label: '退费申请时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'refundtime',
      label: '退费完成时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'stat',
      label: '退费状态',
      align: 'left',
      render: (h, dat) => {
        return statMap[dat] || '-'
      }
    },
    {
      prop: 'reason',
      label: '退费原因',
      align: 'left'
    },
    {
      prop: 'reasontypeRemrak',
      label: '退费备注',
      align: 'left'
    }
]
export const IntegralList = [
    {
      prop: 'outTradeNo',
      label: '订单ID',
      align: 'left'
    },
    {
      prop: 'goodsName',
      label: '商品名称',
      align: 'left'
    },
    {
      prop: 'goodsEpc',
      label: '商品编码',
      align: 'left'
    },
    {
      prop: 'goodsType',
      label: '商品类型',
      align: 'left',
      render: (h, dat) => {
        return goodsTypeMap[dat] || '-'
      }
    },
    {
      prop: 'ctime',
      label: '下单时间',
      align: 'left',
      width: '150',
      render: (h, dat) => {
        return Number(dat) && moment(Number(dat)).format('YYYY-MM-DD HH:mm:ss') || '-'
      }
    },
    {
      prop: 'paymentType',
      label: '支付方式',
      align: 'left',
      render: (h, dat, row) => {
        return `${ dat === 'CASH' ? paymentMethodMap[row.cashType] : dat === 'COINANDCASH' ? '金币' + paymentMethodMap[row.cashType] : paymentTypeMap[dat] }` || '-'
      }
    },
    {
      prop: 'rmbAmount',
      slot: 'rmbAmount',
      label: '消耗',
      align: 'left',
      width: '170'
    },
    {
      prop: 'status',
      label: '订单状态',
      align: 'left',
      render: (h, dat) => {
        return statusMap[dat] || '-'
      }
    },
    {
      prop: 'expressStatus',
      label: '物流状态',
      align: 'left',
      render: (h, dat) => {
        return expressStatusMap[dat] || '-'
      }
    },
    {
      prop: 'action',
      name: 'action',
      slot: 'action',
      width: 200,
      label: '操作',
      align: 'center',
      fixed: 'right'
    }
]
