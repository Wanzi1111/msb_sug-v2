/**
 * @author: Liwei
 * @description: 承运商查询
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 查询全部承运商
 * @param params
 * @returns {AxiosPromise}
 */
export function querySupplier(params) {
  return request({
    url: '/logistics/supplier/queryAll',
    method: 'GET',
    params
  })
}

/**
 * 查询全部快递公司
 * @param params
 * @returns {AxiosPromise}
 */
export function queryAllExpressCompany(params) {
  return request({
    url: '/logistics/supplier/queryAllExpressCompany',
    method: 'GET',
    params
  })
}
