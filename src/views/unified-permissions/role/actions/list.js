/**
 * @author: huzhifu
 * @description:
 * @date: 2020/5/11
 */
export default ({ create }) => {
  return [
    {
      type: 'button', // 按钮
      label: '添加角色',
      click: create,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }

  ]
}
