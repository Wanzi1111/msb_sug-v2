/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-14 11:20:58
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-15 21:40:49
 */
export default ({ addStaff, total }) => {
  return [
    {
      type: 'button', // 按钮
      label: '添加员工',
      align: 'left',
      click: addStaff,
      attr: {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-plus'
      }
    }
  ]
}
