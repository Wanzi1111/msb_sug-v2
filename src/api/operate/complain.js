/**
 * @author: shasen
 * @description: 投诉列表
 * @date: 2020/2/3
 */
import request from '@/utils/request'
import qs from 'qs'

/**
 * 投诉列表
 * @param data
 * @returns {AxiosPromise}
 */
export function getComplaints(params) {
  return request({
    url: '/operation/complaints/getComplaints',
    method: 'post',
    params: params
  })
}

/**
 * 导出列表GET /complaints/exportComplaints
 * @param data
 * @returns {AxiosPromise}
 */
export function exportComplaints(params) {
  return request({
    url: '/operation/complaints/exportComplaints',
    method: 'get',
    params: params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
/**
 * 获取筛选条件
 * @param data
 * @returns {AxiosPromise}
 */
export function getScreenCondition(data) {
  return request({
    url: '/operation/complaints/getScreenCondition',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取回访记录/complaints/getRecord
 * @param data
 * @returns {AxiosPromise}
 */
export function getRecord(params) {
  return request({
    url: '/operation/complaints/getRecord',
    method: 'post',
    params: params
  })
}

/**
 * 添加回访记录POST /complaints/addRecord
 * @param data
 * @returns {AxiosPromise}
 */
export function addRecord(params) {
  return request({
    url: '/operation/complaints/addRecord',
    method: 'post',
    params: params
  })
}

/**
 * POST /complaints/getComplaintsNumbers 获取投诉各个时间段的投诉数量
 * @param data
 * @returns {AxiosPromise}
 */
export function getComplaintsNumbers(params) {
  return request({
    url: '/operation/complaints/getComplaintsNumbers',
    method: 'post',
    params: params
  })
}

/**
 * POST /complaints/upDateComplaintsStatus根据投诉id改变投诉状态
 * @param data
 * @returns {AxiosPromise}
 */
export function upDateComplaintsStatus(params) {
  return request({
    url: '/operation/complaints/upDateComplaintsStatus',
    method: 'post',
    params: params
  })
}

