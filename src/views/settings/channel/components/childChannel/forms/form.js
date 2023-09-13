/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:13:40
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:55:39
 */
// 新建投诉问题或编辑投诉问题
// 新建投诉问题或编辑投诉问题
export const addComplintChannelChildrenForm = (type) => {
  return [
    {
      prop: 'businessId',
      label: '选择业务线',
      type: 'select', // 多选框,
      attr: {
        disabled: !!type
      },
      defaultVal: [],
      options: []
    },
    {
      prop: 'cpSourceType',
      label: '投诉来源',
      type: 'input', // 多选框,
      attr: {
        disabled: !!type
      }
    },
    {
      prop: 'cpSource',
      label: '投诉途径名称',
      type: 'input',
      rules: [
        { required: true, message: '请输入投诉途径' }
      ],
      attr: {
        placeholder: '请输入至少2个字符'
      }
    }
  ]
}

export const actions = ({ cancel, ensure }) => {
  return {
    submit: { // 默认按钮一
      hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    ensure: {
      click: ensure,
      type: 'button',
      label: '确定',
      attr: {
        type: 'primary'
      }
    },
    cancel: {
      click: cancel,
      type: 'button',
      label: '取消'
    }
  }
}
