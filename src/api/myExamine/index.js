import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 用来获取审批列表的必传参数
export function findStaffByMobile(params) {
  return request({
    url: '/api_cs/api/b/v1/staff/findStaffByMobile',
    method: 'get',
    params: params
  })
}
// 全部审批单
export function showAllList(params) {
  return request({
    url: '/api_cs/api/b/v1/approval2/list/showAll',
    method: 'get',
    params: params
  })
}
// 待我审批
export function pendingList(params) {
  return request({
    url: '/api_cs/api/b/v1/approval2/list/pending',
    method: 'get',
    params: params
  })
}
// 我发起的
export function applyList(params) {
  return request({
    url: '/api_cs/api/b/v1/approval2/list/apply',
    method: 'get',
    params: params
  })
}
// 我已审批
export function completedList(params) {
  return request({
    url: '/api_cs/api/b/v1/approval2/list/completed',
    method: 'get',
    params: params
  })
}
// 获取解密后的手机号
export function queryUserMobile(params) {
  return request({
    url: '/api_cs/api/u/v1/user/userManner/queryUserMobile',
    method: 'get',
    params: params
  })
}
// 退款详情信息
export function getFlowDetail(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/refund/detail/get',
    method: 'get',
    params: params
  })
}
// 退款审批节点中止按钮操作
export function updateAutoApprovalTime(data) {
  return request({
    url: '/api_cs/api/b/v1/backend/flowApprovalLinkedRelation/updateAutoApprovalTime',
    method: 'post',
    data: { ...data }
  })
}
// 退款审批节点中止按钮状态
export function flowApprovalLinkedRelation(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/flowApprovalLinkedRelation/findCurrApprovalUserIds',
    method: 'get',
    params: params
  })
}
// 获取审批节点的表格
export function getFlowDetailNodeTable(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/flowApprovalLinkedRelation/findLinkedListByFlowApprovalIdForBoss',
    method: 'get',
    params: params
  })
}
// 退款抽屉-标签类型更改
export function diologRefundTagChange(data) {
  return request({
    url: '/api_cs/api/b/v1/backend/flowApproval/updateTag',
    method: 'post',
    data: { ...data }
  })
}
// 退款审批获取挽留单子的flow tags
export function getTagsFangTao(params) {
  return request({
    url: '/api_cs/api/toss/v1/toss-api/label/getMarketingLabelInfo',
    method: 'get',
    params: params
  })
}
// 补发货详情信息
export function getReplenishDetail(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/reissue/flow/info',
    method: 'get',
    params: params
  })
}
// 撤销审批接口
export function getReplenishReset(data) {
  return request({
    url: '/api_cs/approval/revocation',
    method: 'post',
    data: { ...data, operationName: getToken('cname'), operationMobile: getToken('userMobile'), operationId: getToken('userId') }
  })
}
  // 审批拒绝、同意接口
  export function isAggrePass(data) {
    return request({
      url: '/api_cs/approval/reissue',
      method: 'post',
      data: {
        ...data,
        staffName: data.realName,
        isRecover: data.isRecover,
        version: data.version ? data.version : '',
        operationName: getToken('cname'),
        operationMobile: getToken('userMobile'),
        operationId: getToken('userId')
      }
    })
  }
