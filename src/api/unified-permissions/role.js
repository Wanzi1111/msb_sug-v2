/**
 * @author: huzhifu
 * @description: 角色管理API
 * @date: 2020/5/14
 */
import request from '@/utils/request'

/**
 * 添加角色
 * @param params
 * @returns {AxiosPromise}
 */
export function createRole(params) {
  return request({
    url: '/permissions/api/role/add',
    method: 'post',
    data: params
  })
}

/**
 * 编辑角色
 * @param params
 * @returns {AxiosPromise}
 */
export function updateRole(params) {
  return request({
    url: '/permissions/api/role/mod',
    method: 'post',
    data: params
  })
}

/**
 * 查询角色列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getRoleList(params) {
  return request({
    url: '/permissions/api/role/list',
    method: 'get',
    params: params
  })
}

/**
 * 查询角色详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getRole(params) {
  const { id } = params
  return request({
    url: `/permissions/api/role/${id}`,
    method: 'get'
  })
}
