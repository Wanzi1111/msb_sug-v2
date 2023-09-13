/**
 * @author: huzhifu
 * @description: 资源管理API
 * @date: 2020/5/14
 */
import request from '@/utils/request'

/**
 * 新增业务系统
 * @param params
 * @returns {AxiosPromise}
 */
export function createSystem(params) {
  return request({
    // url: '/permissions/api/res/createSystem',
    url: '/permissions/api/res/sys/add',
    method: 'post',
    data: params
  })
}

/**
 * 查询业务系统详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getSystem(params) {
  return request({
    url: '/permissions/api/system/getSystem/{id}',
    method: 'get',
    params: params
  })
}

/**
 * 编辑业务系统
 * @param params
 * @returns {AxiosPromise}
 */
export function updateSystem(params) {
  return request({
    // url: '/permissions/api/res/updateSystem',
    url: '/permissions/api/res/sys/mod',
    method: 'post',
    data: params
  })
}

/**
 * 查询业务系统列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getSystemList(params) {
  return request({
    // url: '/permissions/api/system/getSystemList',
    url: '/permissions/api/res/sys/list',
    method: 'get',
    params: params
  })
}

/**
 * 新增菜单
 * @param params
 * @returns {AxiosPromise}
 */
export function createMenu(params) {
  return request({
    // url: '/permissions/api/res/createMenu',
    url: '/permissions/api/res/menu/add',
    method: 'post',
    data: params
  })
}

/**
 * 编辑菜单
 * @param params
 * @returns {AxiosPromise}
 */
export function updateMenu(params) {
  return request({
    // url: '/permissions/api/res/updateMenu/{id}',
    url: '/permissions/api/res/menu/mod',
    method: 'post',
    data: params
  })
}

/**
 * 查询菜单详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getMenu(params) {
  return request({
    url: '/permissions/api/res/getRes/{id}',
    method: 'get',
    params: params
  })
}

/**
 * 查询菜单列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getMenuList(params) {
  return request({
    url: '/permissions/api/res/getResList',
    method: 'get',
    params: params
  })
}
