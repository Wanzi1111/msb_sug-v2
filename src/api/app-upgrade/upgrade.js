/**
 * @author: Liwei
 * @description: 审核配置API
 * @date: 2020/3/9
 */
import request from '@/utils/request'

/**
 * 获取审核配置
 * @param params
 * @returns {AxiosPromise}
 */
export function editState(params) {
  return request({
    url: '/operation/web/version/review/editState',
    method: 'post',
    params: params
  })
}

/**
 * 获取审核配置
 * @param params
 * @returns {AxiosPromise}
 */
export function getReview(params) {
  return request({
    url: '/operation/web/version/review/getReview',
    method: 'post',
    params: params
  })
}

/**
 * 添加审核配置
 * @param params
 * @returns {AxiosPromise}
 */
export function putReview(params) {
  return request({
    url: '/operation/web/version/review/putReview',
    method: 'post',
    params: params
  })
}

/**
 * 新升级修改文案，启用状态
 * @param params
 * @returns {AxiosPromise}
 */
export function editUpgradeVersion(params) {
  return request({
    url: '/operation/web/version/upgrade/editUpgradeVersion',
    method: 'post',
    params: params
  })
}

/**
 * 获取升级方案
 * @param params
 * @returns {AxiosPromise}
 */
export function getUpgradeVersion(params) {
  return request({
    url: '/operation/web/version/upgrade/getUpgradeVersion',
    method: 'post',
    params: params
  })
}

/**
 * 发布新升级
 * @param params
 * @returns {AxiosPromise}
 */
export function putUpgradeVersion(params) {
  return request({
    url: '/operation/web/version/upgrade/putUpgradeVersion',
    method: 'post',
    params: params
  })
}
