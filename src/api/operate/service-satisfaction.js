/**
 * @author: liuyajie
 * @description: 满意度调查
 * @date: 2020/04/21
 */
import request from '@/utils/request'
/**
 * 满意度调查表格接口
 * @param params
 * @returns {AxiosPromise}
 */
export function getGatherQuestion(params) {
  return request({
    url: '/operation/question/getGatherQuestion',
    method: 'post',
    params: params,
    timeout: 10000
  })
}

