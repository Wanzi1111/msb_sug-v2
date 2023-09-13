/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-03 18:58:42
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-09 14:37:14
 */
export default [
  {
    prop: 'channelId',
    label: '接口信息',
    type: 'select', // 选择器,
    defaultVal: '',
    options: [],
    attr: {
      placeholder: '请选择接口ID'
    },
    rules: [ // 校验
      { required: true, message: '接口ID必选！' }
    ]
  },
  {
    prop: 'userName',
    label: '用户姓名',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入用户姓名'
    },
    rules: [ // 校验
      { required: true, message: '用户姓名必填！' }
    ]
  },
  {
    prop: 'userMobile',
    label: '手机号',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入手机号'
    },
    rules: [ // 校验
      { required: true, message: '手机号必填！' }
    ]
  },
  {
    prop: 'userId',
    label: 'UID',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入UID'
    },
    rules: [ // 校验
      { required: true, message: 'UID必填！' }
    ]
  },
  // {
  //   prop: '用户标签',
  //   label: '用户标签',
  //   type: 'input', // 多文本
  //   defaultVal: '',
  //   attr: {
  //     placeholder: '请输入用户标签'
  //   },
  //   rules: [ // 校验
  //     { required: true, message: '用户标签必填！' }
  //   ]
  // },
  // {
  //   prop: '用户标签（选填）',
  //   label: '用户标签（选填）',
  //   type: 'input', // 多文本
  //   defaultVal: '',
  //   attr: {
  //     placeholder: '请输入用户标签'
  //   }
  // },
  {
    prop: 'problemId',
    label: '投诉问题',
    type: 'select', // 选择器,
    defaultVal: '',
    attr: {
      // multiple: true,
      filterable: true,
      // collapseTags: true,
      placeholder: '请选择'
    },
    options: [],
    rules: [ // 校验
      { required: true, message: '投诉问题必选！' }
    ]
  },
  {
    prop: 'cpComent',
    label: '投诉内容',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入'
    }
  }
]
export const actions = {
  submit: {
    label: '确定',
    attr: {
      type: 'primary'
    }
  }
  // back: {
  //   hide: true
  // }
}
