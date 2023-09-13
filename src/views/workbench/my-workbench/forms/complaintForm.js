/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-03 15:48:00
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 15:28:14
 */
const { baseData: { work_order_type }} = window
// 立即处理表单
export const doItForm = [
  {
    prop: 'handleComent',
    label: '处理结果',
    type: 'textarea', // 多文本
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请输入处理结果！' }
    ],
    placeholder: '请输入处理结果'
  },
  {
    prop: 'workType',
    label: '工单类型',
    type: 'radio',
    attr: {
      style: {
        width: '300px'
      }
    },
     options: work_order_type
  },
  {
    prop: 'imgUrl',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    paste: true,
    noteConfig: {
      type: 'text',
      text: '点击页面空白处，即可粘贴图片进行上传(暂不支持多文件同时上传)'
    },
    attr: {
      limit: 5,
      action: 'picture-card',
      listType: 'picture-card'
    }
  },
  {
    prop: 'videoUrl',
    label: '上传视频',
    type: 'upload-media',
    drag: true,
    mediaRules: {
      time: 240,
      size: 200,
      media: 'video',
      type: 'MP4,m3u8'
    },
    visible: true,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200M以下的视频，支持MP4、m3u8格式'
    }
  },
  {
    prop: 'closeEnumTpye',
    label: ' ',
    type: 'checkbox', // 多选框,
    defaultVal: [],
    options: [
      {
        label: '关闭投诉',
        value: '1'
      }
    ]
  },
  {
    prop: 'closeEnum',
    label: '关闭理由',
    type: 'select', // 选择器,
    defaultVal: '',
    visible: false,
    options: [
      {
        label: '问题已解决',
        value: '1'
      },
      {
        label: '已电话沟通解决',
        value: '2'
      },
      {
        label: '用户已撤回投诉',
        value: '3'
      },
      {
        label: '其他原因',
        value: '4'
      }
    ]
  }
]

// 关闭投诉
export const closeForm = [
  {
    prop: 'closeEnumNew',
    label: '关闭理由',
    type: 'select', // 选择器,
    defaultVal: '',
    options: [
      {
        label: '问题已解决',
        value: '1'
      },
      {
        label: '已电话沟通解决',
        value: '2'
      },
      {
        label: '用户已撤回投诉',
        value: '3'
      },
      {
        label: '其他原因',
        value: '4'
      }
    ]
  },
  {
    prop: 'handleComent',
    label: '处理结果',
    type: 'textarea', // 多行文本,
    defaultVal: '',
    placeholder: '请输入处理内容'
  },
  {
    prop: 'imgUrl',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {},
    attr: {
      limit: 5,
      action: 'picture-card',
      listType: 'picture-card'
    },
    mediaRules: {
      // time: 60,
      // width: 100,
      // height: 200,
      size: 20,
      media: 'img',
      type: 'GIF,PNG,JPG,JPEG'
    }
  },
  {
    prop: 'videoUrl',
    label: '上传视频',
    type: 'upload-media',
    mediaRules: {
      time: 240,
      size: 200,
      media: 'video',
      type: 'MP4,m3u8'
    },
    visible: true,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200M以下的视频，支持MP4、m3u8格式'
    }
  }
]

// 设为无效
export const invalidForm = [
  {
    prop: 'cpStatusRadio',
    label: '',
    type: 'radio', // 选择器,
    defaultVal: '60',
    options: [
      {
        value: '60',
        label: '无效投诉'
      },
      {
        value: '61',
        label: '重复投诉'
      }
    ]
  },
  {
    prop: 'invalidEnum',
    label: '无效理由',
    type: 'select', // 选择器,
    defaultVal: '',
    options: [
      {
        label: '无效投诉',
        value: '0'
      },
      {
        label: '投诉内容不完整',
        value: '1'
      },
      {
        label: '投诉内容违规',
        value: '2'
      },
      {
        label: '投诉证据不足',
        value: '3'
      },
      {
        label: '其他原因',
        value: '4'
      }
    ],
    visible: true
  },
  {
    prop: 'repeatReason',
    label: '重复理由',
    type: 'select', // 选择器,
    defaultVal: '',
    options: [
      {
        label: '重复提交',
        value: '5'
      },
      {
        label: '重复问题',
        value: '6'
      },
      {
        label: '其他原因',
        value: '4'
      }
    ],
    visible: false
  },
  {
    prop: 'remark',
    label: '其他说明',
    type: 'textarea', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请输入备注内容！' }
    ],
    placeholder: '请输入备注内容'
  }
]

