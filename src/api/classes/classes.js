/**
 * @author: zhengyufeng
 * @description: 排班接口
 * @date: 2021/7/19
 */
import request from '@/utils/request'
import qs from 'qs'
import { getToken } from '@/utils/auth'

// 添加班次
export function addSch(data) {
  return request({
    url: '/api_cs/scheduling/addSch',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改班次
export function updateSch(data) {
  return request({
    url: '/api_cs/scheduling/updateSch',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 删除班次
export function delSch(data) {
  return request({
    url: '/api_cs/scheduling/delSch',
    method: 'post',
    data: qs.stringify({ ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') })
  })
}

// 班次列表
export function getSchedulingList(data) {
  return request({
    url: '/api_cs/scheduling/getSchedulingList',
    method: 'post',
    data: qs.stringify(data)
  })
}

