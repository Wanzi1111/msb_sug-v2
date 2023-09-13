/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
import { categoryList } from '@/api/goods/category'
const valiPass = (rule, value, callback) => {
  console.log(value)
  if (value && !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
    callback(new Error('请输入数字，最多支持小数点后两位'))
  } else {
    callback()
  }
}
export default [
  {
    prop: 'productName',
    label: '商品名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入商品名称',
      maxlength: 50
    },
    rules: [
      { required: true, message: '商品名称不能为空' }
    ]
  },
  {
    prop: 'type',
    label: '商品类型',
    type: 'cascader',
    attr: {
      placeholder: '请选择商品类型',
      collapseTags: true,
      props: {
        // checkStrictly: true,
        lazy: true,
        expandTrigger: 'hover',
        lazyLoad(node, resolve) {
          const { level } = node
          categoryList({
            pcode: level === 1 ? node.value : 0,
            level: level + 1,
            status: 1,
            pageAble: 'false'
          }).then(res => {
            const data = res.data || {}
            const list = data.rows || []

            const nodes = []
            list.map(item => {
              nodes.push({
                value: item.code,
                label: item.typeName,
                leaf: level === 1
              })
            })
            resolve(nodes)
          })
        }
      }
      // options: [{
      //   value: 'zhinan',
      //   label: '指南',
      //   children: [{
      //     value: 'shejiyuanze',
      //     label: '设计原则',
      //   }, {
      //     value: 'daohang',
      //     label: '导航',
      //   }]
      // }, {
      //   value: 'zhinan',
      //   label: '指南',
      //   children: [{
      //     value: 'shejiyuanze',
      //     label: '设计原则',
      //   }, {
      //     value: 'daohang',
      //     label: '导航',
      //   }]
      // }]
    },
    rules: [
      { required: true, message: '商品类型不能为空' }
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
    prop: 'marketPrice',
    slot: 'marketPrice',
    label: '市场价',
    rules: [
      { validator: valiPass, trigger: 'blur' }
    ]
  },
  {
    prop: 'costPrice',
    slot: 'costPrice',
    label: '成本价',
    rules: [
      { validator: valiPass, trigger: 'blur' }
    ]
  },
  {
    prop: 'productWeight',
    slot: 'productWeight',
    label: '重量属性',
    rules: [
      { validator: valiPass, trigger: 'blur' }
    ]
  },
  {
    prop: 'specDesc',
    label: '规格属性',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入规格属性',
      maxlength: 255
    }
  },
  {
    prop: 'note',
    label: '备注信息',
    type: 'textarea', // 输入框,
    attr: {
      autosize: { minRows: 4 },
      placeholder: '请输入备注信息',
      maxlength: 100
    }
  }
]

export const actions = ({ closeDl }) => {
  return {
    back: {
      hide: true
    },
    quit: {
      click: () => closeDl(),
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
