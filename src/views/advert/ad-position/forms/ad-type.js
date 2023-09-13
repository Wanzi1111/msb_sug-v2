/**
 * @author: Liwei
 * @description: 新建广告位表单配置
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'type',
    label: '广告类型名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入广告类型名称'
    },
    note: true,
    noteConfig: {
      type: 'tooltip',
      text: '命名规范: TY+序号+广告位'
    },
    rules: [
      { required: true, message: '广告类型名称不能为空' }
    ]
  },
  {
    prop: 'size',
    label: '广告尺寸',
    type: 'select', // 输入框,
    attr: {
      placeholder: '请选择广告尺寸'
    }
    // note: true,
    // noteConfig: {
    //   type: 'tooltip',
    //   text: '命名规范: 广告位尺寸+iPhone/iPad'
    // },
    // rules: [
    //   { required: true, message: '广告尺寸不能为空' }
    // ]
  }
]

export const adActions = ({ quit }) => {
  return {
    submit: {
      label: '新增'
    },
    back: {
      hide: true
    },
    quit: {
      click: quit,
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
