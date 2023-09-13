import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取呼叫记录列表
export function getComplaintCallRecords(data) {
  return request({
    url: '/api_cs/v2/complaint/getComplaintCallRecords',
    method: 'post',
    data: { ...data }
  })
}
// 机器人回访拨打电话接口
export function acceptCallComplaint(data) {
  return request({
    url: '/api_cs/v2/complaint/acceptCallComplaint',
    method: 'post',
    data: data
  })
}
// 获取回呼详情
export function getComplaintCallRecordsDetail(params) {
  return request({
    url: '/api_cs/v2/complaint/getComplaintCallRecordsDetail',
    method: 'get',
    params
  })
}
// 获取机器人回访模板ID 拨打的手机号 是否是拨打后回访的状态
export function getCallRequest(params) {
  return request({
    url: '/api_cs/v2/complaint/getCallRequest',
    method: 'get',
    params
  })
}
// 获取用户意向下拉数据
export function getCallUserIntention() {
  return request({
    url: '/api_cs/eum/callUserIntention',
    method: 'get'
  })
}
// 获取通话状态下拉数据
export function getChannelAndCallStatus() {
  return request({
    url: '/api_cs/eum/getChannelAndCallStatus',
    method: 'get'
  })
}
// 获取列表tab通话状态
export function getCallRecords() {
  return request({
    url: '/api_cs/eum/getCallRecords',
    method: 'get'
  })
}
// 下载呼叫记录列表接口
export function downexportCallList(data) {
  return request({
    url: '/api_cs/export/exportCallList',
    method: 'post',
    responseType: 'blob',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
