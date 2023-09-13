export const channelTypeList = [
    {
        label: '小熊课程订单',
        value: '0',
        key: 'BearList'
    }, {
        label: '1对1课程订单',
        value: '1',
        key: 'User1V1List'
    }, {
        label: '奖励订单',
        value: '2',
        key: 'AwardList'
    }, {
        label: '退费订单',
        value: '3',
        key: 'ReturnList'
    }, {
        label: '积分商城',
        value: '4',
        key: 'IntegralList'
    }
]
export const regtypeMap = {
    0: '默认',
    1: '体验',
    2: '首单',
    3: '续费',
    4: '宝石兑换',
    5: '积分兑换',
    6: '赠送',
    7: '素质课-星球课程',
    8: '兑换',
    9: '营销活动',
    10: '新签补差',
    11: '续费补差',
    12: '主题课',
    13: '特价课',
    14: '训练营',
    15: '单周体验课',
    16: '音乐专属,单独购买优惠券',
    17: '音乐专属,音乐乐器',
    18: '美术代售音乐体验课',
    19: '预售优惠券',
    20: '美育主题课',
    21: '积分活动（夺宝）',
    22: '写字专项扩展课、舞蹈精品课、音乐（钢琴，声乐，电鼓）',
    23: '0转低 分销课',
    24: '0转低 裂变课',
    25: '手工课',
    26: '随材售卖（只出售商品，没有课程）',
    27: '赠送给其他用户的课程（系统课、手工课）',
    28: '电商',
    29: '零售',
    30: '转介绍',
    31: '美育课',
    32: '积分活动（抽奖）',
    33: '体验课2（软笔书法课）',
    34: '展馆主题课)'
}
export const subjectMap = {
    0: '美术',
    1: '写字',
    3: '音乐',
    5: '舞蹈',
    6: '手工'
}
export const statusMap = {
    0: '关闭',
    1: '已完成',
    4: '已退费',
    CREATE: '创建、待支付',
    COMPLETE: '已完成',
    PART_REFUND: '部分退款',
    REFUND: '全部退款',
    REFUND_ERROR: '退款失败',
    REFUNDING: '退款中'
}
export const typeMap = {
    1: '课时费用',
    2: '考级费用'
}
export const refundwayMap = {
    1: '银行转账',
    2: '原路退回',
    3: 'PayPal',
    4: '原路退回+银行转账',
    5: '原路退回+PayPal',
    7: '花呗分期'
}
export const statMap = {
    0: '待发起人处理',
    1: '待挽单审核',
    2: '待经理审核',
    3: '待财务审核',
    4: '正在退款',
    14: '待区长审核',
    11: '待质检审核',
    12: '等待银行回执',
    '-1': '退费取消',
    5: '退费已完成',
    6: '退费已完成',
    7: '退费已完成',
    10: '退费已完成'
}
export const one_v1_regtypeMap = {
    1: '新报',
    2: '续费',
    3: '奖励',
    4: '学杂费',
    5: '定金',
    6: '补差',
    7: '补差续费'
}
export const classPackageTypeMap = {
    0: '未选择',
    1: '强化包',
    2: '畅享'
}
export const billStatusMap = {
    0: '未开票',
    1: '已申请',
    2: '已开票'
}
export const orderStatusMap = {
    0: '已关闭',
    1: '待支付',
    2: '部分支付',
    3: '已完成',
    4: '已退费',
    5: '退费中'
}
export const goodsTypeMap = {
    INKIND: '实物',
    CARD_CODE: '卡密',
    ACTIVITY: '活动',
    CLASS: '课时',
    CASH: '现金',
    CURRICULUM: '虚拟权益',
    THIRD_COURSE: '轻课程'
}
export const paymentTypeMap = {
    CLASS: '课时',
    COIN: '金币',
    CASH: '现金',
    COINANDCASH: '金币 + 人民币',
    DIAMONDS: '钻石'
  }
export const paymentMethodMap = {
    AliPayH5: '支付宝',
    WxH5: '微信'
}
export const expressStatusMap = {
    NOCHECK: '待审核目前未使用',
    DAIFAHUO: '待发货',
    YIFAHUO: '已发货',
    FAIL: '推送中台创建物流失败',
    QIANSHOU: '已签收',
    INVALID: '无效',
    BACKOUT: '物流已撤回'
}
