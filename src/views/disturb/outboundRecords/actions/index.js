
export default ({ exportDocument }) => {
    return [
        {
            type: 'button', // 按钮
            label: '导出数据',
            align: 'left',
            click: exportDocument,
            attr: {
              size: 'small',
              type: 'primary',
              icon: 'el-icon-download'
            }
          }
    ]
  }
