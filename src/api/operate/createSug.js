/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-11-09 16:35:23
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-12 18:46:13
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// import qs from 'qs'

// 获取客服平台列表
export function getUserRemark(params) {
  return request({
    url: '/api_cs/v2/complaint/userRemark',
    method: 'post',
    params: params
  })
}
// 创建投诉单接口
export function createComplaintV2(data) {
  return request({
    url: '/api_cs/v2/complaint/createComplaintV2',
    method: 'post',
    data: { ...data, createUserMobile: getToken('userMobile') }
  })
}
// 投诉记录列表
export function batchComplaintList(params) {
  return request({
    url: '/api_cs/v2/complaint/batchComplaintList',
    method: 'post',
    params: params
  })
}

// 批量导入投诉单
export function importBatchSug({ file, onUploadProgress }) {
  console.log(file, onUploadProgress)
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/api_cs/v2/complaint/batchCreateComplaint',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onUploadProgress,
    timeout: 60 * 1000
  })
}
// 下载模板
export function exportTemplateSug(params) {
  return request({
    url: '/api_cs/v2/complaint/exportTemplate',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

// 导出数据
export function exportBatchRecord(params) {
  return request({
    url: '/api_cs/v2/complaint/exportBatchRecord',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

