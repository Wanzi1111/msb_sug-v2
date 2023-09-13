/**
 * @author: Liwei
 * @description: 数据统计
 * @date: 2020/1/9
 */
import request from '@/utils/request'

/**
 * 点击量数据详情
 * @param data
 * @returns {AxiosPromise}
 */
// publishId
export function dataAttr(params) {
  return request({
    url: '/operation/resource/clickDetails',
    method: 'post',
    params: params
  })
}

/**
 * 导出
 * @param params
 * @returns {AxiosPromise}
 */
export function exportClickReport(params) {
  return request({
    url: '/operation/resource/exportClickReport',
    method: 'get',
    params: params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
