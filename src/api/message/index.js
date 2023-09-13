/**
 * @author: shasen
 * @description: 消息推送
 * @date: 2020/3/11
 */
import request from '@/utils/request'
import qs from 'qs'

/**
 * 推送管理列表
 * @param data
 * @returns {AxiosPromise}
 */
// POST /notice/noticeList
export function getNoticeList(data, params) {
  return request({
    url: '/operation/notice/noticeList',
    method: 'post',
    data: data,
    params: params,
    timeout: 10000
  })
}
/**
 * 获取筛选条件
 * @param data
 * @returns {AxiosPromise}
 */
export function noticeSetting(data) {
  return request({
    url: '/operation/notice/noticeSetting',
    method: 'post',
    data: qs.stringify(data)
  })
}
/**
 * 失败消息统计信息
 * @param params
 * @returns {AxiosPromise}
 */
export function failMessageStatistics(data) {
  return request({
    url: '/operation/notice/failMessageStatistics',
    method: 'post',
    data
  })
}

// 消息通知列表
export function getComplaintNews(params) {
  return request({
    url: '/api_cs/news/getComplaintNews',
    method: 'post',
    params
  })
}

// 消息通知数量统计
export function getComplaintNewsNum(params) {
  return request({
    url: '/api_cs/news/getComplaintNewsNum',
    method: 'get',
    params
  })
}

// 消息已读
export function immediatelyHandle(data) {
  return request({
    url: '/api_cs/news/immediatelyHandle',
    method: 'post',
    data
  })
}
// 通知抽屉获取当前用户待处理单子的数量
export function getcountByCpStatusAndCurrentStaffId(params) {
  return request({
    url: '/api_cs/staff/countByCpStatusAndCurrentStaffId',
    method: 'get',
    params
  })
}
// 待办的立即处理
export function immediateComplaint(data) {
  return request({
    url: '/api_cs/pending/immediateComplaint',
    method: 'post',
    data
  })
}
