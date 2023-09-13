/**
 * @author: Liwei
 * @description: 文件上传
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 导出待回填数据
 * @param params
 * @returns {AxiosPromise}
 */
export function exportBackFillData(params) {
  return request({
    url: '/logistics/manage/exportBackFillData',
    method: 'GET',
    params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
/**
 * 导出批量创建物流单结果
 * @param params
 * @returns {AxiosPromise}
 */
export function exportRecord(params) {
  return request({
    url: '/logistics/manage/exportRecord',
    method: 'GET',
    params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
/**
 * 导出物流单创建模版
 * @param params
 * @returns {AxiosPromise}
 */
export function exportTemplate(params) {
  return request({
    url: '/logistics/manage/exportTemplate',
    method: 'GET',
    params,
    responseType: 'blob' // 导出文件必添加、不然request会报错
  })
}
/**
 * 批量回填快递单
 * @param data
 * @returns {AxiosPromise}
 */
export function importBackFillData({ file, onUploadProgress }) {
  console.log(file, onUploadProgress)
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/logistics/manage/importBackFillData',
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
 * 批量创建物流单
 * @param data
 * @returns {AxiosPromise}
 */
export function importCreateOrder({ file, onUploadProgress }) {
  console.log(file, onUploadProgress)
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/logistics/manage/importCreateOrder',
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
 * 统计导入记录
 * @param data
 * @returns {AxiosPromise}
 */
export function queryRecord(data) {
  return request({
    url: '/logistics/manage/queryRecord',
    method: 'POST',
    data
  })
}
