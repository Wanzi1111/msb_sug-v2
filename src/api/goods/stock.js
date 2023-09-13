/**
 * @author: Liwei
 * @description: 仓库管理
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 查询库存列表
 * @param data
 * @returns {AxiosPromise}
 */
export function stockList(data) {
  return request({
    url: '/logistics/warehouse/product/statistics',
    method: 'POST',
    data
  })
}

/**
 * 查询出库明细
 * @param data
 * @returns {AxiosPromise}
 */
export function stockDetail(data) {
  return request({
    url: '/logistics/warehouse/product/detail',
    method: 'POST',
    data
  })
}
