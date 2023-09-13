/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export default (dat = {}) => {
  return [
    {
      prop: 'use',
      label: '上级分类',
      type: 'text', // 上级分类,
      defaultVal: dat.pName
    },
    {
      prop: 'id',
      type: 'hidden', // 修改的ID,
      defaultVal: dat.id
    },
    {
      prop: 'pcode',
      type: 'hidden', // 父级CODE
      defaultVal: dat.pcode
    },
    {
      prop: 'typeName',
      label: '类型名称',
      type: 'input', // 输入框,
      defaultVal: dat.typeName,
      attr: {
        placeholder: '请输入类型名称',
        maxlength: 50
      },
      rules: [
        { required: true, message: '类型名称不能为空' }
      ]
    },
    {
      prop: 'typeDesc',
      label: '类型描述',
      type: 'textarea', // 输入框,
      defaultVal: dat.typeDesc,
      attr: {
        autosize: { minRows: 4 },
        placeholder: '请输入类型描述',
        maxlength: 100
      }
    }
  ]
}

export const actions = ({ closeDl, isEdit }) => {
  return {
    submit: {
      label: isEdit ? '修改' : '保存'
    },
    back: {
      hide: true
    },
    quit: {
      click: closeDl,
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
