/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-14 17:32:35
 */
/**
 * @author: Liwei
 * @description: 登录页接口
 * @date: 2020/1/8
 */
import request from '@/utils/request'
// import qs from 'qs'

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
// export function login(data) {
//   return request({
//     url: '/operation/login/teaEmailOrPhonePwdLogin',
//     method: 'post',
//     data: qs.stringify(data)
//   })
// }

// export function login(params) {
//   return request({
//     url: '/api_cs/staff/login',
//     method: 'post',
//     params: params
//   })
// }
export function login(data) {
  return request({
    url: '/api_cs/authentication/loginByMobile',
    method: 'post',
    data
  })
}
// 获取人员权限id
export function getAuthorityUser(params) {
  return request({
    url: '/api_cs/staff/getAuthorityUser',
    method: 'get',
    params: params
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/api_cs/staff/info',
    method: 'get'
  })
}
// 接入sso登陆
export function ssoLogin(params) {
  return request({
    url: '/sso/api/v1/token/get',
    method: 'get',
    params
  })
}

