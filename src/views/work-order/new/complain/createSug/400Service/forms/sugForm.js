/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-11-09 11:25:54
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-09 18:59:12
 */
// 添加
export const userForm = [
  {
    prop: 'inputName',
    label: '用户信息',
    // type: 'input',
    // attr: {
    //   placeholder: '请输入'
    // },
    slot: 'complaintPeople'
    // prop: 'inputName'
  },
  {
    prop: '用户姓名',
    label: '用户姓名',
    type: 'input',
    attr: {
      placeholder: '请输入'
    },
    rules: [ // 校验
      { required: true, message: '用户姓名必填' }
    ]
    // slot: 'complaintPeople'
    // prop: 'inputName'
  },
  {
    prop: '手机号',
    label: '手机号',
    type: 'input',
    attr: {
      placeholder: '请输入'
    },
    rules: [ // 校验
      { required: true, message: '手机号必填' }
    ]
    // slot: 'complaintPeople'
    // prop: 'inputName'
  },
  {
    prop: 'userInfo',
    label: '用户信息',
    // type: 'input',
    // attr: {
    //   placeholder: '请输入'
    // },
    slot: 'userInfo'
    // prop: 'inputName'
  },
  {
    prop: '备注信息',
    label: '备注信息',
    type: 'input',
    attr: {
      placeholder: '请输入备注信息'
    }
  },
  {
    prop: 'problemPid',
    label: '投诉内容',
    type: 'select',
    attr: {
      placeholder: '请选择投诉内容'
    },
    options: [

    ],
    rules: [
      { required: true, message: '投诉内容不为空' }
    ]
  },
  {
    prop: 'problemId',
    label: '投诉问题',
    type: 'checkbox',
    options: [

    ]
  },
  {
    prop: ' 备注信息',
    label: ' ',
    type: 'textarea',
    attr: {
      placeholder: '请输入'
    }
  },
  // {
  //   prop: 'coverUrl',
  //   label: '图片',
  //   type: 'upload-media', // 上传,
  //   mediaRules: {
  //     // time: 60,
  //     // width: 100,
  //     // height: 200,
  //     size: 3,
  //     media: 'img',
  //     type: 'GIF,PNG,JPG,JPEG'
  //   },
  //   note: true,
  //   noteConfig: {
  //     type: 'text',
  //     text: '支持GIF、PNG、JPG和JPEG格式'
  //   }
  // },
  {
    prop: 'upload',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {

    },
    attr: {
      limit: 3,
      action: 'picture-card',
      listType: 'picture-card'
    }
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
