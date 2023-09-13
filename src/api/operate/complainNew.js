/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-08 15:37:37
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 14:18:27
 */
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
// import qs from 'qs'

// 获取客服平台列表
export function getComplaintList(data) {
  return request({
    url: '/api_cs/v2/complaint/getComplaint',
    method: 'post',
    data: data
  })
}

// 创建投诉单
export function createComplaint(data) {
  return request({
    url: '/api_cs/v2/complaint/createComplaint',
    method: 'post',
    data: data
  })
}

// 立即处理 关闭投诉 设为无效 回访
export function acceptComplaint(data) {
  return request({
    url: '/api_cs/v2/complaint/acceptComplaint',
    method: 'post',
    data: data
  })
}

// 新售后的 立即处理
export function afterAcceptComplaint(data) {
  return request({
    url: '/api_cs/afterSaleOp/acceptComplaint',
    method: 'post',
    data: data
  })
}

// 获取投诉来源 投诉途径
export function getBypid(params) {
  return request({
    url: '/api_cs/channel/getBypid',
    method: 'get',
    params: params
  })
}

// 问题分类接口
export function getProblemChannelId(params) {
  return request({
    url: '/api_cs/problem/getByChannelId',
    method: 'get',
    params: params
  })
}

// 修改类型
export function modifyProblemType(data) {
  return request({
    url: '/api_cs/v2/complaint/modifyProblemType',
    method: 'post',
    data: data
  })
}
// 修改渠道来源
export function updateSourceProblem(data) {
  return request({
    url: '/api_cs/v2/complaint/updateSourceProblem',
    method: 'post',
    data: data
  })
}
// 修改售后类型
export function updateSourceProblemV2(data) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/updateSourceProblemV2',
    method: 'post',
    data: data
  })
}
// 下载数据
export function exportSug(params) {
  return request({
    url: '/api_cs/v2/complaint/downloadComplaintList',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') },
    responseType: 'blob'
  })
}
// 投诉单详情
export function complaintInfo(params) {
  return request({
    url: '/api_cs/v2/complaint/complaintInfo',
    method: 'post',
    params: params
  })
}

// 投诉问题
export function complaintRecords(params) {
  return request({
    url: '/api_cs/v2/complaint/complaintRecords',
    method: 'post',
    params: params
  })
}

