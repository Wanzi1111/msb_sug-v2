const { baseData: { Agency_follow_up_method }} = window
export const partyradioMap = [
{
  label: '公司',
  value: '0'
}, {
  label: '仓库',
  value: '1'
}, {
  label: '物流',
  value: '2'
}, {
  label: '销售',
  value: '3'
}, {
  label: '教辅',
  value: '4'
}, {
  label: '供应链',
  value: '5'
}, {
  label: '客服',
  value: '6'
}, {
  label: '教学',
  value: '7'
}, {
  label: '产研',
  value: '8'
}, {
  label: '商城运营',
  value: '9'
}, {
  label: '活动运营',
  value: '10'
}, {
  label: '其他',
  value: '11'
}]
// 创建赔付审批
export const claimsForm = [
  {
    prop: 'userInfo',
    slot: 'userInfo',
    label: '用户信息'
  },
  {
    prop: 'userMobile',
    slot: 'userMobile',
    label: '手机号'
  },
  {
    prop: 'userName',
    slot: 'userName',
    label: '用户姓名'
  },
  {
    prop: 'schemeCompensation',
    slot: 'schemeCompensation',
    label: '赔付方案'
  },
  {
    prop: 'source',
    label: '订单来源',
    type: 'radio',
    defaultVal: '0',
    attr: {
      style: {
        width: '300px'
      }
    },
    rules: [ // 校验
      { required: true, message: '订单来源必选！' }
    ],
    options: [
      {
        label: 'APP订单',
        value: '0'
      },
      {
        label: '积分商城',
        value: '1'
      }
    ]
  },
  {
    prop: 'orderId',
    label: '关联订单',
    type: 'select',
    defaultVal: '',
    attr: {
      placeholder: '请选择关联订单',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '关联订单必选！' }
    ],
    options: []
  },
  {
    prop: 'currencyType',
    label: '赔付方式',
    type: 'select',
    defaultVal: '',
    attr: {
      placeholder: '请选择赔付方式',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '赔付方式必选！' }
    ],
    options: []
  },
  {
    prop: 'amount',
    slot: 'amount',
    label: '赔付额度',
    type: 'input',
    defaultVal: '',
    visible: true,
    rules: [ // 校验
      { required: true, message: '赔付额度必填！' }
    ]
  },
  {
    prop: 'goods',
    slot: 'goods',
    label: '选择商品',
    visible: false,
    defaultVal: [],
    rules: [ // 校验
      { required: true, message: '商品必选！' }
    ]
  },
  {
    prop: 'addressId',
    slot: 'addressId',
    label: '收货地址',
    visible: false,
    rules: [ // 校验
    { required: true, message: '请输入收货人地址' }
    ]
  },
  {
    prop: 'evidenceCompensation',
    slot: 'evidenceCompensation',
    label: '赔付证据'
  },
  {
    prop: 'scene',
    label: '赔付场景',
    type: 'select',
    attr: {
      placeholder: '请选择赔付场景',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '赔付场景必选！' }
    ],
    options: []
  },
  {
    prop: 'reason',
    label: '赔付原因',
    type: 'select',
    visible: false,
    defaultVal: '',
    attr: {
      placeholder: '请选择赔付原因',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '赔付原因必选！' }
    ],
    options: []
  },
  {
    prop: 'description',
    label: '赔付说明',
    type: 'textarea', // 多文本
    defaultVal: '',
    placeholder: '请输入赔付说明',
    attr: {
      autosize: { minRows: 4 },
      maxlength: 300
    },
    rules: [ // 校验
      { required: true, message: '赔付说明必填！' }
    ]
  },
  {
    prop: 'images',
    label: '上传截图',
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
    },
    rules: [ // 校验
      { required: true, message: '请上传相应截图证据！' }
    ]
  },
  {
    prop: 'videos',
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
    prop: 'partyradio',
    slot: 'partyradio',
    label: '责任方'
  },
  {
    prop: 'responsibleParty',
    slot: 'responsibleParty',
    label: '责任方',
    type: 'radio',
    attr: {
      style: {
        width: '300px'
      }
    },
    options: partyradioMap,
    rules: [ // 校验
      { required: true, message: '请选择责任方！' }
    ]
  }
]
// 创建退款审批
export const refundForm = [
  {
    prop: 'mobile',
    label: '用户',
    type: 'input',
    defaultVal: '',
    attr: {
      placeholder: '请输入用户手机号',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '用户手机号必填！', trigger: 'change' },
      { validator: valiMobile, trigger: 'blur' }
    ]
  },
  {
    prop: 'order',
    label: '关联订单',
    type: 'select',
    defaultVal: '',
    attr: {
      placeholder: '请选择关联订单',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '关联订单必选！' }
    ],
    options: []
  },
  {
    prop: 'refundOther',
    slot: 'refundOther'
  },
  {
    prop: 'refundType',
    slot: 'refundType',
    label: '退款类型',
    defaultVal: 0,
    type: 'radio',
    options: [],
    rules: [ // 校验
      { required: true, message: '退款类型必选！' }
    ]
  },
  {
    prop: 'couponType',
    slot: 'couponType',
    label: '选择优惠券',
    defaultVal: '',
    type: 'select',
    attr: {
      placeholder: '请选择选择优惠券',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '选择优惠券必选！' }
    ]
  },
  {
    prop: 'deductMonth',
    slot: 'deductMonth',
    defaultVal: 0,
    label: '次月课程',
    type: 'radio',
    options: [],
    rules: [ // 校验
      { required: true, message: '次月课程必选！' }
    ]
  },
  {
    prop: 'deductMaterial',
    slot: 'deductMaterial',
    label: '随材盒子',
    defaultVal: 0,
    type: 'radio',
    options: [],
    rules: [ // 校验
      { required: true, message: '随材盒子必选！' }
    ]
  },
  {
    prop: 'multipleTable',
    slot: 'multipleTable'
  },
  {
    prop: 'refundAmount',
    slot: 'refundAmount'
  },
  {
    prop: 'pureWeekYto',
    slot: 'pureWeekYto'
  },
  {
    prop: 'reason',
    slot: 'reason',
    label: '退款原因',
    type: 'radio',
    defaultVal: '服务',
    options: [],
    rules: [ // 校验
      { required: true, message: '退款原因必选！' }
    ]
  },
  {
    prop: 'explain',
    label: '退款说明',
    type: 'textarea', // 多文本
    defaultVal: '',
    placeholder: '请输入退款说明',
    rules: [ // 校验
      { required: true, message: '退款说明必填！' }
    ]
  },
  {
    prop: 'imgUrl',
    label: '附件',
    type: 'upload', // 上传,
    paste: true,
    attr: {
      limit: 1,
      action: 'picture-card',
      listType: 'picture-card'
    }
    // rules: [ // 校验
    //   { required: true, message: '请上传附件！' }
    // ]
  }
]