// 问题类型
export const questTypeForm = [
  {
    prop: 'problemPid',
    label: '问题类型',
    type: 'select', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '问题类型必选！' }
    ],
    options: []
  },
  {
    prop: 'problemId',
    label: '投诉问题',
    type: 'select', // 选择器,
    // defaultVal: [],
    attr: {
      collapseTags: true
    },
    rules: [
      // 校验
      { required: true, message: '投诉问题必选！' }
    ],
    options: []
  },
  {
    prop: 'problemIdThree',
    label: '三级分类',
    type: 'select', // 选择器,
    attr: {
      collapseTags: true
    },
    options: []
  },
  {
    prop: 'problemIdFour',
    label: '四级分类',
    type: 'select', // 选择器,
    attr: {
      collapseTags: true
    },
    options: []
  },
  {
    prop: 'problemIdFive',
    label: '五级分类',
    type: 'select', // 选择器,
    attr: {
      collapseTags: true
    },
    options: []
  }
]
// 修改操作人
export const editStaffUserForm = [
  {
    prop: 'oldId',
    label: '操作人',
    type: 'select', // 选择器,
    defaultVal: '',
    attr: {
      disabled: true
    }
  },
  {
    prop: 'id',
    label: '修改为',
    type: 'select', // 选择器,
    defaultVal: '',
    attr: {
      filterable: true
    },
    rules: [
      // 校验
      { required: true, message: '请选择员工姓名！' }
    ],
    options: []
  }
]
// 确定转业务处理
export const toTeachDeal = [
  {
    prop: 'type',
    label: '',
    type: 'radio', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请选择转业务人员！' }
    ],
    options: []
  }
]

// 添加或编辑文本备注
export const remarkForm = [
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请输入备注内容！' }
    ],
    placeholder: '请输入备注内容'
  }
]

// 修改编辑投诉处理内容
export const complaintHandleForm = [
  {
    prop: 'cpComent',
    label: '处理结果',
    type: 'textarea', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请输入处理结果！' }
    ],
    placeholder: '请输入处理结果'
  }
]

// 修改无效为待处理
export const accecptForm = [
  {
    prop: 'handleComent',
    label: '激活理由',
    type: 'select', // 选择器,
    defaultVal: '',
    attr: {
      filterable: true
    },
    rules: [
      // 校验
      { required: true, message: '请选择激活理由！' }
    ],
    options: [
      {
        value: '操作失误',
        lable: '操作失误'
      },
      {
        value: '其他原因',
        lable: '其他原因'
      }
    ]
  }
]

// 记录回访登记弹窗
export const visitForm = [
  {
    prop: 'handleComent',
    label: '处理结果',
    type: 'textarea', // 选择器,
    defaultVal: '',
    rules: [
      // 校验
      { required: true, message: '请输入处理结果！' }
    ],
    placeholder: '请输入处理结果'
  },
  {
    prop: 'handleStatus',
    label: '标记问题',
    type: 'radio', // 选择器,
    defaultVal: '70',
    options: [
      {
        label: '已解决（触发评价短信）',
        value: '71'
      },
      {
        label: '未解决（转待处理）',
        value: '1'
      }
    ]
    /* rules: [ // 校验
      { required: true, message: '请选择标记问题' }
    ] */
  },
  {
    prop: 'imgUrl',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {},
    attr: {
      limit: 5,
      action: 'picture-card',
      listType: 'picture-card'
    }
  },
  {
    prop: 'videoUrl',
    label: '上传视频',
    type: 'upload-media',
    mediaRules: {
      time: 240,
      size: 200,
      media: 'video',
      type: 'MP4,m3u8'
    },
    visible: true,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200M以下的视频，支持MP4、m3u8格式'
    }
  }
]
// 设置优先级
export const priorityForm = [
  {
    prop: 'priority',
    label: '处理优先级',
    type: 'radio',
    attr: {
      // placeholder: '请选择处理优先级'
      // style: {
      //   width: '380px'
      // }
    },
    options: [
      { label: '普通', value: 5 },
      { label: '低', value: 4 },
      { label: '中', value: 3 },
      { label: '高', value: 2 },
      { label: '急', value: 1 }
    ],
    rules: [
      // 校验
      { required: true, message: '请选择优先级' }
    ]
  },
  {
    prop: 'handleComent',
    label: '优先级理由',
    type: 'textarea', // 选择器,
    defaultVal: '',
    // rules: [ // 校验
    //   { required: true, message: '请输入优先级理由！' }
    // ],
    placeholder: '请输入优先级理由'
  }
]

export const actions = ({ cancel, ensure }) => {
  return {
    submit: {
      // 默认按钮一
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
