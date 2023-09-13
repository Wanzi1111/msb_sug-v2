import request from '@/utils/request'
// 获取短信列表的业务线
export function selectDinc() {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectDinc',
      method: 'GET'
    })
  }
// 获取短信的二级分类
export function selectSmsOneTypeList(data) {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectSmsOneTypeList',
      method: 'post',
      data: { ...data }
    })
  }
  // 获取短信的三级分类
  export function selectSmsTwoTypeList(data) {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectSmsTwoTypeList',
      method: 'POST',
      data
    })
  }
  // 获取短信签名
  export function selectSmsMessageTemplateList(data) {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectSmsMessageTemplateList',
      method: 'POST',
      data
    })
  }
  // 获取短信列表
  export function selectSmsRecordList(data) {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectSmsRecordList',
      method: 'POST',
      data
    })
  }
  // 获取短信列表
  export function selectSmsScenarioConfigurationList(data) {
    return request({
      url: '/api_cs/api/sms/api/messagePlatForm/selectSmsScenarioConfigurationList',
      method: 'POST',
      data
    })
  }
  // 发送短信接口
  export function sentShortMessage(data) {
    return request({
      url: '/api_cs/v2/complaint/sentShortMessage',
      method: 'POST',
      data
    })
  }
