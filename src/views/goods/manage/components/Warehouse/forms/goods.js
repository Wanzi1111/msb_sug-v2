/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export default (row, dat) => {
  return [
    {
      prop: 'id',
      type: 'hidden',
      defaultVal: dat.id
    },
    {
      prop: 'productCode',
      type: 'hidden',
      defaultVal: row.productCode
    },
    {
      prop: 'productName',
      label: '商品名称',
      type: 'text',
      defaultVal: row.productName
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
      options: [],
      rules: [
        { required: true, message: '承运商不能为空' }
      ]
    },
    {
      prop: 'warehouseNo',
      label: '仓库',
      type: 'select',
      attr: {
        placeholder: '请选择仓库'
      },
      options: [],
      rules: [
        { required: true, message: '仓库不能为空' }
      ]
    },
    {
      prop: 'supplierProductCode',
      label: '仓库商品编码',
      type: 'input',
      attr: {
        placeholder: '请输入仓库商品编码',
        maxlength: 20
      },
      rules: [
        { required: true, message: '商品编码不能为空' }
      ]
    }
  ]
}

export const actions = ({ closeDl }) => {
  return {
    back: {
      hide: true
    },
    quit: {
      click: () => closeDl(),
      type: 'button',
      label: '取消',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
