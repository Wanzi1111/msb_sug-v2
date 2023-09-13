/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-11-11 17:53:27
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-11 18:39:50
 */
export const forms = [
  {
    prop: 'channelPid',
    label: '投诉来源',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      placeholder: '请选择投诉来源'
      // multiple: true,
      // collapseTags: true
    },
    rules: [
      { required: true, message: '请选择投诉来源' }
    ],
    options: [
      {
        label: '1v1用户',
        value: '1011'
      },
      {
        label: '1v1老师',
        value: '1012'
      },
      {
        label: '小班课用户',
        value: '1021'
      },
      {
        label: '小班课老师',
        value: '1022'
      },
      {
        label: '小熊用户',
        value: '1031'
      },
      {
        label: '书画院用户',
        value: '1061'
      },
      {
        label: '书法用户',
        value: '1041'
      },
      {
        label: '小熊音乐',
        value: '1051'
      },
      {
        label: '小熊舞蹈用户',
        value: '1071'
      },
      {
        label: '小熊手工',
        value: '1081'
      }
    ]
  },
  {
    prop: 'problemPid',
    label: '投诉问题',
    type: 'select',
    attr: {
      placeholder: '请选择问题分类',
      style: {
        // width: '380px'
      }
    },
    options: [

    ],
    rules: [
      { required: true, message: '问题分类不为空' }
    ]
  },
  {
    prop: 'problemId',
    label: ' ',
    type: 'checkbox',
    attr: {
      style: {
        // width: '380px'
      }
    },
    options: [

    ]
  }
]

export const actions = ({ closeDl }) => {
  return {
    submit: { // 默认按钮一
      label: '确定'
      // hide: true // 是否显示 默认false
    },
    back: {
      hide: true
    },
    // ensure: {
    //   click: ensure,
    //   type: 'button',
    //   label: '确定',
    //   attr: {
    //     type: 'primary'
    //   }
    // },
    cancel: {
      click: closeDl,
      type: 'button',
      label: '关闭'
    }
  }
}
