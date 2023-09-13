/**
 * @author: Liwei
 * @description: 公告
 * @date: 2020/1/9
 */
import request from '@/utils/request'

/**
 * 列表
 * @param params
 * @returns {AxiosPromise}
 */
export function articleList(params) {
  return request({
    url: '/operation/announcement/listAnnouncement',
    method: 'post',
    params: params
  })
}

/**
 * 创建、修改公告
 * @param data
 * @returns {AxiosPromise}
 */
export function createArticle(data) {
  return request({
    url: '/operation/announcement/addAnnouncement',
    method: 'post',
    data: data
  })
}

/**
 * 隐藏显示
 * @param data
 * @returns {AxiosPromise}
 */
export function updateShowAndHide(data) {
  return request({
    url: '/operation/announcement/updateShowAndHide',
    method: 'post',
    data: data
  })
}
