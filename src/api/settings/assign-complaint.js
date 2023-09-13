import request from '@/utils/request'
import { getToken } from '@/utils/auth'
/**
 * 投诉分配设置
 */

// 获取 是否开启了自动分配
export function getAutoDistributionStatus(params) {
  return request({
    url: '/api_cs/v2/complaint/getAutoDistribution',
    method: 'get',
    params
  })
}

// 更新 自动分配状态
export function updateAutoDistributionStatus(params) {
  return request({
    url: '/api_cs/v2/complaint/updateAutoDistribution',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 获取 自动分配 名单
export function searchUserInfo(params) {
  return request({
    url: '/api_cs/staff/searchUserInfo',
    method: 'post',
    params
  })
}

// 获取 当前用户时候自动分配
export function getUserInfoById(params) {
  return request({
    url: '/api_cs/staff/getUserInfoById',
    method: 'post',
    params
  })
}

// 开启/关闭 自动分配 人员
export function openDistributionStaff(params) {
  return request({
    url: '/api_cs/staff/openDistributionStaff',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 删除 自动分配 人员
export function delDistributionUser(params) {
  return request({
    url: '/api_cs/staff/delDistributionUser',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 我的工作台 投诉列表
export function getMyWorkComplaintList(data) {
  return request({
    url: '/api_cs/v2/complaint/myWorkComplaintList',
    method: 'post',
    data
  })
}

// 我的工作台 投诉统计
export function myWorkNum(data) {
  return request({
    url: '/api_cs/v2/complaint/myWorkNum',
    method: 'post',
    data
  })
}

// 我的工作台 导出 投诉列表
export function exportMyWork(params) {
  return request({
    url: '/api_cs/v2/complaint/exportMyWork',
    method: 'get',
    params
  })
}

// 开启人员自动分配 可多可少

export function openDistributionStaffList(params) {
  return request({
    url: '/api_cs/staff/openDistributionStaffList',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 批量修改上限人数

export function serviceUpperNum(params) {
  return request({
    url: '/api_cs/staff/serviceUpperNum',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

