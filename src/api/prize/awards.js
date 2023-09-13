/**
 * @author: Liwei
 * @description: 获奖
 * @date: 2020/7/27
 */
import request from '@/utils/request'

/**
 * 用户获奖信息管理 导入
 * @param params
 * @returns {AxiosPromise}
 */
export function importUserPrize({ file, onUploadProgress }) {
  console.log(file, onUploadProgress)
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/ums_api/activity/userPrize/importUserPrize',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onUploadProgress,
    timeout: 60 * 1000
  })
}
/**
 * 用户获奖信息管理 导出
 * @param params
 * @returns {AxiosPromise}
 */
export function exportUserPrize(params) {
  return request({
    url: '/ums_api/activity/userPrize/exportUserPrize',
    method: 'post',
    params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
/**
 * 用户获奖信息管理 分页获取
 * @param params
 * @returns {AxiosPromise}
 */
export function getUserPrize(params) {
  return request({
    url: '/ums_api/activity/userPrize/getUserPrize',
    method: 'post',
    params
  })
}
/**
 * 用户获奖信息管理 单条获取
 * @param params
 * @returns {AxiosPromise}
 */
export function getOneUserPrize(params) {
  return request({
    url: '/ums_api/activity/userPrize/getOneUserPrize',
    method: 'post',
    params
  })
}
