/**
 * @author: zhengyufeng
 * @description: 排班接口
 * @date: 2021/7/19
 */
import request from '@/utils/request'
import qs from 'qs'

// 导入员工排班信息
export function importStaffScheduling({ file, operatorPhone, onUploadProgress, reason }) {
  const data = new FormData()
  data.append('file', file)
  data.append('operatorPhone', operatorPhone)
  data.append('reason', reason)
  return request({
    url: '/api_cs/scheduling/importStaffScheduling',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onUploadProgress,
    timeout: 5 * 60 * 1000
  })

  // return request({
  //   url: '/api_cs/scheduling/importStaffScheduling',
  //   method: 'post',
  //   data: qs.stringify(data)
  // })
}

// 人员班次列表
export function getSchedulingStaffList(data) {
  return request({
    url: '/api_cs/scheduling/getSchedulingStaffList',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 修改单个班次
export function updateStaffScheduling(data) {
  return request({
    url: '/api_cs/scheduling/updateStaffScheduling',
    method: 'post',
    data
  })
}
