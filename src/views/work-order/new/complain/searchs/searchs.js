const { baseData: { work_order_source, work_order_status, Agency_follow_up_method }} = window

export default [
  {
    prop: 'workOrderType',
    slot: 'workOrderType',
    defaultVal: '1',
    label: '工单类型'
  },
  {
    prop: 'channelId',
    label: '投诉途径',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      multiple: true,
      filterable: true,
      collapseTags: true,
      placeholder: '请选择'
    },
    options: []
  },
  {
    // prop: 'name',
    label: '处理人',
    // type: 'input',
    // attr: {
    //   placeholder: '请输入'
    // },
    slot: 'handlePeople',
    prop: 'inputName1'
  },
  {
    prop: 'selectName1',
    defaultVal: '1',
    hide: false,
    visible: false
  },
  {
    prop: 'userType',
    label: '用户类型',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      multiple: true,
      filterable: true,
      collapseTags: true,
      placeholder: '请选择'
    },
    options: []
  },
  {
    prop: 'inputName',
    label: '投诉人',
    defaultVal: '',
    // type: 'input',
    // attr: {
    //   placeholder: '请输入'
    // },
    slot: 'complaintPeople'
  },
  {
    prop: 'selectName',
    defaultVal: '3',
    hide: false,
    visible: false
  },
  {
    prop: 'problemId',
    label: '投诉问题',
    type: 'cascader',
    attr: {
      placeholder: '请选择',
      options: [],
      clearable: true
    }
  },
  {
    prop: 'problemIdThree',
    label: '三级分类',
    type: 'select', // 选择器,
    options: [],
    attr: {
      clearable: true
    }
  },
  {
    prop: 'problemIdFour',
    label: '四级分类',
    visible: true,
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'problemIdFive',
    label: '五级分类',
    visible: true,
    type: 'select', // 选择器,
    options: []
  },
  {
    prop: 'logisticsId',
    label: '物流单号',
    type: 'input',
    visible: false,
    attr: {
      placeholder: '请输入',
      options: []
    }
  },
  {
    prop: 'userRemarkNine',
    label: '班主任',
    type: 'input',
    visible: true,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'userRemarkTwo',
    label: '课程顾问',
    type: 'input',
    visible: true,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'userRemarkTwo1',
    label: '教管',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  // 小班课用户
  {
    prop: 'userRemarkTwo2',
    label: '班主任',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'userRemarkFour',
    label: '销售',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  // 小班课老师
  {
    prop: 'userRemarkTwo3',
    label: '所属职场',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  // 小熊和写字用户
  {
    prop: 'useRemarkOne',
    label: '体验课负责人',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'userRemarkThree',
    label: '系统课负责人',
    type: 'input',
    visible: false,
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'cpComent',
    label: '投诉内容',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'role',
    label: '处理人角色',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      multiple: true,
      filterable: true,
      collapseTags: true,
      placeholder: '请选择'
    },
    options: []
  },
  {
    prop: 'complaintNo',
    label: '投诉单',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'creatUserName',
    label: '创建人',
    type: 'input',
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'restartTimes',
    label: '重新激活次数',
    type: 'inputNumber',
    visible: true,
    attr: {
      controlsPosition: 'right',
      min: 1,
      max: 10,
      placeholder: '请输入1-10之间的正整数'
    }
  },
  {
    prop: 'pendingType',
    label: '跟进方式',
    type: 'select', // 选择器,
    defaultVal: '',
    visible: true,
    attr: {
      size: 'small',
      filterable: true,
      collapseTags: true,
      placeholder: '请选择'
    },
    options: Agency_follow_up_method
  },
  {
    prop: 'exceedStandard',
    label: '超售后标准',
    type: 'select',
    visible: false,
    attr: {
      placeholder: '请选择',
      clearable: true
    },
    options: [{
      label: '否',
      value: '0'
    }, {
      label: '是',
      value: '1'
    }]
  },
  {
    prop: 'outTradeNo',
    label: '订单号',
    type: 'input',
    visible: false,
    attr: {
      placeholder: '请选择',
      options: []
    }
  },
  {
    prop: 'flagSign',
    slot: 'flagSign'
  }
]

export const workSearch = [
  {
    prop: 'workChannel',
    label: '工单来源',
    type: 'select', // 选择器,
    attr: {
      size: 'small',
      placeholder: '请选择'
    },
    defaultVal: '',
    options: [{ label: '全部', value: '' }, ...work_order_source]
  },
  {
    prop: 'problemTwoLevel',
    label: '二级分类',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      size: 'small',
      placeholder: '默认全部'
    },
    defaultVal: [],
    options: []
  },
  {
    prop: 'problemThreeLevel',
    label: '三级分类',
    type: 'select', // 选择器,
    attr: {
      multiple: true,
      collapseTags: true,
      size: 'small',
      placeholder: '默认全部'
    },
    defaultVal: [],
    options: []
  },
  {
    prop: 'userInfo',
    label: '用户信息',
    type: 'inputSelect', // 选择器,
    inputSelect: {
      prop: 'userInfoInputSelectProp',
      attr: {
        size: 'small'
      },
      options: [
        {
          label: 'UID',
          value: '1'
        },
        {
          label: '手机号',
          value: '2'
        }
      ]
    },
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'userInfoInputSelectProp',
    defaultVal: '1',
    hide: true,
    visible: false
  },
  {
    prop: 'handleInfo',
    label: '处理人',
    type: 'inputSelect', // 选择器,
    inputSelect: {
      prop: 'handleInfoInputSelectProp',
      attr: {
        size: 'small'
      },
      options: [
        {
          label: '姓名',
          value: '1'
        },
        {
          label: '手机号',
          value: '2'
        }
      ]
    },
    attr: {
      size: 'small',
      placeholder: '请输入'
    }
  },
  {
    prop: 'handleInfoInputSelectProp',
    defaultVal: '1',
    hide: false,
    visible: false
  },
  {
    prop: 'cpStatus',
    label: '工单状态',
    type: 'checkbox', // 选择器,
    defaultVal: ['1'],
    layer: 'large',
    options: work_order_status
  }
]