// 获取期数
export function getPeriods(data) {
  return request({
    url: '/api_cs/graphql/v1/toss',
    method: 'post',
    data: { ...data }
  })
}
// 获取全部部门
export function getDepartmentList(params) {
  return request({
    url: '/api_cs/api/t/v2/department/getDepartmentTree',
    method: 'get',
    params: params
  })
}
 // 根据选择的部门ID获取老师ID
 export function getDepartmentTeacher(query = '', size = 10000, isParttimeTeacher = false, subjectCode = 'ART_APP') {
  const obj = JSON.parse(query || '{}')
  Object.assign(obj, {
    'subject.like': { 'subject.keyword': `*${subjectCode}*` }
  })
  isParttimeTeacher && Object.assign(obj, { duty_id: ['2', '3', '4'] })
  return request({
    url: '/api_cs/graphql/v1/toss',
    method: 'post',
    data: {
      query: `{
        TeacherList(query: ${JSON.stringify(
          JSON.stringify(obj)
        )}, size: ${size}){
          id
          realname
        }
      }`
    }
  })
}
// 获取全部老师
export function getDepartmentTeacherEx(data) {
  return request({
    url: '/api_cs/graphql/v1/toss',
    method: 'post',
    data: { ...data }
  })
}
// 获取版本号
export function getCourseVersion(params) {
  return request({
    url: '/api_cs/api/s/v1/data/dictionary/byType',
    method: 'get',
    params: params
  })
}
// // 获取员工信息
// export function findStaffByMobile(params) {
//   return request({
//     url: '/api_cs/api/b/v1/staff/findStaffByMobile',
//     method: 'get',
//     params: params
//   })
// }
// 获取角标数据
export function getAllCount(params) {
  return request({
    url: '/api_cs/api/b/v1/approval2/allCount',
    method: 'get',
    params: params
  })
}
// 随材打包审批详情
export function getPackageInfo(params) {
  return request({
    url: '/api_cs/api/b/v1/backend//v1/backend/packagebox/flow/info',
    method: 'get',
    params: params
  })
}
  // 订单转入审批详情
export function entryOrderDetail(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/changecustomerimport/flow/info',
    method: 'get',
    params: params
  })
}
  // 学员转班详情信息
export function getFlowDetailConcept(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/changecustomer/flow/info',
    method: 'get',
    params: params
  })
}
  // 商城物流撤单详情
export function getFlowAfermarketDetail(params) {
  return request({
    url: '/api_cs/api/b/v1/backend/apply/goldCoinMall/info',
    method: 'get',
    params: params
  })
}

// 是否可以进行赔付审批
export function getCompensateCheck(params) {
  return request({
    url: '/api_cs/v1/agg/compensate/check',
    method: 'get',
    params: params
  })
}
// 获取赔付审批的关联单号
export function getCompensateOrderList(params) {
  return request({
    url: '/api_cs/v1/agg/compensate/orderList',
    method: 'get',
    params: params
  })
}
// 获取赔付关联单号根据地址id查询详细地址
export function getAddressById(params) {
  return request({
    url: '/api_cs/v1/agg/compensate/address/byId',
    method: 'get',
    params: params
  })
}
// 创建赔付审批单
export function createClaimsUrl(data) {
  return request({
    url: '/api_cs/v1/complaint/approval/create',
    method: 'post',
    data: { ...data }
  })
}
// 赔付审批单的商品列表
export function getCompensateProducts(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/getCompensateProducts',
    method: 'get',
    params: params
  })
}
// 赔付审批单的订单地址列表
export function getUserAddress(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/getUserAddress',
    method: 'get',
    params: params
  })
}
// 赔付场景和赔付原因
export function getScene(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/getScene',
    method: 'get',
    params: params
  })
}
// 赔付列表&赔付历史详情
export function getClaimsList(data) {
  return request({
    url: '/api_cs/v1/complaint/approval/getList',
    method: 'post',
    data: { ...data }
  })
}
// 获取申请人下拉数据
export function getApprovalAllStaff() {
  return request({
    url: '/api_cs/v1/complaint/approval/getAllStaff',
    method: 'get'
  })
}
// 赔付审批撤销
export function setRevoke(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/revoke',
    method: 'post',
    params: params
  })
}
// 获取赔付单详情数据
export function getDetailInfo(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/getDetailInfo',
    method: 'get',
    params: params
  })
}
// 赔付单人工审批
export function manualClaims(data) {
  return request({
    url: '/api_cs/v1/complaint/approval/manual',
    method: 'post',
    data: { ...data }
  })
}
// 获取赔付列表未读数量
export function getCount(data) {
  return request({
    url: '/api_cs/v1/complaint/approval/getCount',
    method: 'post',
    data: { ...data }
  })
}
// 超出七天不可编辑
export function checkEdit(params) {
  return request({
    url: '/api_cs/v1/complaint/approval/checkEdit',
    method: 'get',
    params: params
  })
}
