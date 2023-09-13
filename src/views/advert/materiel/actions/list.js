/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ uploadMateriel }) => {
  return [
    {
      type: 'button', // 按钮
      label: '上传物料',
      click: uploadMateriel,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-plus'
      }
    }
  ]
}
