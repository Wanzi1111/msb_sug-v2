/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-03 20:54:14
 */
// const idsRule = (rule, value, callback) => {
//   if (!value.length) {
//     callback(new Error('请至少选择一个广告位'))
//   } else {
//     callback()
//   }
// }
export default [
  {
    prop: 'resourceName',
    type: 'input',
    attr: {
      placeholder: '文本描述',
      maxlength: 20,
      showWordLimit: true,
      style: {
        minWidth: '200px'
      }
    },
    rules: [
      { required: true, message: '文本描述不能为空' }
    ]
  },
  {
    prop: 'resourceLength',
    type: 'inputNum',
    inline: true,
    attr: {
      placeholder: '长度',
      style: {
        minWidth: '100px'
      }
    },
    rules: [
      { required: true, message: '长度不能为空' },
      { type: 'number', message: '长度必须为数字值' }
    ]
  },
  {
    prop: 'resourceWidth',
    type: 'inputNum',
    inline: true,
    attr: {
      placeholder: '宽度',
      style: {
        minWidth: '100px'
      }
    },
    rules: [
      { required: true, message: '宽度不能为空' },
      { type: 'number', message: '宽度必须为数字值' }
    ]
  }
]

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
