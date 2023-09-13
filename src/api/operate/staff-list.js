/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-04 15:48:02
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-15 18:46:41
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// import qs from 'qs'

/**
 * 员工列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getStaffList(params) {
  return request({
    url: '/api_cs/staff/getByPage',
    method: 'get',
    params: params
  })
}

// 获取业务线等下拉接口枚举
export function getStaffEnumConfig(params) {
  return request({
    url: '/api_cs/eum/getEums',
    method: 'get',
    params: params
  })
}

// 获取联投诉内容
export function getByCreateChannelId(params) {
  return request({
    url: '/api_cs/problem/getByChannelId',
    method: 'get',
    params: params
  })
}

// 重置密码
export function staffResetPwd(params) {
  return request({
    url: '/api_cs/staff/resetPwd',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 添加员工
export function staffAdd(params) {
  return request({
    url: '/api_cs/staff/add',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 编辑员工
export function staffUpdate(params) {
  return request({
    url: '/api_cs/staff/update',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 禁用或删除接口
export function staffDelOrDisable(params) {
  return request({
    url: '/api_cs/staff/delOrDisable',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
