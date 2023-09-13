/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-28 15:44:14
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-10-10 15:53:59
 */
// 新建问题分类或编辑问题分类
export const addQuestionForm = (type) => {
  const conf = [
    {
      prop: 'businessId',
      label: '选择业务线',
      type: 'select', // 多选框,
      attr: {
        disabled: !!type
      },
      rules: [
        { required: true, message: '请选择业务线' }
      ],
      defaultVal: [],
      options: []
    },
    {
      prop: 'channelPid',
      label: '投诉来源',
      type: 'select', // 多选框,
      attr: {
        disabled: !!type
      },
      rules: [
        { required: true, message: '请选择投诉来源' }
      ],
      defaultVal: [],
      options: []
    },
    {
      prop: 'problemIdNew',
      label: '问题编码',
      type: 'input',
      attr: {
        disabled: !!type,
        placeholder: '请输入6位数字'
      },
      rules: [
        { required: true, message: '请输入6位数字' },
        { min: 6, message: '请输入6位数字' },
        { max: 6, message: '请输入6位数字' }
      ]
    },
    {
      prop: 'cpType',
      label: '问题分类名',
      type: 'input',
      attr: {
        placeholder: '请输入至少2个字符'
      },
      rules: [
        { required: true, message: '请输入至少2个字符' },
        { min: 2, message: '请输入至少2个字符' }
      ]
    },
    {
      prop: 'cpProblemRemark',
      label: '问题备注',
      type: 'input',
      attr: {
        placeholder: '请输入至少5个字符'
      },
      rules: [
        { required: true, message: '请输入至少5个字符' },
        { min: 5, message: '请输入至少5个字符' }
      ]
    }
  ]
  return conf
}

// 新建投诉问题或编辑投诉问题
export const addComplintQuestionForm = [
  {
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
    prop: 'problemIdNew',
    label: '问题编码',
    type: 'input',
    attr: {
      placeholder: '请输入8位数字'
    },
    rules: [
      { required: true, message: '请输入8位数字' },
      { min: 8, message: '请输入8位数字' },
      { max: 8, message: '请输入8位数字' }
    ]
  },
  {
    prop: 'cpProblemRemark',
    label: '问题分类',
    type: 'input',
    attr: {
      placeholder: '请输入至少2个字符',
      disabled: true
    }
  },
  {
    prop: 'cpType',
    label: '问题名称',
    type: 'input',
    attr: {
      placeholder: '请输入至少2个字符'
    },
    rules: [
      { required: true, message: '请输入至少2个字符' },
      { min: 2, message: '请输入至少2个字符' }
    ]
  }
]

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
