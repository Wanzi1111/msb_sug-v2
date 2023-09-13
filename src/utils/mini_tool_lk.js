import moment from 'moment'
  export const productVersion = [
    { name: '退款', value: 'REFUND' },
    { name: '商城物流撤单', value: 'BEAR_GOLD_COIN' },
    { name: '补发货', value: 'REISSUE' },
    { name: '体验课调级', value: 'ADJUSTMENT_SUP_TRIAL' },
    { name: '调期申请', value: 'ADJUSTMENT_STAGE' },
    { name: '调难度申请', value: 'ADJUSTMENT_SUP' },
    { name: '调级别申请', value: 'ADJUSTMENT_LEVEL' },
    { name: '调班申请', value: 'ADJUSTMENT_CLASS' },
    { name: '赠品', value: 'PROMOTIONS' },
    { name: '随材打包', value: 'PACKAGE_BOX' },
    { name: '无归属订单审批', value: 'UNCREDITED' },
    { name: '续费调班', value: 'ADJUSTMENT_RENEW' },
    { name: '学员转班', value: 'CHANGE_CUSTOMER' },
    { name: '判单审批', value: 'JUDGMENT_PAY_TEACHER_ONLINE' },
    { name: '订单转入', value: 'CHANGE_CUSTOMER_IMPORT' }
  ]

  export const rainbowFart = {
    ADJUSTMENT_SUP_TRIAL: 'trialChangeLevelDrawer', // 体验课调级
    REISSUE: 'repairDrawer', // 补发货详情
    UNCREDITED: 'ownershipDrawer', // 无归属订单详情
    BEAR_GOLD_COIN: 'aftermarketDrawer', // 商城物流撤单
    REFUND: 'refundDrawer', // 退款详情
    PROMOTIONS: 'giftDrawer', // 赠品详情
    ADJUSTMENT_STAGE: 'periodDrawer', // 调期申请
    ADJUSTMENT_SUP: 'supDrawer', // 调难度申请
    ADJUSTMENT_LEVEL: 'levelDrawer', // 调级别申请
    ADJUSTMENT_CLASS: 'classDrawer', // 调班申请
    ADJUSTMENT_RENEW: 'renewClassDrawer', // 续费调班申请
    PACKAGE_BOX: 'packageDrawer', // 随材打包
    CHANGE_CUSTOMER: 'reverseConceptDrawer', // 学员转班
    JUDGMENT_PAY_TEACHER_ONLINE: 'documentApprovalDrawer', // 判单审批
    CHANGE_CUSTOMER_IMPORT: 'entryOrderDrawer' // 订单转入审批
  }

export const expressStatusObj = {
  DELIVERY_READY: '待发货',
  DELIVERY_START: '已发货',
  DELIVER_SING: '已签收',
  DELIVERY_REFUSE: '退签',
  DELIVER_RETREAT: '退回',
  DELIVER_WAIT_CONFIRM: '待确认发货',
  INVALID: '无效',
  PUZZLE: '疑难',
  PAUSE: '退款申请通过-导致物流暂定'
}

export const rainbow = {
  ALI_PRM: '支付宝小程序',
  JSAPI: '微信内部支付',
  APP: '微信APP支付',
  MWEB: '微信H5支付',
  WAP: '支付宝H5支付',
  WAPIOS: '支付宝H5支付',
  ZAPP: '支付宝APP支付',
  APPLE: '苹果支付',
  IMPORT: '第三方订单支付',
  LINK: '第三方API对接',
  '': '微信',
  Paypal: 'Paypal',
  StripeH5: 'Stripe',
  WAP_HUABEI_FEN: '支付宝h5花呗分期',
  WAPIOS_HUABEI_FEN: '支付宝ios花呗分期',
  ZAPP_HUABEI_FEN: '支付宝app花呗分期',
  WX_JS: '微信公众号',
  WX_PRM: '微信小程序',
  FLOW_RECEIVE: '引流领取订单',
  STRIPE: 'Stripe海外h5支付',
  EMPTY: '微信',
  WAPP: '微信APP',
  DEFAULT: '默认',
  EXCHANGE: '兑换码'
}
  // 丐版-清除对象里的空值字段
  export function arrangeParams(data) {
    for (const item in data) {
      if (!data[item] && data[item] !== 0) {
        delete data[item]
      }
    }
    return data
  }

  export function formatDate(date1, ymd = true) {
    if (!date1 || date1 === '0') return '-'
    var date = new Date(+date1)
    var YY = date.getFullYear() + '-'
    var MM =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return ymd ? YY + MM + DD + ' ' + hh + mm + ss : hh + mm + ss
  }

  export const formatTime = function(millisecondsLk, day = true) {
    if (millisecondsLk < 0) {
      return '已超时'
    }
    const secondSub = (millisecondsLk / 1000) | 0 // 秒
    var days = day ? Math.floor(secondSub / (24 * 3600)) : '' // 天
    var leave1 = day ? secondSub % (24 * 3600) : secondSub // 除天后-剩余秒
    var hours = Math.floor(leave1 / 3600) // 时
    var leave2 = leave1 % 3600 // 除时后-剩余秒
    var minutes = Math.floor(leave2 / 60) // 分
    var leave3 = leave2 % 60 // 除分后-剩余秒
    var seconds = ~~leave3 // 秒
    return (
      (days ? days + '-' : '') +
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    )
  }

  // 前包后也包 max+1
  export function random({ min = 0, max = 100 } = {}) {
    return max - min < 0
      ? new Error('传值有误')
      : (Math.random() * (max + 1 - min) + min) | 0
  }

  // 模块间跳转-兼容dev test 多出来的 ai-app-vue-toss-dev
  // lope: eg '/users/#/details/581895583481274368'
  export function assertdt(lope) {
    const BOSS_HOST_XX = process.env.VUE_APP_XX_BOSS_HOST
    lope = BOSS_HOST_XX + lope
    return lope
  }
  // 节流 throttle(抢购按钮):狂触发该函数,每2秒执行1次(水龙头嘀嗒)
  export function throttle(fnsuc, rate, fnerr) {
    console.count('节流')
    let start = new Date()
    return function(b1) {
      if (new Date() - start > rate) {
        start = new Date()
        b1 === undefined ? fnsuc.call(this) : fnsuc.call(this, b1) // @click事件没传值undefined
      } else {
        fnerr.call(this)
      }
    }
  }

  // 防抖 debounce(实时搜索):狂触发该函数,只执行1次(最后那次,2秒后)
  export function debounce(fn, delay) {
    console.count('防抖')
    let timer = null
    return function() {
      clearTimeout(timer) // 设表先关--顶多清个寂寞
      timer = setTimeout(() => {
        fn.call(this)
      }, delay)
    }
  }
/**
 * 格式化时间戳
 * @str: 时间戳 @type: String 'd'：天 'm':分 's': 秒
 * 需要校验时间戳10位，新增第三个参数
 */
 export function formatData(str, type = 'd', strLength = '13') {
  if (!str || +str === 0) return ''
  let ft = 'YYYY-MM-DD'
  if (type !== 'd') {
    if (type === 'shortDay') {
      // 06-18 15:00
      ft = 'MM-DD HH:mm'
    } else {
      ft = type === 'm' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss'
    }
  }
  if (strLength === '13') {
    return moment.unix(Number(str) / 1000).format(ft)
  } else if (strLength === '10') {
    return moment.unix(Number(str)).format(ft)
  }
}
