/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-03 15:48:00
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 15:28:14
 */
const { baseData: { work_order_type }} = window
export const categorieDatas = [
  {
    value: 32,
    label: '艺术宝'
  },
  {
    value: 1,
    label: '美术宝1对1'
  },
  {
    value: 2,
    label: '美术宝小班课'
  },
  {
    value: 3,
    label: '小熊美术'
  },
  {
    value: 4,
    label: '小熊书法'
  },
  {
    value: 5,
    label: '小熊音乐'
  },
  {
    value: 6,
    label: '小熊舞蹈'
  }
]
// 立即处理表单
export const doItForm = (remoteMethodSaleOrderId) => {
  return [
    {
      prop: 'handleComent',
      label: '处理结果（内部）',
      type: 'textarea', // 多文本
      defaultVal: '',
      attr: {
        placeholder: '请输入处理结果'
      },
      rules: [ // 校验
        { required: true, message: '请输入处理结果' }
      ]
    },
    {
      prop: 'feedbackCode',
      label: '处理结果',
      type: 'radio',
      visible: false,
      attr: {
        style: {
          width: '300px'
        }
      },
      options: [
        {
          label: '使用体验保障金退款',
          value: '00'
        }, {
          label: '通过其他方式退款',
          value: '02'
        }, {
          label: '已发货',
          value: '03'
        }, {
          label: '已完成售后服务',
          value: '05'
        }, {
          label: '非我方责任范围',
          value: '06'
        }, {
          label: '其他',
          value: '04'
        }
      ],
      note: true,
      noteConfig: {
        type: 'text',
        text: '请确认解决问题后再回复投诉，用户若不满意处理结果，可申请平台客服介入处理。',
        placement: 'left',
        style: 'danger'
      },
      rules: [ // 校验
        { required: true, message: '请选择处理结果' }
      ]
    },
    {
      prop: 'handleComentUser',
      label: '处理结果（展示给用户）',
      type: 'textarea', // 多文本
      defaultVal: '',
      attr: {
        placeholder: '请输入处理内容'
      }
    },
    {
      prop: 'PayPal',
      slot: 'PayPal',
      visible: false
    },
    {
      prop: 'refundType',
      label: '退款处理',
      type: 'radio',
      visible: false,
      defaultVal: '0',
      attr: {
        style: {
          width: '300px'
        }
      },
      options: [
        {
          label: '是',
          value: '1'
        }, {
          label: '否',
          value: '0'
        }
      ],
      note: true,
      noteConfig: {
        type: 'text',
        text: '核实用户填写的寄回单号是否正确，商品是否已退回到仓库完好无损，确定后用户账户退回对应金币'
      }
    },
    {
      prop: 'workType',
      label: '工单类型',
      type: 'radio',
      visible: true,
      attr: {
        style: {
          width: '300px'
        }
      },
      options: work_order_type
    },
    {
      prop: 'afterSaleSource',
      label: '来源',
      type: 'radio',
      visible: false,
      defaultVal: '1',
      attr: {
        style: {
          width: '300px'
        }
      },
      options: [
        {
          label: 'APP订单',
          value: '1'
        },
        {
          label: '积分商城',
          value: '2'
        }
      ]
    },
    {
      prop: 'afterSaleOrderId',
      label: '关联订单号',
      type: 'select',
      visible: false,
      attr: {
        filterable: true,
        placeholder: '请输入关联订单号'
      },
      options: [],
      rules: [ // 校验
        { required: true, message: '请输入关联订单号' }
      ]
    },
    {
      prop: 'productCode',
      label: '选择商品',
      type: 'select',
      visible: false,
      attr: {
        filterable: true,
        placeholder: '请选择选择商品'
      },
      options: [],
      rules: [ // 校验
        { required: true, message: '请选择选择商品' }
      ]
    },
    {
      prop: 'buyTime',
      slot: 'buyTime',
      label: '商品购买时间',
      defaultVal: '',
      visible: false
    },
    {
      prop: 'receivingType',
      label: '是否收到货',
      type: 'radio',
      visible: false,
      rules: [
        // 校验
        { required: true, message: '是否收到货必选！' }
      ],
      options: [{
        label: '已收到货',
        value: '2'
      }, {
        label: '未收到货',
        value: '1'
      }]
    },
    {
      prop: 'afterSaleProblemId',
      label: '售后类型',
      type: 'select', // 选择器,
      visible: false,
      attr: {
        collapseTags: true
      },
      options: [],
      rules: [ // 校验
        { required: true, message: '请选择售后类型' }
      ]
    },
    {
      prop: 'afterSaleProblemIdThree',
      label: '售后原因',
      type: 'select', // 选择器,
      visible: false,
      attr: {
        collapseTags: true
      },
      options: [],
      rules: [ // 校验
        { required: true, message: '请选择售后原因' }
      ]
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
      visible: true,
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
      ],
      rules: [
        // 校验
        { required: true, message: '请输入关闭理由！' }
      ]
    },
    {
      prop: 'sync',
      label: '同步服务记录',
      type: 'switch',
      defaultVal: true
    }
  ]
}

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
    ],
    rules: [
      // 校验
      { required: true, message: '请输入关闭理由！' }
    ]
  },
  {
    prop: 'handleComent',
    label: '处理结果（内部）',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入处理结果'
    }
  },
  {
    prop: 'handleComentUser',
    label: '处理结果（展示给用户）',
    type: 'textarea', // 多文本
    visible: true,
    defaultVal: '',
    attr: {
      placeholder: '请输入处理内容'
    }
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
    attr: {
      placeholder: '请输入备注内容'
    },
    rules: [
      // 校验
      { required: true, message: '请输入备注内容！' }
    ]
  }
]

