/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 17:13:40
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-28 21:13:41
 */
// 新建投诉问题或编辑投诉问题
// 新建投诉问题或编辑投诉问题
export const addComplintQuestionChildrenForm = (disab) => {
  return [{
    prop: 'channelPid',
    label: '投诉来源',
    type: 'select', // 多选框,
    defaultVal: [],
    options: [
      {
        value: '1011',
        label: '1v1用户'
      },
      {
        value: '1012',
        label: '1v1老师'
      },
      {
        value: '1021',
        label: '小班课用户'
      },
      {
        value: '1022',
        label: '小班课老师'
      },
      {
        value: '1031',
        label: '小熊用户'
      },
      {
        value: '1041',
        label: '书法用户'
      },
      {
        value: '1051',
        label: '小熊音乐'
      }
    ],
    attr: {
      disabled: true
    }
  },
  {
    prop: 'cpProblemRemark',
    label: '问题类型',
    type: 'input',
    attr: {
      placeholder: '请输入至少2个字符',
      disabled: true
    }
  },
  {
    prop: 'cpType',
    label: '投诉问题',
    type: 'input',
    attr: {
      disabled: true,
      placeholder: '请输入至少2个字符'
    },
    rules: [
      { required: true, message: '请输入至少2个字符' },
      { min: 2, message: '请输入至少2个字符' }
    ]
  },
  {
    prop: 'cpTypeThree',
    label: '三级分类',
    type: 'input',
    attr: {
      disabled: true,
      placeholder: '请输入至少2个字符'
    },
    rules: [
      { required: true, message: '请输入至少2个字符' },
      { min: 2, message: '请输入至少2个字符' }
    ]
  },
  {
    prop: 'cpTypeFour',
    label: '四级分类',
    type: 'input',
    attr: {
      disabled: !disab,
      placeholder: '请输入至少2个字符'
    },
    rules: [
      { required: true, message: '请输入至少2个字符' },
      { min: 2, message: '请输入至少2个字符' }
    ]
  },
  {
    prop: 'cpTypeFive',
    label: '五级分类',
    type: 'input',
    attr: {
      placeholder: '请输入至少2个字符'
    },
    rules: [
      { required: true, message: '请输入至少2个字符', trigger: 'blur' },
      { min: 2, message: '请输入至少2个字符' }
    ]
  },
  {
    prop: 'problemIdNew',
    label: '问题编码',
    type: 'input',
    attr: {
      disabled: !!disab,
      placeholder: '请输入14位数字'
    },
    rules: [
      { required: true, min: 14, max: 14, message: '请输入14位数字' }
    ]
  }
  ]
}
export const actions = ({ cancel, ensure }) => {
  return {
    submit: { // 默认按钮一
      hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    ensure: {
      click: ensure,
      type: 'button',
      label: '确定',
      attr: {
        type: 'primary'
      }
    },
    cancel: {
      click: cancel,
      type: 'button',
      label: '取消'
    }
  }
}
