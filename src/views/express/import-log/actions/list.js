/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */

export default ({ jump }) => {
  return [
    {
      type: 'button', // 按钮
      label: '批量导入物流单',
      click: () => jump('ExpressManageBatch'),
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-finished'
      }
    }
  ]
}
