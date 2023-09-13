/**
 * @author: Liwei
 * @description: 广告位
 * @date: 2020/1/9
 */
import request from '@/utils/request'
import qs from 'qs'

/**
 * 新增广告位
 * @param data
 * @returns {AxiosPromise}
 */
// businessType 业务类型：
// clientType 客户端：
// advertType 广告类型：
// totalCount ？？
export function addAdvert(params) {
  return request({
    url: '/operation/resource/addAdvert',
    method: 'post',
    params: params
  })
}

/**
 * 新增广告位配置 - 未用
 * @param data
 * @returns {AxiosPromise}
 */
// type businessType-业务类型||clientType-客户端||advertType-广告类型
// value
export function createAd(data) {
  return request({
    url: '/operation/resource/addAdvertConfig',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 广告位配置下拉列表 - 未用
 * @param data
 * @returns {AxiosPromise}
 */
export function advertConfig() {
  return request({
    url: '/operation/resource/advertConfig',
    method: 'get'
  })
}

/**
 * 获取广告位
 * @param data
 * @returns {AxiosPromise}
 */
// advertSize
export function listAdvert(params) {
  return request({
    url: '/operation/resource/listAdvert',
    method: 'get',
    params: params
  })
}

/**
 * 启用、禁止广告位
 * @param data
 * @returns {AxiosPromise}
 */
// advertId
// status
export function actionAdvert(data) {
  return request({
    url: '/operation/resource/openAndCloseAdvert',
    method: 'post',
    data: qs.stringify(data)
  })
}

