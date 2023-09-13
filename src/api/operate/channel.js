/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-29 11:51:40
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-29 16:53:20
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取渠道设置列表
export function getChannelList(params) {
  return request({
    url: '/api_cs/channel/getByPage',
    method: 'get',
    params: params
  })
}

// 获取二级列表
export function getChannelChildrenList(params) {
  return request({
    url: '/api_cs/channel/getBypid',
    method: 'get',
    params: params
  })
}

// 添加问题分类或子分类
export function addChannelApi(data) {
  return request({
    url: '/api_cs/channel/add',
    method: 'post',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 编辑渠道分类
export function editChannelApi(data) {
  return request({
    url: '/api_cs/channel/update',
    method: 'post',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