// 修改渠道来源
export const questTypeForm = [
  {
    prop: 'channelPid',
    label: '投诉来源',
    type: 'radio', // 多文本
    defaultVal: '',
    visible: true,
    rules: [ // 校验
      { required: true, message: '投诉来源必选！' }
    ],
    options: []
  },
  {
    prop: 'channelId',
    label: '投诉途径',
    type: 'select', // 选择器,
    visible: true,
    rules: [
      // 校验
      { required: true, message: '投诉途径必选！' }
    ],
    attr: {
      disabled: false
    },
    options: []
  },
  {
    prop: 'problemPid',
    label: '问题类型',
    type: 'select', // 选择器,
    defaultVal: '',
    visible: true,
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
    visible: true,
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
    visible: true,
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
    visible: true,
    attr: {
      collapseTags: true
    },
    options: []
  }
]

// 修改售后来源来源
export const afterSourceForm = [
  {
    prop: 'channelId',
    label: '售后途径',
    type: 'select', // 选择器,
    visible: true,
    rules: [
      // 校验
      { required: true, message: '售后途径必选！' }
    ],
    attr: {
      disabled: false
    },
    options: []
  },
  {
    prop: 'receivingType',
    label: '是否收到货',
    type: 'radio',
    rules: [
      // 校验
      { required: true, message: '是否收到货必选！' }
    ],
    options: [{
      label: '已收到货',
      value: '2'
    }, {
      label: '未收到货',
      value: '1'
    }]
  },
  {
    prop: 'problemId',
    label: '售后类型',
    type: 'select', // 选择器,
    visible: true,
    attr: {
      collapseTags: true
    },
    rules: [
      // 校验
      { required: true, message: '售后类型必选！' }
    ],
    options: []
  },
  {
    prop: 'problemIdThree',
    label: '售后问题',
    type: 'select', // 选择器,
    visible: true,
    attr: {
      collapseTags: true
    },
    rules: [
      // 校验
      { required: true, message: '售后问题必选！' }
    ],
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
    attr: {
      placeholder: '请输入备注内容'
    },
    rules: [
      // 校验
      { required: true, message: '请输入备注内容！' }
    ]
  }
]

// 修改编辑投诉处理内容
export const complaintHandleForm = [
  {
    prop: 'cpComent',
    label: '处理结果',
    type: 'textarea', // 选择器,
    defaultVal: '',
    attr: {
      placeholder: '请输入处理结果'
    },
    rules: [
      // 校验
      { required: true, message: '请输入处理结果！' }
    ]
  },
  {
    prop: 'cpComentUser',
    label: '处理结果（展示给用户）',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入处理内容'
    }
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
    attr: {
      placeholder: '请输入处理结果'
    },
    rules: [
      // 校验
      { required: true, message: '请输入处理结果！' }
    ]
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
    attr: {
      placeholder: '请输入优先级理由'
    }
    // rules: [ // 校验
    //   { required: true, message: '请输入优先级理由！' }
    // ],
  }
]
// 添加勿扰标签
export const disturbForm = [
  {
    prop: 'types',
    label: '勿扰类型',
    type: 'checkbox',
    options: [
      { label: '营销短信勿扰', value: 1 },
      { label: '营销电话勿扰', value: 2 }
    ],
    rules: [
      // 校验
      { required: true, message: '勿扰类型必选' }
    ]
  },
  {
    prop: 'categories',
    label: '业务线',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true
    },
    options: categorieDatas,
    rules: [ // 校验
      { required: true, message: '业务线必选！' }
    ]
  },
  {
    prop: 'areaCode',
    label: '区号',
    type: 'input',
    defaultVal: '+86',
    attr: {
      placeholder: '请输入区号'
    },
    rules: [ // 校验
      { required: true, message: '区号必填！' }
    ]
  },
  {
    prop: 'mobiles',
    label: '手机号',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入（多个一行一个）'
    },
    rules: [ // 校验
      { required: true, message: '手动输入必填！' }
    ]
  },
  {
    prop: 'effectDays',
    label: '有效期',
    type: 'radio',
    options: [
      { label: '一个月', value: '30' },
      { label: '三个月', value: '60' },
      { label: '永久', value: '0' }
    ],
    rules: [
      // 校验
      { required: true, message: '勿扰类型必选' }
    ]
  },
  {
    prop: 'remark',
    label: '备注原因',
    type: 'textarea',
    attr: {
      placeholder: '请输入备注原因'
    }
  }
]
// 添加评论
export const addCommentForm = [
  {
  prop: 'handleComent',
  label: '评论内容',
  type: 'textarea', // 选择器,
  defaultVal: '',
  attr: {
    placeholder: '请输入评论内容'
  },
  rules: [ // 校验
    { required: true, message: '请输入评论内容' }
  ]
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
}
]
export const approvalNoForm = [{
  prop: 'supplement',
  label: '补充说明',
  type: 'textarea', // 选择器,
  attr: {
    placeholder: '',
    maxlength: 200
  },
  rules: [ // 校验
    { required: true, message: '请输入补充说明' }
  ]
 }]
