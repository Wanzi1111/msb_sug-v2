/**
 * @author: hzf
 * @description: 路由配置
 * @date: 2020/7/28
 */
import request from '@/utils/request'

/**
 * 路由规则  -新增路由
 * @param data
 * @returns {AxiosPromise}
 */
export function addRule(data) {
  return request({
    url: '/logistics/rout/addRule',
    method: 'POST',
    data
  })
}

/**
 * 路由规则  -路由规则删除
 * @param data
 * @returns {AxiosPromise}
 */
export function delRout(data) {
  return request({
    url: '/logistics/rout/delRout',
    method: 'POST',
    data
  })
}

/**
 * 路由规则  -路由查询
 * @param data
 * @returns {AxiosPromise}
 */
export function findBy(data) {
  return request({
    url: '/logistics/rout/findBy',
    method: 'POST',
    data
  })
}

/**
 * 路由规则  -路由优先级移动
 * @param data
 * @returns {AxiosPromise}
 */
export function levelUpdate(data) {
  return request({
    url: '/logistics/rout/levelUpdate',
    method: 'POST',
    data
  })
}

/**
 * 路由规则  -路由规则停启用
 * @param data
 * @returns {AxiosPromise}
 */
export function switchRule(data) {
  return request({
    url: '/logistics/rout/switchRule',
    method: 'POST',
    data
  })
}

/**
 * 路由规则  -路由修改
 * @param data
 * @returns {AxiosPromise}
 */
export function updateRule(data) {
  return request({
    url: '/logistics/rout/updateRule',
    method: 'POST',
    data
  })
}

/**
 * 路由规则组  -规则组增加
 * @param data
 * @returns {AxiosPromise}
 */
export function groupAdd(data) {
  return request({
    url: '/logistics/rout/group/add',
    method: 'POST',
    data
  })
}

/**
 * 路由规则组  -规则组列表
 * @param data
 * @returns {AxiosPromise}
 */
export function groupList(data) {
  return request({
    url: '/logistics/rout/group/list',
    method: 'POST',
    data
  })
}

/**
 * 路由规则组  -规则组更新
 * @param data
 * @returns {AxiosPromise}
 */
export function groupUpdate(data) {
  return request({
    url: '/logistics/rout/group/update',
    method: 'POST',
    data
  })
}

/**
 * 路由规则组  -规则组启用-停止
 * @param data
 * @returns {AxiosPromise}
 */
export function groupOnoff(data) {
  return request({
    url: '/logistics/rout/group/onOff',
    method: 'POST',
    data
  })
}

/**
 * 路由规则组  -规则组上移-下移
 * @param data
 * @returns {AxiosPromise}
 */
export function groupRemove(data) {
  return request({
    url: '/logistics/rout/group/remove',
    method: 'POST',
    data
  })
}
