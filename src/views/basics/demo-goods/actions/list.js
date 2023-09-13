/**
 * @author: Liwei
 * @description: 商品列表操作条配置
 * @date:
 */
export default ({ create, ex }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新建商品',
      click: create,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    },
    {
      type: 'button', // 按钮
      label: '导出商品',
      align: 'right',
      click: ex,
      attr: {
        type: 'primary',
        icon: 'el-icon-download'
      }
    }
  ]
}
