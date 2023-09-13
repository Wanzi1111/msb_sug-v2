/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ create }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新建广告位',
      click: create,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }

  ]
}
