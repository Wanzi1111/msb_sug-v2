/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ add }) => {
  return [
    {
      type: 'button', // 按钮
      label: '上传活动奖品',
      align: 'right',
      click: () => add(),
      attr: {
        type: 'primary'
      }
    }
  ]
}
