/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ exports, imports }) => {
  return [
    {
      type: 'button', // 按钮
      label: '导入',
      align: 'right',
      click: imports,
      attr: {
        // type: 'primary',
        icon: 'el-icon-upload2'
      }
    },
    {
      type: 'button', // 按钮
      label: '导出',
      align: 'right',
      click: exports,
      attr: {
        type: 'primary',
        icon: 'el-icon-download'
      }
    }
  ]
}
