import request from '@/utils/request'

// 获取统计问题页面数据
export function problemList(params) {
  return request({
    url: '/api_cs/statistics/problem',
    method: 'post',
    params
  })
}

// table二级数据
export function problemSon(params) {
  return request({
    url: '/api_cs/statistics/problemSon',
    method: 'post',
    params
  })
}

export function exportProblem(params) {
  return request({
    url: '/api_cs/statistics/problemDownload',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
