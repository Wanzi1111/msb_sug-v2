/**
 * @author: huzhifu
 * @description: 员工管理API
 * @date: 2020/5/14
 */
import request from '@/utils/request'

/**
 * 用户登录
 * @param params
 * @returns {AxiosPromise}
 */
export function userLogin(params) {
  return request({
    url: '/permissions/api/user/web/login',
    method: 'post',
    data: params
  })
}

/**
 * 编辑用户
 * @param params
 * @returns {AxiosPromise}
 */
export function editUser(params) {
  return request({
    // url: '/permissions/api/user/updateUser',
    url: '/permissions/api/user/pwd/mod',
    method: 'post',
    data: params
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}

/**
 * 用户分配角色
 * @param params
 * @returns {AxiosPromise}
 */
export function allotRole(params) {
  return request({
    url: '/permissions/api/role/alloc',
    method: 'post',
    data: params
  })
}

/**
 * 查询用户详情
 * @param params
 * @returns {AxiosPromise}
 */
export function getUser(params) {
  return request({
    url: '/permissions/api/user/getUser/{id}',
    method: 'get',
    params: params
  })
}

/**
 * 查询用户列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserList(params) {
  return request({
    url: '/permissions/api/user/list',
    method: 'get',
    params: params
  })
}

/**
 * 公司部门树形列表
 * @param params
 * @returns {AxiosPromise}
 */
export function getOrgTree(params) {
  return request({
    url: '/permissions/api/user/org',
    method: 'get',
    params: params
  })
}
