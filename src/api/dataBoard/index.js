import request from '@/utils/request'

// 获取统计问题页面数据
export function homeList(params) {
  return request({
    url: '/api_cs/statistics/homePageCount',
    method: 'post',
    params
  })
}
