/**
 * @author: Liwei
 * @description: 新建商品表单配置
 * @date:
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
      placement: 'left'
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

  }
}
