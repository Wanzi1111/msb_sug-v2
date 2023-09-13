import request from '@/utils/request'

// 获取勿扰类型所有的字段类型
export function getBusinessTypeSupplierNameList() {
  return request({
    url: '/api_cs/api/out/in/platForm/getBusinessTypeSupplierNameList',
    method: 'GET'
  })
}
// 获取黑名单列表
export function ObNotDisturbListList(data) {
  return request({
    url: '/api_cs/api/out/in/platForm/ObNotDisturbListList',
    method: 'post',
    data: { ...data }
  })
}
// 添加黑名单 移出黑名单
export function addOrUpdateObNotDisturb(data) {
  return request({
    url: '/api_cs/api/out/in/platForm/addOrUpdateObNotDisturb',
    method: 'post',
    data: { ...data }
  })
}
