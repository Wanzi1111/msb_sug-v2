/**
 * @author: Liwei
 * @description: 商品管理
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 查询业务线信息
 * @param data
 * @returns {AxiosPromise}
 */
export function businessList(data) {
  return request({
    url: '/logistics/product/business/list',
    method: 'POST',
    data
  })
}

/**
 * 删除商品
 * @param params
 * @returns {AxiosPromise}
 */
export function productDelete(params) {
  return request({
    url: '/logistics/product/delete',
    method: 'POST',
    params
  })
}

/**
 * 分页查询商品信息
 * @param data
 * @returns {AxiosPromise}
 */
export function productList(data) {
  return request({
    url: '/logistics/product/list',
    method: 'POST',
    data
  })
}

/**
 * 添加商品
 * @param data
 * @returns {AxiosPromise}
 */
export function productSave(data) {
  return request({
    url: '/logistics/product/save',
    method: 'POST',
    data
  })
}

/**
 * 更新商品
 * @param data
 * @returns {AxiosPromise}
 */
export function productUpdate(data) {
  return request({
    url: '/logistics/product/update',
    method: 'POST',
    data
  })
}

/**
 * 查询仓库信息
 * @param data
 * @returns {AxiosPromise}
 */
export function houseListApi(data) {
  return request({
    url: '/logistics/warehouse/list',
    method: 'POST',
    data
  })
}

/**
 * 删除商品与库存关联信息
 * @param data
 * @returns {AxiosPromise}
 */
export function deleteHouse(data) {
  return request({
    url: '/logistics/warehouse/product/delete',
    method: 'POST',
    data
  })
}

/**
 * 保存仓库信息
 * @param data
 * @returns {AxiosPromise}
 */
export function houseSave(data) {
  return request({
    url: '/logistics/warehouse/save',
    method: 'POST',
    data
  })
}

/**
 * 更新仓库信息
 * @param data
 * @returns {AxiosPromise}
 */
export function houseUpdate(data) {
  return request({
    url: '/logistics/warehouse/update',
    method: 'POST',
    data
  })
}

/**
 * 查询商品与库存关联信息
 * @param data
 * @returns {AxiosPromise}
 */
export function houseList(data) {
  return request({
    url: '/logistics/warehouse/product/list',
    method: 'POST',
    data
  })
}

/**
 * 查询单个商品与库存关联信息
 * @param data
 * @returns {AxiosPromise}
 */
export function productOne(data) {
  return request({
    url: '/logistics/warehouse/product/productOne',
    method: 'POST',
    data
  })
}

/**
 * 增加-扣减 库存
 * @param data
 * @returns {AxiosPromise}
 */
export function updateStock(data) {
  return request({
    url: '/logistics/warehouse/product/updateStock',
    method: 'POST',
    data
  })
}

/**
 * 查询第三方商品库存
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSupplierStock(data) {
  return request({
    url: '/logistics/warehouse/product/updateSupplierStock',
    method: 'POST',
    data
  })
}
