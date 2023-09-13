/**
 * @author: Liwei
 * @description:
 * @date: 2020/3/9
 */
export default ({ create }) => {
  return [
    {
      type: 'button', // 按钮
      label: '发布新升级',
      click: create,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }

  ]
}
