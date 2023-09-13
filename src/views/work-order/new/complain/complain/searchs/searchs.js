/*
 * @Author: shasen
 * @Date: 2020-01-06 19:12:36
 * @Last Modified by: shasen
 * @Last Modified time: 2020-02-06 12:39:09
 */

export default [
  {
    prop: 'complaintUser',
    label: '投诉用户',
    type: 'select', // 选择器,
    attr: {
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'userFlowStatus',
    label: '用户类型',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'complaintType',
    label: '投诉类型',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  /* {
    prop: 'operationStatus',
    label: '处理进度',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  }, */
  {
    prop: 'entrySource',
    label: '投诉来源',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      placeholder: '全部'
    },
    options: []
  },
  {
    prop: 'complaintTime',
    label: '投诉时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    actions: {}
  },
  {
    prop: 'userName',
    label: '用户昵称',
    type: 'input',
    attr: {
      placeholder: '请输入用户昵称'
    }
  }
]