// 创建补发货审批
export const repairForm = [
  {
    prop: 'namex',
    label: '用户',
    type: 'input',
    defaultVal: '',
    attr: {
      placeholder: '请输入用户手机号',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '用户手机号必填！', trigger: 'blur' },
      { validator: valiMobile, trigger: 'blur' }
    ]
  },
  {
    prop: 'orderId',
    label: '关联订单',
    type: 'select',
    defaultVal: '',
    attr: {
      placeholder: '请选择关联订单',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '关联订单必选！' }
    ],
    options: []
  },
  {
    prop: 'type',
    slot: 'type',
    label: '补发类别',
    rules: [ // 校验
      { required: true, message: '补发类型必选！' }
    ]
  },
  {
    prop: 'logisticsItem',
    slot: 'logisticsItem',
    type: 'select',
    label: '选择物流',
    rules: [ // 校验
      { required: true, message: '物流必选！' }
    ]
  },
  {
    prop: 'receiptName',
    slot: 'receiptName',
    label: '收货人',
    type: 'input',
    defaultVal: '',
    rules: [ // 校验
      { required: true, message: '收货人必填！' }
    ]
  },
  {
    prop: 'receiptTel',
    slot: 'receiptTel',
    label: '收货人电话',
    type: 'input',
    defaultVal: '',
    rules: [ // 校验
      { required: true, message: '收货人电话必选！' }
    ]
  },
  {
    prop: 'totalAddress',
    slot: 'totalAddress',
    label: '收货人地址',
    type: 'input',
    defaultVal: '',
    rules: [ // 校验
      { required: true, message: '收货人地址必选！' }
    ]
  },
  {
    prop: 'sup',
    slot: 'sup',
    label: '补发难度',
    type: 'select',
    defaultVal: '',
    attr: {
      placeholder: '请选择补发难度',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '补发难度必选！', trigger: 'change' }
    ],
    options: []

  },
  {
    prop: 'selectList',
    slot: 'selectList',
    label: '选择商品',
    defaultVal: [],
    rules: [ // 校验
      { required: true, message: '商品必选！' }
    ]
  },
  {
    prop: 'reason',
    slot: 'reason',
    label: '补发原因',
    rules: [ // 校验
      { required: true, message: '补发原因必填！' }
    ]
  },
  {
    prop: 'reissueMsg',
    label: '补发货说明',
    type: 'textarea', // 多文本
    defaultVal: '',
    placeholder: '请输入补发货说明',
    rules: [ // 校验
      { required: true, message: '补发货说明必填！' }
    ]
  },
  {
    prop: 'attsUrl',
    label: '附件',
    type: 'upload', // 上传,
    attr: {
      limit: 1,
      action: 'picture-card',
      listType: 'picture-card'
    },
    rules: [ // 校验
      { required: true, message: '请上传附件！' }
    ]
  }

]

