import request from '@/utils/request'

export function areaList(params) {
  return request({
    url: '/api_cs/statistics/areaCount',
    method: 'post',
    params
  })
}

export function exportArea(params) {
  return request({
    url: '/api_cs/statistics/areaCountDownload',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
