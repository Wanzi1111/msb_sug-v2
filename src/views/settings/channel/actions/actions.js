/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 14:03:24
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 11:07:52
 */
export default ({ createChannel }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新建投诉来源',
      align: 'right',
      click: createChannel,
      attr: {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-add'
      }
    }
  ]
}
