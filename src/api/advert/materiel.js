/**
 * @author: Liwei
 * @description: 物料
 * @date: 2020/1/9
 */
import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加物料尺寸
 * @param data
 * @returns {AxiosPromise}
 */
// osType
// resourceSize
export function createSize(data) {
  return request({
    url: '/operation/resource/addResourceSize',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 手动添加物料尺寸（新）
 * @param data
 * @returns {AxiosPromise}
 */
// osType
// resourceSize
export function addResourceSize(data) {
  return request({
    url: '/operation/resource/addResourceSizeNew',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 物料列表
 * @param data
 * @returns {AxiosPromise}
 */
export function materielList(data, params) {
  return request({
    url: '/operation/resource/listResource',
    method: 'post',
    data: data,
    params: params
  })
}

/**
 * 获取物料尺寸列表
 * @returns {AxiosPromise}
 */
export function materielSize() {
  return request({
    url: '/operation/resource/listResourceSize',
    method: 'post'
  })
}

/**
 * 快速投放
 * @returns {AxiosPromise}
 */
export function publish(data, params) {
  return request({
    url: '/operation/resource/publish',
    method: 'post',
    data: data,
    params: params
  })
}

/**
 * 获取物料信息- 更换、预览、快速投放
 * @param data
 * @returns {AxiosPromise}
 */
export function queryResource(params) {
  return request({
    url: '/operation/resource/queryResource',
    method: 'get',
    params: params
  })
}

/**
 * 新增、跟换物料
 * @param data
 * @returns {AxiosPromise}
 */
export function materielAction(data) {
  return request({
    url: '/operation/resource/uploadResource',
    method: 'post',
    data: data
  })
}
