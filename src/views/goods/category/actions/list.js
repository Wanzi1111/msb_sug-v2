/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ openDl }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新增一级分类',
      click: openDl,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }
  ]
}
