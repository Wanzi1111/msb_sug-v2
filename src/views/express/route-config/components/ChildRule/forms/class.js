/**
 * @author: hzf
 * @description: 表单配置
 * @date: 2020/7/21
 */
import { houseListApi } from '@/api/goods/manage'

const validateName = (rule, value, callback) => {
  if (value.length < 10 || value.length > 51) {
    callback(new Error('路由规则名称10~50个字符'))
  } else {
    callback()
  }
}

export default [
  {
    prop: 'desp',
    slot: 'desp'
  },
  {
    prop: 'routName',
    label: '路由规则名',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入路由规则名',
      style: {
        width: '380px'
      }
    },
    rules: [
      { required: true, message: '路由规则名不能为空' },
      { required: true, trigger: 'blur', validator: validateName }
    ]
  },
  {
    prop: 'appointSupplier',
    label: '发货条件',
    type: 'select', // 选择器,
    attr: {
      placeholder: '请选择发货条件',
      clearable: true,
      style: {
        width: '380px'
      }
    },
    options: [
      { label: '不指定承运商', value: 0 },
      { label: '指定承运商', value: 1 }
    ],
    rules: [
      { required: true, message: '发货条件不能为空' }
    ]
  },
  {
    prop: 'city',
    label: '配送区域',
    slot: 'city',
    rules: [
      { required: true, message: '配送区域不能为空' }
    ]
    // type: 'cascader', // 级联选择器,
    // attr: {
    //   clearable: true,
    //   options: [],
    //   placeholder: '请选择省市区'
    // },
    // rules: [
    //   { required: true, message: '收货区域不能为空' }
    // ]
  },
  {
    prop: 'warehouseNo',
    label: '选择发货仓库',
    type: 'cascader', // 级联选择器,
    attr: {
      clearable: true,
      options: [],
      placeholder: '请选择发货仓库',
      style: {
        width: '380px'
      },
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.data && node.data.noLoad) { // 对于已经加载过的数据，防止其重复加载
            resolve()
            return
          }
          console.log(node)
          if (node.level !== 0) {
            let data = {}
            if (node.level === 1) {
              data = {
                businessCode: node.value
              }
            } else {
              data = {
                businessCode: node.data.businessCode,
                supplierId: node.value
              }
            }
            houseListApi(data).then(res => {
              const data = res.data || {}
              const nodes = []
              const ids = []
              data.map(item => {
                if (node.level === 1) {
                  if (!ids.includes(item.supplierId)) {
                    ids.push(item.supplierId)
                    nodes.push({
                      businessCode: item.businessCode,
                      label: item.supplierName,
                      value: item.supplierId,
                      leaf: false
                    })
                  }
                } else {
                  nodes.push({
                    value: item.warehouseCode,
                    label: item.warehouseName,
                    leaf: true
                  })
                }
              })
              console.log(nodes)
              resolve(nodes)
            })
          }
        }
      }
    },
    rules: [
      { required: true, message: '发货仓库不能为空' }
    ]
  }

]

export const actions = ({ closeDl }) => {
  return {
    submit: {
      label: '确定'
    },
    back: {
      hide: true
    },
    quit: {
      click: closeDl,
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
