/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 15:44:14
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:56:16
 */
// 新建问题分类或编辑问题分类
export const addChannelForm = (type) => {
  const conf = [
    {
      prop: 'businessId',
      label: '选择业务线',
      type: 'select', // 多选框,
      attr: {
        disabled: !!type
      },
      rules: [
        { required: true, message: '请选择业务线' }
      ],
      defaultVal: [],
      options: []
    },
    {
      prop: 'cpSource',
      label: '投诉来源名称',
      type: 'input',
      attr: {
        placeholder: '请输入至少5个字符'
      },
      rules: [
        { required: true, message: '请输入至少5个字符' },
        { min: 5, message: '请输入至少5个字符' }
      ]
    }
  ]
  return conf
}

// 新建投诉问题或编辑投诉问题
export const addComplintChannelForm = (type) => {
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
