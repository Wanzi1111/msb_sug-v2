/**
 * @author: Liwei
 * @description: 投放
 * @date: 2020/1/9
 */
import request from '@/utils/request'

/**
 * 查看广告位物料
 * @param data
 * @returns {AxiosPromise}
 */
export function materielAttr(params) {
  return request({
    url: '/operation/resource/listResourceByAdvert',
    method: 'get',
    params: params
  })
}

/**
 * 调整物料顺序
 * @param data
 * @returns {AxiosPromise}
 */
export function sortMateriel(data) {
  return request({
    url: '/operation/resource/orderResource',
    method: 'post',
    data: data
  })
}

/**
 * 投放列表
 * @returns {AxiosPromise}
 */
export function publishList(data, params) {
  return request({
    url: '/operation/resource/publishList',
    method: 'post',
    data: data,
    params: params
  })
}

/**
 * 停止投放
 * @returns {AxiosPromise}
 */
export function stopPublish(params) {
  return request({
    url: '/operation/resource/stopPublish',
    method: 'post',
    params: params
  })
}

/**
 * 获取快速投放广告位
 * @returns {AxiosPromise}
 */
export function listAdvertPublish(params) {
  return request({
    url: '/operation/resource/listAdvertPublish',
    method: 'get',
    params: params
  })
}
/**
 * 修改投放
 * @returns {AxiosPromise}
 */
export function updatePublish(data) {
  return request({
    url: '/operation/resource/updatePublish',
    method: 'post',
    data: data
  })
}
