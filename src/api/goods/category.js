/**
 * @author: Liwei
 * @description: 商品类型管理
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 修改商品分类状态
 * @param data
 * @returns {AxiosPromise}
 */
export function isEnable(data) {
  return request({
    url: '/logistics/product/type/isEnable',
    method: 'POST',
    data
  })
}

/**
 * 分页查询商品分类信息
 * @param data
 * @returns {AxiosPromise}
 */
export function categoryList(data) {
  return request({
    url: '/logistics/product/type/list',
    method: 'POST',
    data
  })
}

/**
 * 增加商品分类
 * @param data
 * @returns {AxiosPromise}
 */
export function categorySave(data) {
  return request({
    url: '/logistics/product/type/save',
    method: 'POST',
    data
  })
}

/**
 * 更新商品分类信息
 * @param data
 * @returns {AxiosPromise}
 */
export function categoryUpdate(data) {
  return request({
    url: '/logistics/product/type/update',
    method: 'POST',
    data
  })
}
