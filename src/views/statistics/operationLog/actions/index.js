export default ({ exportOder, exportProfit }) => {
  return [
    {
      type: 'button',
      label: '下载',
      click: exportOder,
      align: 'right',
      noMargin: true,
      attr: {
        type: 'primary',
        plain: false,
        size: 'small'
      }
    }
  ]
}
