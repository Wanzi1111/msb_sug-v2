/**
 * @author: zhengyufeng
 * @description: 操作日志接口
 * @date: 2021/7/19
 */
import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'
// const PROXY = require('../../../config/proxy.js')

// 导出操作日志列表
export function exportOperationLog(params) {
  // const path = '/k8s'
  return axios({
    method: 'get',
    url: 'https://1v1k8s.meishubao.com/vip-app-dev/api/complaint/api/operation/exportOperationLog',
    // url: `${PROXY[process.env.VUE_APP_ENV][path].target}/api/complaint/api/operation/exportOperationLog`,
    params: params
  })
  // return request({
  //   url: '/api_cs/operation/exportOperationLog',
  //   method: 'get',
  //   params: params
  // })
}

// 获取枚举列表
export function getOperationEumList(data) {
  // return axios.get('http://1v1k8s.meishubao.com/vip-app-dev/api/complaint/api/operation/operationEum')
  return request({
    url: '/api_cs/operation/operationEum',
    method: 'get'
  })
}

// 获取操作日志列表
export function getLogList(data) {
  // return axios.post('http://1v1k8s.meishubao.com/vip-app-dev/api/complaint/api/operation/logList', qs.stringify(data))
  return request({
    url: '/api_cs/operation/logList',
    method: 'post',
    data: qs.stringify(data)
  })
}