// 立即处理（第一次进详情页面操作）
export function acceptFirstRecord(params) {
  return request({
    url: '/api_cs/v2/complaint/acceptFirstRecord',
    method: 'post',
    params: params
  })
}
// 修改操作人
export function modifyProblemAccept(data) {
  return request({
    url: '/api_cs/v2/complaint/modifyProblemAccept',
    method: 'post',
    data: data
  })
}
// 批量修改操作人
export function modifyProblemAcceptBatch(params) {
  return request({
    url: '/api_cs/v2/complaint/modifyProblemAcceptBatch',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 批量处理 关闭 无效 回访
export function acceptComplaintBatch(data) {
  return request({
    url: '/api_cs/v2/complaint/acceptComplaintBatch',
    method: 'post',
    data: data
  })
}
// 批量修改类型
export function modifyProblemTypeBatch(params) {
  return request({
    url: '/api_cs/v2/complaint/modifyProblemTypeBatch',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 批量待处理
export function invalidToUnaccecptBatch(params) {
  return request({
    url: '/api_cs/v2/complaint/invalidToUnaccecptBatch',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 添加或编辑备注内容
export function modifyComplaintRemark(params) {
  return request({
    url: '/api_cs/v2/complaint/modifyComplaintRemark',
    method: 'post',
    params: params
  })
}
// 修改投诉内容
export function updateRecordsCpComent(params) {
  return request({
    url: '/api_cs/v2/complaint/updateRecordsCpComent',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 转处理
export function transferProcessing(params) {
  return request({
    url: '/api_cs/v2/complaint/turnBusinessHandle',
    method: 'post',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile') }
  })
}
// 修改无效为待处理
export function invalidToUnaccecpt(params) {
  return request({
    url: '/api_cs/v2/complaint/invalidToUnaccecpt',
    method: 'post',
    params: params
  })
}
// 获取问题分类属性
export function getChannelIdTree(params) {
  return request({
    url: '/api_cs/problem/tree',
    method: 'get',
    params: params
  })
}
// 设置优先级
export function updatePriority(data) {
  return request({
    url: '/api_cs/v2/complaint/updatePriority',
    method: 'post',
    data
  })
}
/**
 * 查用户GET /api/u/v2/user/getUser?userId=483367141610098688&subject=ART_APP
 * @param data
 * @returns {AxiosPromise}
 */
export function getUserByUserNum(params) {
  return request({
    url: '/api_cs/api/u/v2/user/getUserByUserNum',
    method: 'get',
    params: params
  })
}

// 获取 是否有超时未处理
export function getJudgeOverTime(data) {
  return request({
    url: '/api_cs/v2/complaint/judgeOverTime',
    method: 'post',
    data
  })
}

// 查看客服通话记录
export function getCallRecord(params) {
  return request({
    url: '/api_cs/v2/complaint/getCallRecord',
    method: 'post',
    params
  })
}
// 详情添加勿扰生成处理记录
export function addOrUpdateObNotDisturbNew(data) {
  return request({
    url: '/api_cs/v2/complaint/addOrUpdateObNotDisturbNew',
    method: 'post',
    data: { ...data }
  })
}
// 获取流程是否转教辅
export function checkTeachingAids(params) {
  return request({
    url: '/api_cs/v2/complaint/checkTeachingAids',
    method: 'get',
    params: params
  })
}
// 列表前面的小彩旗调用接口
export function updateFlagSign(params) {
  return request({
    url: '/api_cs/v2/complaint/updateFlagSign',
    method: 'get',
    params: { ...params, operationName: getToken('cname'), operationMobile: getToken('userMobile'), operationId: getToken('userId') }
  })
}
// 获取快递公司
export function getLogisticsCompany() {
  return request({
    url: '/api_cs/afterSaleOp/getLogisticsCompany',
    method: 'get'
  })
}
// 修改或保存快递公司和单号
export function updateLogistics(data) {
  return request({
    url: '/api_cs/afterSaleOp/updateLogistics',
    method: 'post',
    data
  })
}
// 详情发表评论
export function afterSaleRemark(data) {
  return request({
    url: '/api_cs/afterSaleOp/afterSaleRemark',
    method: 'post',
    data: data
  })
}
// 	用户撤销新售后工单
export function revokeOpAfterSale(params) {
  return request({
    url: '/api_cs/afterSaleOp/revokeOpAfterSale',
    method: 'get',
    params: params
  })
}
// 获取售后问题
export function getAfterSaleProblem(params) {
  return request({
    url: '/api_cs/afterSaleOp/getAfterSaleProblem',
    method: 'get',
    params: params
  })
}
// 新获取售后问题
export function newGetAfterSaleProblem(data) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/getAfterSaleProblem',
    method: 'post',
    data: data
  })
}
// 获取小熊的长id
export function getLongUserId(params) {
  return request({
    url: '/api_cs/v2/complaint/getLongUserId',
    method: 'get',
    params: params
  })
}
// 投诉转售后1v1/小熊/积分商城关联订单获取
export function getAllOrderList(params) {
  return request({
    url: '/api_cs/agg/autoAfterSale/order/list',
    method: 'get',
    params: params
  })
}
// 根据业务线物流id
export function getCenterExpressId(params) {
  return request({
    url: '/api_cs/agg/autoAfterSale/centerExpressId',
    method: 'get',
    params: params
  })
}
// 新售后退款审批问题
export function bearRefundApproval(params) {
  return request({
    url: '/api_cs/afterSaleOp/bearRefundApproval',
    method: 'get',
    params: params
  })
}
// 	退回商品
export function feedbackProcessing(params) {
  return request({
    url: '/api_cs/afterSaleOp/feedbackProcessing',
    method: 'get',
    params: params
  })
}
// 详情子状态所有的枚举值
export function getComplaintStatusEumDtoEnum() {
  return request({
    url: '/api_cs/eum/getComplaintStatusEumDtoEnum',
    method: 'get'
  })
}
// 获取审批历史
export function getApprovalData(params) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/getApprovalData',
    method: 'get',
    params: params
  })
}
// 获取售后历史次数列表
export function getAfterSaleHistory(params) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/afterSaleHistory',
    method: 'get',
    params: params
  })
}
// 详情底部售后操作审批
export function handleAfterSale(data) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/handleAfterSale',
    method: 'post',
    data: data
  })
}
// 修改物流单号（新新售后）
export function updateLogisticsV2(data) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/updateLogisticsV2',
    method: 'post',
    data: data
  })
}
// 获取新新售后流程节点
export function checkAfterSaleNode(params) {
  return request({
    url: '/api_cs/op/afterSaleOpV2/checkAfterSaleNode',
    method: 'get',
    params: params
  })
}
// 获取售后&赔付当前地址是否可以发货
export function checkSaleRegion(data) {
  return request({
    url: '/api_cs/v2/complaint/checkSaleRegion',
    method: 'post',
    data: data
  })
}
