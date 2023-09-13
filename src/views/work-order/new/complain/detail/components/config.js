import moment from 'moment'
// 判断时间显示
const fnTime = (val) => {
    return moment(val).valueOf() > 0 ? val : ''
}
// 仅退款-系统自动退款
const automaticRefund = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '处理中',
        description: '',
        icon: 'el-icon-edit'
    }, {
        title: '退款完成',
        description: fnTime(data.completeTime),
        icon: 'el-icon-circle-check'
    }
]
}
// 仅退款-不拦截物流
const noInterceLogistics = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '客服审核',
        description: fnTime(data.customerApproveTime),
        icon: 'el-icon-service'
    }, {
        title: '退款完成',
        description: data.completeTime,
        icon: 'el-icon-circle-check'
    }
]
}
// 仅退款-拦截物流
const interceLogistics = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '客服审核',
        description: fnTime(data.customerApproveTime),
        icon: 'el-icon-service'
    }, {
        title: '供应链审核',
        description: `${fnTime(data.estimateCancelTime) ? '预计' + fnTime(data.estimateCancelTime) + '系统自动取消' : ''}`,
        icon: 'el-icon-s-check',
        csstyle: 'afterSaleStyle'
    }, {
        title: '退款完成',
        description: fnTime(data.completeTime),
        icon: 'el-icon-circle-check'
    }
]
}
// 退货退款
const returnMoney = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '客服审核',
        description: fnTime(data.customerApproveTime),
        icon: 'el-icon-service'
    }, {
        title: '待回填单号',
        description: `${fnTime(data.estimateCancelTime) ? '预计' + fnTime(data.estimateCancelTime) + '系统自动取消' : ''}`,
        icon: 'el-icon-edit',
        csstyle: 'afterSaleStyle'
    }, {
        title: '供应链审核',
        description: fnTime(data.logisticsApproveTime),
        icon: 'el-icon-s-check'
    }, {
        title: '退款完成',
        description: fnTime(data.completeTime),
        icon: 'el-icon-circle-check'
    }
]
}
// 换货
const exchangeGoods = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '客服审核',
        description: fnTime(data.customerApproveTime),
        icon: 'el-icon-service'
    }, {
        title: '待回填单号',
        description: `${fnTime(data.estimateCancelTime) ? '预计' + fnTime(data.estimateCancelTime) + '系统自动取消' : ''}`,
        icon: 'el-icon-edit',
        csstyle: 'afterSaleStyle'
    }, {
        title: '供应链审核',
        description: fnTime(data.logisticsApproveTime),
        icon: 'el-icon-s-check'
    }, {
        title: '供应链发货',
        description: fnTime(data.logisticsDeliveredTime),
        icon: 'el-icon-sell'
    }, {
        title: '已完成',
        description: '',
        icon: 'el-icon-circle-check'
    }
]
}
// 补发
const replenishDispatch = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '客服审核',
        description: fnTime(data.customerApproveTime),
        icon: 'el-icon-service'
    }, {
        title: '供应链审核',
        description: fnTime(data.logisticsApproveTime),
        icon: 'el-icon-s-check'
    }, {
        title: '供应链发货',
        description: fnTime(data.logisticsDeliveredTime),
        icon: 'el-icon-sell'
    }, {
        title: '已完成',
        description: '',
        icon: 'el-icon-circle-check'
    }
]
}
// 用户取消  回填单号超时
const userCancel = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '售后取消',
        description: fnTime(data.cancelTime),
        icon: 'el-icon-circle-check'
    }
]
}
// 客服拒绝
const serviceCancel = (data) => {
    return [
    {
        title: '发起新售后',
        description: fnTime(data.afterSaleCtime),
        icon: 'el-icon-document'
    }, {
        title: '售后完成',
        description: fnTime(data.cancelTime),
        icon: 'el-icon-circle-check'
    }
]
}
// 售后方式
const asTypeNum = {
    'REFUND': 0,
    'REFUND_RETURN': 1,
    'EXCHANGE_GOODS': 2,
    'REPLENISHMENT': 3,
    'AFTER_SALE': 4
}
const asTypeData = {
    'REFUND': '仅退款',
    'REFUND_RETURN': '退货退款',
    'EXCHANGE_GOODS': '换货',
    'REPLENISHMENT': '补发',
    'AFTER_SALE': '申请售后'
}

export {
  automaticRefund,
  noInterceLogistics,
  interceLogistics,
  returnMoney,
  exchangeGoods,
  replenishDispatch,
  userCancel,
  serviceCancel,
  asTypeNum,
  asTypeData
}
