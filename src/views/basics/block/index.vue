<template>
  <div>
    <div class="title-container">
      <basics-block title="标题容器" line />
    </div>

    <div class="app-container">
      <basics-block title="标题一">
        默认下边线
      </basics-block>
    </div>

    <div class="title-container">
      <basics-block title="标题二">
        外层套用title-container
      </basics-block>
    </div>

    <div class="app-container">
      <basics-block title="标题三" line>
        不要线
      </basics-block>
    </div>

    <div class="app-container">
      <basics-block title="标题四" line="top">
        上边线
      </basics-block>
    </div>

    <div class="app-container">
      <basics-block title="标题五" :actions="actions">
        支持设置actions，渲染BasicsAction块
      </basics-block>
    </div>

  </div>
</template>

<script>
import BasicsBlock from '@/components/BasicsBlock'

export default {
  name: 'BasicsBlocks',
  components: { BasicsBlock },
  data() {
    return {
      actions: [
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
            click: this.btnClick,
            command: this.command,
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
          click: this.btnClick,
          attr: {
            type: 'primary'
          },
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            command: this.command,
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
          click: this.btnClick,
          attr: {
            type: 'primary'
          }
        },
        {
          type: 'a', // a标签的按钮
          label: '按钮',
          click: this.btnClick,
          attr: {}
        },
        {
          type: 'link', // a标签的链接
          label: '链接',
          attr: {
            href: '/#/basics/forms',
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
  },
  methods: {
    btnClick() {},
    command() {}
  }
}
</script>