//  同意仅退款
export const refundYesForm = [{
  prop: 'interceptLogistics',
  label: '是否拦截物流',
  type: 'radio',
  options: [
    { label: '不拦截物流', value: 1 },
    { label: '拦截物流', value: 0 }
  ],
  rules: [
    // 校验
    { required: true, message: '是否拦截物流必选' }
  ]
}, {
  prop: 'orderNo',
  slot: 'orderNo',
  label: '关联订单'
}, {
  prop: 'productName',
  slot: 'productName',
  label: '商品名称'
}, {
  prop: 'asType',
  slot: 'asType',
  label: '售后方式'
}, {
  prop: 'mailLogisticsList',
  slot: 'mailLogisticsList',
  label: '物流状态'
}, {
  prop: 'refundAmount',
  slot: 'refundAmount',
  label: '退款金额'
}, {
  prop: 'cash',
  slot: 'cash',
  label: ' '
}, {
  prop: 'supplement',
  label: '补充说明',
  type: 'textarea', // 选择器,
  attr: {
    placeholder: '内容将同步用户！',
    maxlength: 200
  },
  rules: [ // 校验
    { required: true, message: '请输入补充说明' }
  ]
 }]
//  同意换货
export const exchangeGoodsYesForm = [{
  prop: 'userCallMobile',
  slot: 'userCallMobile',
  label: '用户'
 }, {
  prop: 'orderNo',
  slot: 'orderNo',
  label: '关联订单'
}, {
  prop: 'productName',
  slot: 'productName',
  label: '商品名称'
}, {
  prop: 'mailLogisticsList',
  slot: 'mailLogisticsList',
  label: '物流状态'
}, {
  prop: 'address',
  slot: 'address',
  label: '收货地址',
  rules: [ // 校验
  { required: true, message: '请输入收货人地址' }
]
}, {
  prop: 'supplement',
  label: '补充说明',
  type: 'textarea', // 选择器,
  attr: {
    placeholder: '内容将同步用户！',
    maxlength: 200
  },
  rules: [ // 校验
    { required: true, message: '请输入补充说明' }
  ]
}]
// 补发商品
export const replenishDispatchYesForm = [{
  prop: 'userCallMobile',
  slot: 'userCallMobile',
  label: '用户'
 }, {
  prop: 'orderNo',
  slot: 'orderNo',
  label: '关联订单'
}, {
  prop: 'productName',
  slot: 'productName',
  label: '商品名称'
}, {
  prop: 'imgUrl',
  slot: 'imgUrl',
  label: '上传图片'
}, {
  prop: 'reissueType',
  type: 'radio',
  label: '补发类型',
  defaultVal: '0',
  options: [
    { label: '整盒补发', value: '1' },
    { label: '散件补发', value: '2' }
  ],
  rules: [ // 校验
    { required: true, message: '补发类型必选！' }
  ]
}, {
  prop: 'productCode',
  label: '选择商品',
  type: 'input',
  defaultVal: '',
  visible: true,
  attr: {
    disabled: true
  },
  rules: [ // 校验
    { required: true, message: '请选择选择商品' }
  ]
}, {
  prop: 'productDataList',
  label: '选择商品',
  type: 'select', // 选择器,
  defaultVal: '',
  visible: false,
  attr: {
    size: 'small',
    multiple: true,
    filterable: true,
    collapseTags: true,
    placeholder: '请选择'
  },
  options: [],
  rules: [ // 校验
    { required: true, message: '请选择选择商品' }
  ]
}, {
  prop: 'productRemark',
  slot: 'productRemark',
  visible: false,
  label: '商品补充'
}, {
  prop: 'address',
  slot: 'address',
  label: '收货地址',
  rules: [ // 校验
  { required: true, message: '请输入收货人地址' }
]
}, {
  prop: 'supplement',
  label: '补充说明',
  type: 'textarea', // 选择器,
  attr: {
    placeholder: '内容将同步用户！',
    maxlength: 200
  },
  rules: [ // 校验
    { required: true, message: '请输入补充说明' }
  ]
}]
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
