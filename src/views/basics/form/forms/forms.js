/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export default [
  {
    render: (h, form) => {
      return h('div', [
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, 'render 函数'),
        h('div', { style: { height: '1px', width: '100%', backgroundColor: '#efefef', margin: '20px 0' }})
      ])
    }
  },
  {
    prop: 'radio',
    label: '单选',
    type: 'radio', // 单选框,
    note: true,
    noteConfig: {
      type: 'tooltip',
      text: '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的说明',
      icon: 'el-icon-info',
      placement: 'right',
      attr: {
        popperClass: 'samll-tooltip'
      }
    },
    options: []
  },
  {
    prop: 'checkbox',
    label: '多选',
    type: 'checkbox', // 多选框,
    defaultVal: [],
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明',
      icon: 'el-icon-star-on',
      placement: 'left',
      style: 'danger'
    },
    options: [
      {
        label: 'A',
        value: 'a'
      },
      {
        label: 'B',
        value: 'b'
      }
    ]
  },
  {
    prop: 'checkbox',
    label: '多选',
    type: 'checkbox', // 多选框,
    defaultVal: [],
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明',
      icon: 'el-icon-star-on',
      placement: 'left',
      style: 'danger'
    },
    options: [
      {
        label: 'A',
        value: 'a'
      },
      {
        label: 'B',
        value: 'b'
      }
    ],
    attr: {
      list: [
        {
          title: '广告位名称',
          value: '美术宝1V1学生端banner'
        },
        {
          title: '已投放广告数量',
          value: '3/5'
        }

      ]
    }
  },
  {
    prop: 'input',
    label: '输入框',
    type: 'input', // 输入框,
    defaultVal: 11,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明',
      icon: 'el-icon-star-on',
      placement: 'left',
      style: 'primary'
    },
    rules: [
      { required: true, message: '年龄不能为空' }
    ]
  },
  {
    render: (h, form) => {
      return h('div', [
        h('p', { style: { fontWeight: 'bold', color: '#555555', fontSize: '16px' }}, 'render 函数'),
        h('div', { style: { height: '1px', width: '100%', backgroundColor: '#efefef', margin: '20px 0' }})
      ])
    }
  },
  {
    prop: 'inputNumber',
    label: '计数器',
    type: 'inputNumber', // 计数器,
    note: true,
    noteConfig: {
      type: 'link',
      text: '链接',
      icon: 'el-icon-check',
      attr: {
        href: 'http://baidu.com',
        style: {
          textDecoration: 'underline',
          color: '#409eff'
        },
        popperClass: 'samll-tooltip'
      }
    },
    defaultVal: 0
  },
  {
    prop: 'select',
    label: '选择器',
    type: 'select', // 选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    defaultVal: 'a',
    options: [
      {
        label: 'A',
        value: 'a'
      },
      {
        label: 'B',
        value: 'b'
      }
    ]
  },
  {
    prop: 'cascader',
    label: '级联',
    type: 'cascader', // 级联选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    defaultVal: [
      'yizhi1',
      'yizhi3'
    ],
    recovery: false,
    attr: {
      options: [
        {
          label: '江苏',
          value: 'yizhi',
          children: [
            {
              label: '江苏',
              value: 'yizhi2'
            }
          ]
        }, {
          label: '浙江',
          value: 'yizhi1',
          children: [
            {
              label: '皮革厂',
              value: 'yizhi3'
            }
          ]
        }
      ]
    }
  },
  {
    prop: 'switch',
    label: '开关',
    type: 'switch', // 开关,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    }
  },
  {
    prop: 'slider',
    label: '滑块',
    type: 'slider', // 滑块,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    defaultVal: 1,
    recovery: true
  },
  {
    prop: 'timePicker',
    label: '时间选择',
    type: 'timePicker', // 时间选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    }
  },
  {
    prop: 'datePicker',
    label: '日期选择',
    type: 'datePicker', // 日期选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    attr: {
      type: 'monthrange'
    }
  },
  {
    prop: 'time',
    label: '日期时间',
    type: 'dateTimePicker', // 日期时间选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始日期A',
      endPlaceholder: '结束日期B',
      defaultTime: ['12:00:00'], // 请注意：不同的attr.type有不同的defaultTime格式
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    actions: {}
  },
  {
    prop: 'upload',
    label: '上传',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    limit: 3,
    attr: {
      action: 'picture-card',
      listType: 'picture-card'
    }
  },
  {
    prop: 'rate',
    label: '评分',
    type: 'rate', // 评分,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    defaultVal: 2.2
  },
  {
    prop: 'colorPicker',
    label: '颜色选择',
    type: 'colorPicker', // 颜色选择器,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    }
  },
  {
    prop: 'transfer',
    label: '穿梭框',
    type: 'transfer', // 穿梭框,
    note: true,
    noteConfig: {
      type: 'text',
      text: '这是一段说明'
    },
    defaultVal: [1],
    attr: {
      data: [
        {
          key: 0,
          label: 'A',
          disabled: false

        },
        {
          key: 1,
          label: 'B',
          disabled: false
        },
        {
          key: 2,
          label: 'C',
          disabled: true
        }
      ]
    }
  }
]

export const actions = ({ goTo }) => {
  return {
    submit: {
      label: '修改',
      confirm: true,
      confirmConfig: {
        confirmButtonText: 'A',
        cancelButtonText: 'B',
        type: 'C',
        label: 'D',
        text: 'E'
      }
    },
    back: {
      hide: true
    },
    goTo: {
      click: goTo,
      type: 'button',
      label: '自定义按钮',
      attr: {
        type: 'primary',
        icon: 'el-icon-info'
      }
    },
    goTo2: {
      click: goTo,
      type: 'a',
      label: '按钮a',
      attr: {
        style: {
          color: 'red',
          marginLeft: '10px'
        }
      }
    },
    goTo3: {
      type: 'link',
      label: '自定义a-link',
      attr: {
        href: 'http://baidu.com',
        target: '_blank',
        style: {
          color: 'blue',
          marginLeft: '10px'
        }
      }
    }
  }
}

