
export default ({ addblacklist, showTabFlag }) => {
  return [
    {
      type: 'button', // 设为待处理
      label: '添加勿扰',
      align: 'left',
      click: (dat, row, index) => addblacklist(dat, row, index),
      attr: {
        size: 'small',
        type: '',
        showbtn: !showTabFlag
      }
    }
  ]
}
