import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// 为了学员详情跳转来的审核页面，自动填入手机号-获取uid
export function getUid_lk(data) {
  return request({
    url: '/api_cs/graphql/user',
    method: 'post',
    data: { query: `{
      blurrySearch(query: ${JSON.stringify(JSON.stringify(data))}) {
          id
          mobile
          wechat_nikename
          last_team_id
        }
    }
  ` }
  })
}
// 通过uid查询订单list-美术退费、补发货专用
  export function getOrdersByUidRefundOnlyRefund(params) {
    return request({
      url: '/api_cs/api/o/v1/order/getOrderListByRegTypesAndStatues',
      method: 'get',
      params: params
    })
  }
  // 获取剩余金额
  export function getResidueFee(params) {
    return request({
      url: '/api_cs/api/o/v1/order/getOrderRemainingAmount',
      method: 'get',
      params: params
    })
  }
  // 获取订单id获取相关关单赠品
  export function getOrderproductList(params) {
    return request({
      url: '/api_cs/api/b/v1/backend/promotions/flow/productList',
      method: 'get',
      params: params
    })
  }
  // 获取国美考级信息
  export function getGmExamByUidAndOrderId(params) {
    return request({
      url: '/api_cs/api/s/v1/examChangeCode/getGmExamByUidAndOrderId',
      method: 'get',
      params: params
    })
  }
  // 我来查退款新规则
  export function getBackStatus(params) {
    return request({
      url: '/api_cs/api/o/v1/order/getOrderRefundStatus',
      method: 'get',
      params: params
    })
  }
  // 我来查系统课已上时长
  export function getPeriod(params) {
    return request({
      url: '/api_cs/api/b/v1/backend/refund/system/findSystemReduceWeek',
      method: 'get',
      params: params
    })
  }
  // 我来查支付渠道
export function getPaymentPay(data) {
  return request({
    url: '/api_cs/graphql/v1/toss',
    method: 'post',
    data: { query: `
    {
      PaymentPay(query: ${JSON.stringify(data)}
  ){
        oid
        trade_type
        status
        type
        packages_id
     }
    }
  ` }
  })
}
 // 获取第三方渠道来源
  export function getChannel(params) {
    return request({
      url: '/api_cs/api/c/v1/channel/getChannelById',
      method: 'get',
      params: params
    })
  }
  // 查询关联订单详情-优惠券类订单-退费专用
  export function queryUnionCouponOrderInfo(params) {
    return request({
      url: '/api_cs/api/o/v1/order/queryUnionCouponOrderInfo',
      method: 'get',
      params: params
    })
  }
  // 获取优惠券list
  export function getCoupon(params) {
    return request({
      url: '/api_cs/api/s/v1/coupon/package/getCoupon',
      method: 'get',
      params: params
    })
  }
  // 退款提交表单
  export function submito(data) {
    return request({
      url: '/api_cs/approval/refundApproval',
      method: 'post',
      data: { ...data, staffName: getToken('cname'), staffMobile: getToken('userMobile'), staffId: getToken('userId') }
    })
  }
  // 整盒补发调用接口
  export function getCourseMaterialsList(params) {
    return request({
      url: '/api_cs/api/p/v1/product/getCourseMaterialsList',
      method: 'get',
      params: params
    })
  }
  // 补发货选择商品信息： 整盒且有物流、散件有物流
  export function getProductShops(data) {
    return request({
      url: '/api_cs/graphql-java',
      method: 'post',
      data: { query: `{
        Product (query: ${JSON.stringify(JSON.stringify(data))}) {
          id
          name
          center_product_code
          count
          type
          sub_title
          title
        payment
          materials_bind_info {
            id
            name
            center_product_code
            count
            type
            sub_title
            title
            payment
          }
      }
      }` }
    })
}
// 商品主题id查询
export function getTopicDetail(params) {
  return request({
    url: '/api_cs/api/p/v1/product/TopicDetail',
    method: 'get',
    params: params
  })
}

// 新搞出来的地址查询接口-补发货审批-盒子类
export function getExpressBoxByOrderId(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getLastCourseExpressByOrderId',
    method: 'get',
    params: params
  })
}
// 新搞出来的地址查询接口-补发货审批-非盒子类
export function getExpressFalBoxByOrderId(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getLastNotCourseExpressByOrderId',
    method: 'get',
    params: params
  })
}
// 获取系统课所有的物流订单（不区分盒子还是非盒子）
export function getExpressListByOrderIdTwo(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getExpressListByOrderId',
    method: 'get',
    params: params
  })
}
// 获取海外国家城市列表
export function getCenterOSAddressList(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/oversea/getCenterOSAddressList',
    method: 'get',
    params: params
  })
}
// 获取第三级地址
export function getCenterAddressList(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getCenterAddressList',
    method: 'get',
    params: params
  })
}
// 获取海外国家列表
export function getCenterCountryList(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/oversea/getCenterCountryList',
    method: 'get',
    params: params
  })
}
  // 获取第四级地址
export function getCenterAddressTownList(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getCenterAddressTownList',
    method: 'get',
    params: params
  })
}
  // 新增收货地址
export function createAddressNew(data) {
  return request({
    url: '/api_cs/api/ex/v1/express/background/createAddressNew',
    method: 'post',
    data
  })
}
  // 修改收货地址
export function updateAddressNew(data) {
  return request({
    url: '/api_cs/api/ex/v1/express/background/updateAddressNew',
    method: 'post',
    data
  })
}
  // 修改默认收货地址
export function updateDefaultAddress(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/background/updateDefaultAddress',
    method: 'get',
    params: params
  })
}
  // 补发货申请获取课程进度-体验课
export function findTrailByOrderNo(params) {
  return request({
    url: '/api_cs/api/ts/v1/teaching/student/trial/findTrailByOrderNo',
    method: 'get',
    params: params
  })
}
  // 补发货申请获取课程进度-系统课
export function findSystemByOrderNo(params) {
  return request({
    url: '/api_cs/api/ts/v1/teaching/student/system/findSystemByOrderNo',
    method: 'get',
    params: params
  })
}
// 带班详情 物流 修改地址 查询地址接口
export function getAddressList(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getAddressList',
    method: 'get',
    params: params
  })
}
// 根据地址ID，查询收货地址
export function getAddressByIdUnsafe(params) {
  return request({
    url: '/api_cs/api/ex/v1/express/getAddressByIdUnsafe',
    method: 'get',
    params: params
  })
}
// 申请补发货接口
export function applyReplenish(data) {
  return request({
    url: '/api_cs/approval/replenishmentApproval',
    method: 'post',
    data: { ...data, staffName: getToken('cname'), staffMobile: getToken('userMobile'), staffId: getToken('userId') }
  })
}

// 获取该地区是否属于疫情受影响地区
  export function getForbidAddressStatus(params) {
    return request({
      url: '/api_cs/api/ex/v1/express/getForbidAddressStatus',
      method: 'get',
      params
    })
  }
