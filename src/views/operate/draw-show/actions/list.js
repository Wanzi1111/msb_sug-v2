/**
 * @author: Liwei
 * @description:
 * @date: 2020/7/13
 */
export default ({ openDl }) => {
  return [
    {
      type: 'button', // 按钮
      label: '上传视频',
      click: openDl,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }
  ]
}
