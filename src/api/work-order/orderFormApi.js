import request from '@/utils/request'
// 获取小熊业务线订单列表
export function getBearList(params) {
    return request({
      url: '/api_cs/v1/complaint/order/getBearList',
      method: 'get',
      params
    })
}
// 获取1对1订单列表
export function getPayOrder(params) {
    return request({
      url: '/api_cs/v1/complaint/order/getPayOrder',
      method: 'get',
      params
    })
}
// 获取奖励
export function getRewardOrder(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getRewardOrder',
    method: 'get',
    params
  })
}
// 获取退费
export function getRefundOrder(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getRefundOrder',
    method: 'get',
    params
  })
}
// 获取积分商城列表
export function getShopOrderList(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getShopOrderList',
    method: 'post',
    params
  })
}
// 小熊多个物流
export function getBearExpress(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getBearExpress',
    method: 'get',
    params
  })
}
// 积分商城单个物流
export function getShopExpress(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getShopExpress',
    method: 'get',
    params
  })
}
// 积分商城&小熊物流轨迹
export function getBearExpressTrace(params) {
  return request({
    url: '/api_cs/v1/complaint/order/getBearExpressTrace',
    method: 'get',
    params
  })
}
