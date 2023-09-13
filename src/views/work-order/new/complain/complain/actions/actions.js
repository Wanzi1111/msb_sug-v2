/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-16 19:08:33
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 15:04:51
 */
/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ exportDocument, complaintsNumbers, total }) => {
  return [
    {
      type: 'alert', // 文本
      label: `总投诉数量: ${complaintsNumbers.totalNumbers}  上周投诉总数量: ${complaintsNumbers.lastWeekNumbers}  本周当前投诉数量: ${complaintsNumbers.weekNumbers}  当日投诉总数量: ${complaintsNumbers.todayNumbers}  当前筛选投诉数量: ${total}`,
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'button', // 按钮
      label: '下载数据',
      align: 'right',
      click: exportDocument,
      attr: {
        type: 'primary',
        icon: 'el-icon-download'
      }
    }
  ]
}
