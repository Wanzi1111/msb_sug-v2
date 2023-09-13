/**
 * @author: Liwei
 * @description: 全国区域信息查询
 * @date: 2020/6/4
 */
import request from '@/utils/request'

/**
 * 查询所有的省市县三级数据
 * @param data
 * @returns {AxiosPromise}
 */
export function queryAll(data) {
  return request({
    url: '/logistics/national/queryAll',
    method: 'POST',
    data,
    timeout: 10000
  })
}

/**
 * 根据编码查询下一级
 * @param data
 * @returns {AxiosPromise}
 */
export function queryByParam(data) {
  return request({
    url: '/logistics/national/queryByParam',
    method: 'POST',
    data
  })
}
