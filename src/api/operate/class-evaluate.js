/**
 * @author: Liwei
 * @description: 课后评价
 * @date: 2020/3/21
 */
import request from '@/utils/request'

/**
 * 课后评价列表
 * @param params
 * @returns {AxiosPromise}
 */
export function classList(params) {
  return request({
    url: '/api/pc/operate/list',
    method: 'post',
    params: params,
    timeout: 10000
  })
}

/**
 * 课后评价统计
 * @param params
 * @returns {AxiosPromise}
 */
export function statistics(params) {
  return request({
    url: '/api/pc/operate/statistics',
    method: 'post',
    params: params,
    timeout: 20000
  })
}

/**
 * 一对一导出
 * @param params
 * @returns {AxiosPromise}
 */
export function exportEvaluate(params) {
  return request({
    url: '/api/pc/operate/exportEvaluate',
    method: 'get',
    params: params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}

/**
 * 小班课 - 统计接口
 * @returns {AxiosPromise}
 */
export function xbkStatistics(data) {
  return request({
    url: '/xbk/crCommentDetail/statistics',
    method: 'post',
    data: data,
    timeout: 20000
  })
}

/**
 * 小班课 - 列表查询
 * @param params
 * @returns {AxiosPromise}
 */
export function listCommentDetail(data) {
  return request({
    url: '/xbk/crCommentDetail/listCommentDetail',
    method: 'post',
    data: data,
    timeout: 10000
  })
}

/**
 * 小班课导出
 * @param params
 * @returns {AxiosPromise}
 */
export function xbkExport(params) {
  return request({
    url: '/xbk/crCommentDetail/export',
    method: 'get',
    params: params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}