// 添加代办
export const addBacklogForm = [
      {
        prop: 'executeTime',
        slot: 'executeTime',
        label: '跟进时间',
        rules: [
           { required: true, message: '跟进时间不能为空' }
        ]
      },
    {
        prop: 'content',
        label: '跟进内容',
        type: 'textarea', // 多文本
        defaultVal: '',
        attr: {
            placeholder: '请填写跟进内容，例如： 17：00点前给用户打电话'
        },
        rules: [ // 校验
            { required: true, message: '跟进内容必填！' }
        ]
    },

    {
        prop: 'advanceNotice',
        label: '时间提醒',
        type: 'select',
        defaultVal: '',
        attr: {
            placeholder: '请选择时间提醒',
            clearable: true
        },
        rules: [ // 校验
            { required: true, message: '时间提醒必选！' }
        ],
        options: [
            {
                label: '提前10分钟提醒',
                value: 10
            },
            {
                label: '提前20分钟提醒',
                value: 20
            }, {
                label: '提前30分钟提醒',
                value: 30
            },
            {
                label: '提前1小时提醒',
                value: 60
            }
        ]
    },
    {
        prop: 'executorUserIds',
        slot: 'executorUserIds',
        label: '添加待办人',
        type: 'select',
        defaultVal: [],
        attr: {
            placeholder: '请选择待办人',
            clearable: true
        },
        rules: [ // 校验
            { required: true, message: '添加待办人必选！' }
        ],
        options: []
    },
    {
        prop: 'type',
        label: '跟进方式',
        type: 'checkbox',
        defaultVal: ['101'],
        options: Agency_follow_up_method,
        rules: [ // 校验
            { required: true, message: '跟进方式必选！' }
        ]
    }

]

const valiMobile = (rule, value, callback) => {
  if (value && !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号格式'))
  } else {
    callback()
  }
}
// 发短信
export const messageForm = [
  {
    prop: 'mobile',
    label: '用户手机号',
    type: 'input',
    defaultVal: '',
    attr: {
      placeholder: '请填写用户手机号',
      clearable: true
    },
    rules: [ // 校验
      { required: true, message: '用户手机号必填！', trigger: 'blur' },
      { validator: valiMobile, trigger: 'blur' }
    ]
  },
  {
    prop: 'scenarioId',
    slot: 'scenarioId',
    label: '选择模板',
    options: [],
    rules: [ // 校验
      { required: true, message: '请选择模板!' }
    ]
  },
  {
    prop: 'closeEnum',
    slot: 'closeEnum',
    label: '关闭投诉单',
    defaultVal: 0
  },
  {
    prop: 'tips',
    slot: 'tips',
    label: ''
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
