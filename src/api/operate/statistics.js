/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-10-20 17:25:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-20 17:40:57
 */
import request from '@/utils/request'

// 获取客服平台列表
export function getStatisticsStaffList(params) {
  return request({
    url: '/api_cs/statistics/staff',
    method: 'post',
    params
  })
}

export function exportStaff(params) {
  return request({
    url: '/api_cs/statistics/staffDownload',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
