/*
 * @Author: shasen
 * @Date: 2020-01-07 11:41:20
 * @Last Modified by: shasen
 * @Last Modified time: 2020-02-05 13:56:27
 */

export default [
  {
    prop: 'complaintType',
    label: '投诉类型',
    type: 'select', // 选择器,
    defaultVal: '',
    options: []
  },
  {
    prop: 'recordDetails',
    label: '被投诉人',
    type: 'select', // 选择器,
    defaultVal: '',
    note: true,
    noteConfig: {
      type: 'text',
      text: '请与客户确认投诉人姓名',
      placement: 'left'
    },
    options: []
  },
  {
    prop: 'detailContent',
    label: '回访备注',
    type: 'textarea', // 输入框,
    attr: {
      maxlength: 800
    }
  },
  {
    prop: 'checkbox1',
    label: '有效性',
    type: 'checkbox', // 多选框,
    defaultVal: [],
    options: [
      {
        label: '无效投诉',
        value: 'a'
      }
    ]
  },
  {
    prop: 'teacherComplaintsTypeLabel',
    label: '投诉分类',
    type: 'checkbox', // 多选框,
    defaultVal: [],
    options: []
  }
]

export const actions = ({ visitAction }) => {
  return {
    submit: {
      label: '已解决',
      hide: true
    },
    reset: {
      hide: true
    },
    back: {
      hide: true
    },
    quit: {
      hide: true
    },
    resolved: {
      label: '已解决',
      click: e => visitAction(e, 2),
      type: 'button',
      attr: {
        type: 'success',
        icon: 'el-icon-check',
        loading: '_operation_complaints_addRecord'
      }
    },
    keepon: {
      label: '继续跟踪',
      click: e => visitAction(e, 1),
      type: 'button',
      attr: {
        type: 'primary',
        icon: 'el-icon-right',
        loading: '_operation_complaints_addRecord'
      }
    },
    invalid: {
      label: '确认无效',
      click: e => visitAction(e, 3),
      type: 'button',
      attr: {
        type: 'danger',
        icon: 'el-icon-close',
        loading: '_operation_complaints_addRecord'
      }
    }
  }
}
