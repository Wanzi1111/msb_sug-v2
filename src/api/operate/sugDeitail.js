import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// 获取所有的投诉员工
export function getAllStaff() {
    return request({
      url: '/api_cs/staff/getAllStaff',
      method: 'get'
    })
  }
// 添加待办
export function setAddPending(data) {
  return request({
    url: '/api_cs/pending/add',
    method: 'post',
    data: { ...data, createName: getToken('cname'), createPhone: getToken('userMobile'), createUserId: getToken('userId') }
  })
}
// 待办列表
export function getpendingList(params) {
  return request({
    url: '/api_cs/pending/pendingList',
    method: 'get',
    params: { ...params, executorId: getToken('userId') }
  })
}
