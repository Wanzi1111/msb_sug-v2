/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 12:08:45
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:18:06
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取问题设置列表
export function getQuestionList(params) {
  return request({
    url: '/api_cs/problem/getByPageAll',
    method: 'get',
    params: params
  })
}

// 获取二级列表
export function getQuestionChildrenList(params) {
  return request({
    url: '/api_cs/problem/getBypid',
    method: 'get',
    params: params
  })
}

// 多个父级 获取子级列表
export function getBypids(params) {
  return request({
    url: '/api_cs/problem/getBypids',
    method: 'get',
    params: params
  })
}

// 多个父级 获取子级列表
export function getBypidsFilter(params) {
  return request({
    url: '/api_cs/problem/getBypidsFilter',
    method: 'get',
    params: params
  })
}

// 添加问题分类或子分类
export function addProblem(data) {
  return request({
    url: '/api_cs/problem/add',
    method: 'post',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 编辑分类
export function editProblem(data) {
  return request({
    url: '/api_cs/problem/update',
    method: 'post',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 父类启用停用
export function enableProblem(params) {
  return request({
    url: '/api_cs/problem/enable',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}

// 上移下移
export function moveProblem(params) {
  return request({
    url: '/api_cs/problem/move',
    method: 'post',
    params: params
  })
}

// 获取新增问题各层级信息
export function getFloorInfo(params) {
  return request({
    url: `/api_cs/problem/floorInfo`,
    method: 'post',
    params: params
  })
}
