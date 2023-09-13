/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 14:03:24
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-09 17:21:12
 */
export default ({ createQuestion }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新建问题类型',
      align: 'right',
      click: createQuestion,
      attr: {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-add'
      }
    }
  ]
}
