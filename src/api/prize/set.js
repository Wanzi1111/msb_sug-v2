/**
 * @author: Liwei
 * @description: 奖品
 * @date: 2020/7/27
 */
import request from '@/utils/request'

/**
 * 奖品管理 分页获取
 * @param params
 * @returns {AxiosPromise}
 */
export function getPrize(params) {
  return request({
    url: '/ums_api/activity/prize/getPrize',
    method: 'post',
    params
  })
}
/**
 * 奖品管理 单条获取
 * @param params
 * @returns {AxiosPromise}
 */
export function getOnePrize(params) {
  return request({
    url: '/ums_api/activity/prize/getOnePrize',
    method: 'post',
    params
  })
}
/**
 * 奖品管理 保存
 * @param params
 * @returns {AxiosPromise}
 */
export function savePrize(params) {
  return request({
    url: '/ums_api/activity/prize/savePrize',
    method: 'post',
    params
  })
}
/**
 * 奖品管理 删除
 * @param params
 * @returns {AxiosPromise}
 */
export function delPrize(params) {
  return request({
    url: '/ums_api/activity/prize/delPrize',
    method: 'post',
    params
  })
}
