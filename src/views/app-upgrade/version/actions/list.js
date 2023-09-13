/**
 * @author: Liwei
 * @description:
 * @date: 2020/3/9
 */
export default ({ create }) => {
  return [
    {
      type: 'button', // 按钮
      label: '添加版本',
      click: create,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }

  ]
}
