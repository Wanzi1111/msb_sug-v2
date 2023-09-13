/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ btnClick, command }) => {
  return [
    {
      render: (h) => {
        return h('p', { style: { float: 'left', display: 'inline-block', margin: '0 10px 10px 0', lineHeight: '36px' }}, 'render 函数')
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
    },
    {
      type: 'button', // 按钮
      label: '按钮',
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
            label: 'aa',
            attr: { // dropdown-item的attr
              // command: '',
              // disabled: '',
              // divided: '',
              // icon: ''
            }
          },
          {
            label: 'aa',
            attr: { // dropdown-item的attr
              // command: '',
              // disabled: '',
              // divided: '',
              // icon: ''
            }
          }
        ]
      }
    },
    {
      type: 'button', // 按钮
      label: '按钮',
      click: btnClick,
      attr: {
        type: 'primary'
      },
      dropdown: true, // 设置了dropdown，组件本身的事件失效
      dropdownConfig: {
        command: command,
        attr: { // dropdown的attr

        },
        item: [
          {
            label: 'aa',
            attr: { // dropdown-item的attr
              command: 'a',
              // disabled: '',
              // divided: '',
              icon: 'el-icon-info'
            }
          },
          {
            label: 'aa',
            attr: { // dropdown-item的attr
              command: 'b',
              // disabled: '',
              // divided: '',
              icon: 'el-icon-info'
            }
          }
        ]
      }
    },
    {
      type: 'button', // 按钮
      label: '按钮',
      click: btnClick,
      attr: {
        type: 'primary'
      }
    },
    {
      type: 'a', // a标签的按钮
      label: '按钮',
      click: btnClick,
      attr: {}
    },
    {
      type: 'link', // a标签的链接
      label: '链接',
      attr: {
        href: '/basics/forms',
        style: {
          color: 'blue',
          textDecoration: 'underline'
        }
      }
    },
    {
      type: 'span', // 文本
      label: '文本文本',
      attr: {
        style: {
          color: 'red'
        }
      }
    }

  ]
}

export const actions2 = () => {
  return [
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'primary',
        // type: 'info',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'success',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'info',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'warning',
        closable: false,
        showIcon: true
      }
    },
    {
      type: 'alert', // 文本
      label: '总投诉数量：9999 当日投诉总数量：9999 上周投诉总数量：9999 本周当前投诉数量：199 当前筛选投诉数量：9999',
      attr: {
        type: 'error',
        closable: false,
        showIcon: true
      }
    }
  ]
}
