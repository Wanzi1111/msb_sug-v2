/**
 * @author: Liwei
 * @description: 版本管理API
 * @date: 2020/3/9
 */
import request from '@/utils/request'

/**
 * 获取版本信息
 * @param params
 * @returns {AxiosPromise}
 */
export function getClientVersion(params) {
  return request({
    url: '/operation/web/version/client/getClientVersion',
    method: 'post',
    params: params
  })
}

/**
 * 客户端，升级类型下拉框
 * @returns {AxiosPromise}
 */
export function getLabelDrop() {
  return request({
    url: '/operation/web/version/client/getLabelDrop',
    method: 'post'
  })
}

/**
 * 添加升级配置，根据客户端和升级类型获取版本号下拉框
 * @param params
 * @returns {AxiosPromise}
 */
export function getVersionDesc(params) {
  return request({
    url: '/operation/web/version/client/getVersionDesc',
    method: 'post',
    params: params
  })
}

/**
 * web添加版本
 * @param params
 * @returns {AxiosPromise}
 */
export function putClientVersionweb(params) {
  return request({
    url: '/operation/web/version/client/putClientVersion',
    method: 'post',
    params: params
  })
}
