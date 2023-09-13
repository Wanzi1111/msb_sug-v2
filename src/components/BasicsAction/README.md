
# BasicsAction

公共基础操作条使用说明

1.引入使用  
```
template
  <basics-action :actions="actions" />
script
  import BasicsAction from '@/components/BasicsAction'
  import actions from './actions/actions'

  components: { BasicsAction },
  data
    actions({function})
```
2.参数说明  
export const actions = ({ cancel, ensure }) => {
  return {
    submit: {  // 默认按钮一 确认
      hide: true // 是否显示 默认false
    },
    back: {   // 默认按钮一 返回
      hide: true
    },
    ensure: {   //自定按钮
      click: ensure,  //绑定click事件
      type: 'button', //类型
      label: '确定',  //描述
      attr: { //自定义属性
        type: 'primary'
      }
    }
  }
}
...