// 添加或者编辑表单
export const userForm = [
  {
    prop: 'staffName',
    label: '姓名',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入姓名'
      // disabled: false
    },
    rules: [
      { required: true, message: '请输入姓名' }
    ]
  },
  {
    prop: 'staffMobile',
    label: '手机号',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入手机号',
      disabled: false
    },
    rules: [
      { required: true, message: '请输入手机号' }
    ]
  },
  {
    prop: 'businessCard',
    label: '对外名片',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入对外名片'
    },
    rules: [
      { required: true, message: '请输入对外名片' }
    ]
  },
  {
    prop: 'role',
    label: '角色分组',
    type: 'select',
    options: [],
    rules: [
      { required: true, message: '请选择角色分组' }
    ]
  },
  {
    prop: 'manageBusiness',
    label: '业务线',
    type: 'cascader',
    // defaultVal: [['1', '11'], ['1', '10']],
    rules: [
      { required: true, message: '请选择业务线' }
    ],
    attr: {
      placeholder: '全部',
      props: {
        multiple: true
      },
      'collapse-tags': true,
      options: [
        // {
        //   label: '全部',
        //   value: '1',
        //   children: [
        //     {
        //       label: '1v1',
        //       value: '11'
        //     },
        //     {
        //       label: '小班课',
        //       value: '10'
        //     }
        //   ]
        // }
      ]
    }
  },
  {
    prop: 'serviceObject',
    label: '服务对象',
    type: 'checkbox',
    options: [],
    rules: [
      { required: true, message: '请选择服务对象' }
    ]
  },
  {
    prop: 'serviceProblem',
    label: '服务问题',
    slot: 'serviceProblem',
    rules: [
      { required: true, message: '请选择问题分类', trigger: 'change' }
    ]
  },
  {
    prop: 'problemIdOne',
    // hide: true,
    // noShow: true,
    defaultVal: [],
    rules: [
      { required: true, message: '请选择问题分类', trigger: 'change' }
    ]
  },
  {
    prop: 'problemIdTwo',
    defaultVal: [],
    hide: true,
    noShow: true
  },
  {
    prop: 'problemIdThree',
    defaultVal: [],
    hide: true,
    noShow: true
  },
  {
    prop: 'problemIdFour',
    defaultVal: [],
    hide: true,
    noShow: true
  },
  {
    prop: 'problemIdFive',
    defaultVal: [],
    hide: true,
    noShow: true
  }
]

export const resetPassword = [
  {
    prop: 'staffName',
    label: '姓名',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入姓名',
      disabled: true
    }
  },
  {
    prop: 'businessCard',
    label: '对外名片',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入对外名片',
      disabled: true
    }
  },
  {
    prop: 'password',
    label: '新密码',
    type: 'input', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入新密码'
    },
    rules: [
      { required: true, message: '请输入新密码' }
    ]
  }
]

export const actions = ({ cancel, ensure }) => {
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
      click: cancel,
      type: 'button',
      label: '取消'
    }
  }
}
