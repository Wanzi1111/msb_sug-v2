import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取 工单列表
export function getWorkOrderList(data) {
  return request({
    url: '/api_cs/business/workOrderList',
    method: 'post',
    data
  })
}

// 创建工单
export function createWorkOrder(data) {
  return request({
    url: '/api_cs/business/createWorkOrder',
    method: 'post',
    data
  })
}

// 一键创建工单
export function createWorkOrderOnce(params) {
  return request({
    url: '/api_cs/v2/complaint/createWorkOrder',
    method: 'post',
    params
  })
}

// 获取 工单类型枚举
export function getWorkProblemEum() {
  return request({
    url: '/api_cs/business/getWorkProblemEum',
    method: 'get'
  })
}

// 获取 工单l列表统计
export function getWorkOrderListNum(data) {
  return request({
    url: '/api_cs/business/workOrderListNum',
    method: 'post',
    data
  })
}

// 更新 设置工单优先级
export function setPriority(params) {
  return request({
    url: '/api_cs/business/setPriority',
    method: 'post',
    params
  })
}

// 获取 工单处理记录
export function getWorkOrderRecord(params) {
  return request({
    url: '/api_cs/business/workOrderRecord',
    method: 'get',
    params
  })
}

// 导出 工单列表
export function exportWorkOrderList(params) {
  return request({
    url: '/api_cs/business/exportWorkOrderList',
    method: 'get',
    responseType: 'blob',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 下载中心列表接口
export function getExportList(params) {
  return request({
    url: '/api_cs/export/getExportList',
    method: 'get',
    params
  })
}
// 导出 投诉单列表超过2000条预下载接口
export function downloadComplaintSync(params) {
  return request({
    url: '/api_cs/export/downloadComplaintSync',
    method: 'get',
    responseType: 'blob',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 导出 工单列表超过2000条预下载接口
export function exportWorkOrderListSync(params) {
  return request({
    url: '/api_cs/export/exportWorkOrderListSync',
    method: 'get',
    responseType: 'blob',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
