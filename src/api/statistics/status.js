import request from '@/utils/request'

// 获取统计问题页面数据
export function statusList(data) {
  return request({
    url: '/api_cs/statistics/status',
    method: 'post',
    data
  })
}

export function exportStatus(params) {
  return request({
    url: '/api_cs/statistics/statusDownload',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
