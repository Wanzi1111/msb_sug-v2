/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'input',
    label: '输入框',
    type: 'input', // 输入框,
    defaultVal: 11,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明',
      icon: 'el-icon-star-on',
      placement: 'left',
      style: 'primary'
    },
    rules: [
      { required: true, message: '年龄不能为空' }
    ]
  },
  {
    prop: 'input2',
    label: '输入框2',
    type: 'input' // 输入框,
  }
]

export const actions = ({ quit }) => {
  return {
    reset: {
      hide: true
    },
    back: {
      hide: true
    },
    quit: {
      label: '退出',
      click: quit,
      type: 'button'
    }
  }
}
