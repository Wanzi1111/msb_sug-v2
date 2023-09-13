export default ({ addSug, jump }) => {
    return [
      {
        type: 'button', // 按钮
        label: '创建工单',
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
