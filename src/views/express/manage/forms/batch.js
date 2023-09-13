/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export default [
  {
    render: (h, form) => {
      return h('div', [
        // h('div', {style: {height: '1px', width: '100%', backgroundColor: '#efefef', margin: '20px 0'}}),
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, '选择要发的商品')
      ])
    }
  },
  {
    prop: 'goods',
    label: '商品',
    slot: 'goods',
    rules: [
      { required: true, message: '商品不能为空' }
    ]
  },
  {
    render: (h, form) => {
      return h('div', [
        h('div', { style: { height: '1px', width: '100%', backgroundColor: '#efefef', margin: '20px 0' }}),
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, '选择发货方式')
      ])
    }
  },
  {
    prop: 'supplierDelivery',
    label: '发货方式',
    type: 'select',
    attr: {
      placeholder: '请选择发货方式'
    },
    defaultVal: 1,
    options: [
      {
        label: '仓储发货',
        value: 1
      },
      {
        label: '线下发货',
        value: 2
      }
    ],
    rules: [
      { required: true, message: '发货方式不能为空' }
    ]
  },
  {
    prop: 'businessCode',
    label: '业务线',
    type: 'select',
    attr: {
      placeholder: '请选择业务线'
    },
    options: [],
    rules: [
      { required: true, message: '业务线不能为空' }
    ]
  },
  {
    prop: 'supplierId',
    label: '承运商',
    type: 'select',
    attr: {
      placeholder: '请选择承运商'
    },
    options: []
  }
]

export const actions = ({ closeDl }) => {
  return {
    submit: {
      label: '下载模板',
      attr: {
        icon: 'el-icon-download'
      }
    },
    back: {
      hide: true
    },
    quit: {
      type: 'button',
      label: '返回',
      click: closeDl,
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
//
// export default [
//   {
//     prop: 'resourceName',
//     label: 'xx',
//     type: 'input', // 输入框,
//     defaultVal: '',
//     attr: {
//       placeholder: '请输入物料名称'
//     },
//    1, max: 20, message: '长度不超过20个字符' }
//     ]
//   },
//   {
//     prop: 'resourceSize',
//     label: 'xx',
//     type: 'radio', // 单选框,
//     options: [],
//
//   },
//   {
//     prop: 'type',
//     label: 'xx',
//     type: 'radio', // 单选框,
//     defaultVal: '0',
//     options: [
//       {
//         label: '图片',
//         value: '0'
//       },
//       {
//         label: '视频',
//         value: '1'
//       }
//     ],
//
//   },
//   {
//     prop: 'otherUrl',
//     label: 'xx',
//     type: 'input', // 输入框,
//     defaultVal: '',
//     attr: {
//       placeholder: '请输入外链地址'
//     }
//   }
// ]
//
// export const actions = ({ ret }) => {
//   return {
//     submit: {
//       label: '立即创建'
//     },
//     back: {
//       hide: true,
//       label: '取消'
//     },
//     jump: { // 默认按钮一
//       click: () => {}, // 事件 类型为button、a必传
//       type: 'button', // 类型 必传 button、a、link
//       label: '跳过，只上传正常数据', // label
//       attr: { // 组件属性，设置的属性将全部绑定到组件上
//         // type: "primary",
//         icon: 'el-icon-check'
//       }
//     },
//     ex: { // 默认按钮一
//       click: () => {}, // 事件 类型为button、a必传
//       type: 'button', // 类型 必传 button、a、link
//       label: '导出文件', // label
//       attr: { // 组件属性，设置的属性将全部绑定到组件上
//         type: 'primary',
//         plain: true,
//         icon: 'el-icon-download'
//       }
//     },
//     ret: {
//       click: ret, // 事件 类型为button、a必传
//       type: 'button', // 类型 必传 button、a、link
//       label: '返回', // label
//       attr: { // 组件属性，设置的属性将全部绑定到组件上
//         // type: "primary",
//         icon: 'el-icon-back'
//       }
//     }
//   }
// }
