/**
 * @author: Liwei
 * @description:
 * @date:
 */
export default ({ edit, save }) => {
  return [
    {
      type: 'button', // 按钮
      label: '修改',
      click: edit,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-edit'
      }
    },
    {
      type: 'button', // 按钮
      label: '保存',
      click: save,
      attr: {
        type: 'primary',
        plain: true,
        icon: 'el-icon-edit'
      }
    }
  ]
}
