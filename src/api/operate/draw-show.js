/**
 * @author: Liwei
 * @description: 小画家作品秀
 * @date: 2020/7/14
 */
import request from '@/utils/request'

/**
 * 上传视频
 * @param params
 * @returns {AxiosPromise}
 */
export function showAdd(params) {
  return request({
    url: '/msb_api/workShow/add',
    method: 'POST',
    params
  })
}

/**
 * 审核视频状态
 * @param params
 * @returns {AxiosPromise}
 */
export function showExamine(params) {
  return request({
    url: '/msb_api/workShow/examine',
    method: 'POST',
    params
  })
}

/**
 * 作品秀后管平台 - 列表
 * @param params
 * @returns {AxiosPromise}
 */
export function showList(params) {
  return request({
    url: '/msb_api/workShow/list',
    method: 'GET',
    params
  })
}

/**
 * 上线下线视频
 * @param params
 * @returns {AxiosPromise}
 */
export function showOnLine(params) {
  return request({
    url: '/msb_api/workShow/onLine',
    method: 'POST',
    params
  })
}

/**
 * 查看视频详情
 * @param params
 * @returns {AxiosPromise}
 */
export function showDetail(params) {
  return request({
    url: '/msb_api/workShow/query',
    method: 'GET',
    params
  })
}

/**
 * 查询视频作者
 * @param params
 * @returns {AxiosPromise}
 */
export function showQueryAuthor(params) {
  return request({
    url: '/msb_api/workShow/queryAuthor',
    method: 'GET',
    params
  })
}

/**
 * 是否推荐至首页
 * @param params
 * @returns {AxiosPromise}
 */
export function showRecommend(params) {
  return request({
    url: '/msb_api/workShow/recommend',
    method: 'POST',
    params
  })
}

/**
 * 编辑视频详情
 * @param params
 * @returns {AxiosPromise}
 */
export function showUpdate(params) {
  return request({
    url: '/msb_api/workShow/update',
    method: 'POST',
    params
  })
}

/**
 * 审核状态枚举
 * @returns {AxiosPromise}
 */
export function worksShowStatus() {
  return request({
    url: '/msb_api/enum/WorksShowStatus',
    method: 'GET'
  })
}

/**
 * 审核状态原因
 * @returns {AxiosPromise}
 */
export function worksShowStatusCause() {
  return request({
    url: '/msb_api/enum/WorksShowStatusCause',
    method: 'GET'
  })
}
