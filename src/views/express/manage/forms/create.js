/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
import { queryByParam } from '@/api/express/national'

export default [
  {
    render: (h, form) => {
      return h('div', [
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, '选择要发的商品')
      ])
    }
  },
  {
    prop: 'channelCode',
    type: 'hidden',
    defaultVal: 'Y10000001'
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
  },
  {
    render: (h, form) => {
      return h('div', [
        h('div', { style: { height: '1px', width: '100%', backgroundColor: '#efefef', margin: '20px 0' }}),
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, '选择要发的用户')
      ])
    }
  },
  {
    prop: 'consigneeName',
    label: '收件人',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入收件人',
      maxlength: 20
    },
    rules: [
      { required: true, message: '收件人不能为空' }
    ]
  },
  {
    prop: 'consigneeMobile',
    label: '手机号',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入手机号',
      maxlength: 20
    },
    rules: [
      { required: true, message: '手机号不能为空' }
    ]
  },
  {
    prop: 'city',
    label: '省市区',
    type: 'cascader', // 级联选择器,
    attr: {
      options: [],
      placeholder: '请选择省市区',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.level < 3 || (node.data && node.data.noLoad)) {
            resolve()
            return
          }
          queryByParam({
            code: node.data.code,
            level: 3
          }).then(res => {
            const data = res.data || {}
            const nodes = []
            data.map(item => {
              nodes.push({
                code: item.townCode,
                value: `${item.townName},${item.townCode}`,
                label: item.townName,
                leaf: true
              })
            })
            resolve(nodes)
          })
        }
      }
    },
    rules: [
      { required: true, message: '省市区不能为空' }
    ]
  },
  {
    prop: 'consigneeAddress',
    label: '详细地址',
    type: 'textarea', // 输入框,
    attr: {
      autosize: { minRows: 4 },
      placeholder: '请输入详细地址',
      maxlength: 200
    },
    rules: [
      { required: true, message: '详细地址不能为空' }
    ]
  }
]

export const actions = isEdit => {
  return {
    submit: {
      label: isEdit ? '修改' : '立即创建'
    },
    back: {
      label: '返回'
    }
  }
}
