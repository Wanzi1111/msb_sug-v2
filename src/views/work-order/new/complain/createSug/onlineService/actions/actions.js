/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-14 11:20:58
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-11 16:34:44
 */
export default ({ addSug, jump }) => {
  return [
    {
      type: 'button', // 按钮
      label: '创建投诉',
      align: 'left',
      click: addSug,
      attr: {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-plus'
      }
    },
    {
      type: 'button', // 按钮
      label: '批量导入投诉单',
      click: jump,
      attr: {
        size: 'small',
        type: 'primary',
        // plain: true,
        icon: 'el-icon-finished'
      }
    }
  ]
}
