/**
 * @author: Liwei
 * @description: 公告列表操作条配置
 * @date: 2020/1/6
 */
export default ({ add }) => {
  return [
    {
      type: 'button', // 按钮
      label: '添加文章',
      click: add,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }
  ]
}
