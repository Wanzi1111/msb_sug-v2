/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ btnClick, command }) => {
  return [
    {
      type: 'button', // 按钮
      label: '新建单项',
      align: 'right',
      attr: {},
      dropdown: true, // 设置了dropdown，组件本身的事件失效
      dropdownConfig: {
        click: btnClick,
        command: command,
        attr: { // dropdown的attr
          splitButton: true,
          type: 'primary'
        },
        item: [
          {
            label: '新建多项',
            attr: { // dropdown-item的attr
              command: 'a',
              // disabled: '',
              // divided: '',
              icon: 'el-icon-tickets'
            }
          },
          {
            label: '新建其他',
            attr: { // dropdown-item的attr
              command: 'b',
              // disabled: '',
              // divided: '',
              icon: 'el-icon-document'
            }
          }
        ]
      }
    },
    {
      type: 'button', // 按钮
      label: '导出',
      click: btnClick,
      attr: {
        type: 'primary',
        icon: 'el-icon-download'
      }
    },
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    }
  ]
}
