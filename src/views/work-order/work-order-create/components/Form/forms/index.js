/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-11-09 11:25:54
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 20:57:27
 */
// 添加
const { baseData: { work_order_type, work_order_priority }} = window
export const sugForm = [
  {
    prop: 'userId',
    label: '用户信息',
    attr: {
      style: {
        width: '380px'
      }
    },
    slot: 'complaintPeople'
    // rules: [ // 校验
    //   { required: true, message: '用户ID必填！' }
    // ]
    // prop: 'inputName'
  },
  {
    prop: 'userName',
    label: '用户姓名',
    type: 'input',
    attr: {
      placeholder: '请输入',
      style: {
        width: '380px'
      }
    }
    // rules: [ // 校验
    //   { required: true, message: '用户姓名必填' }
    // ]
    // slot: 'complaintPeople'
    // prop: 'inputName'
  },
  {
    prop: 'userMobile',
    label: '手机号',
    type: 'input',
    attr: {
      placeholder: '请输入',
      style: {
        width: '380px'
      }
    }
    // rules: [ // 校验
    //   { required: true, message: '手机号必填' }
    // ]
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
    prop: 'userRemarkContent',
    label: '备注信息',
    type: 'input',
    attr: {
      placeholder: '请输入备注信息',
      style: {
        width: '380px'
      }
    }
  },
  {
    prop: 'problemOneLevel',
    label: '工单类型',
    type: 'radio',
    defaultVal: '1',
    attr: {
      placeholder: '请选择工单类型',
      style: {
        width: '380px'
      }
    },
    options: work_order_type
  },
  {
    prop: 'problemTwoLevel',
    label: '二级分类',
    type: 'radio', // 多文本
    defaultVal: '11',
    options: [],
    visible: false,
    rules: [ // 校验
      { required: true, message: '二级分类必选！' }
    ]
  },
  {
    prop: 'problemThreeLevel',
    label: '三级分类',
    type: 'radio', // 多文本
    defaultVal: '1101',
    options: [],
    visible: false,
    rules: [ // 校验
      { required: true, message: '三级分类必选！' }
    ]
  },
  {
    prop: 'dingUserName',
    label: '被投诉人',
    visible: false,
    type: 'input',
    attr: {
      placeholder: '请输入被投诉人',
      style: {
        width: '380px'
      }
    }
  },
  {
    prop: 'priority',
    label: '处理优先级',
    type: 'radio',
    attr: {
      placeholder: '请选择处理优先级',
      style: {
        width: '380px'
      }
    },
    defaultVal: '5',
    options: work_order_priority,
    rules: [
      { required: true, message: '优先级必选' }
    ]
  },
  {
    prop: 'problemPid',
    label: '问题分类',
    type: 'select', // 选择器,
    defaultVal: '',
    visible: true,
    rules: [ // 校验
      { required: true, message: '问题类型必选！' }
    ],
    options: []
  },
  {
    prop: 'problemId',
    label: '投诉问题',
    type: 'select', // 选择器,
    visible: true,
    defaultVal: [],
    attr: {
      multiple: true,
      collapseTags: true
    },
    rules: [ // 校验
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
      multiple: true,
      collapseTags: true
    },
    options: []
  },
  {
    prop: 'problemIdFour',
    label: '四级分类',
    type: 'select', // 选择器,
    visible: true,
    attr: {
      multiple: true,
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
      multiple: true,
      collapseTags: true
    },
    options: []
  },
  // {
  //   prop: 'cpComent',
  //   label: '投诉内容',
  //   type: 'textarea',
  //   visible: true,
  //   attr: {
  //     placeholder: '请输入投诉内容',
  //     style: {
  //       width: '380px'
  //     }
  //   },
  //   rules: [
  //     { required: true, message: '投诉内容不为空' }
  //   ]
  // },
  {
    prop: 'cpComent',
    label: '问题描述',
    type: 'textarea', // 多文本
    defaultVal: `示例：\n 用户设备：红米手机；Redmi K20 Pro \n APP版本号/浏览器版本：V2.8.0\n 操作异常时间：2021.09.12 12:01\n 操作路径：首页-免费领课-分享海报至朋友圈得赠课,点击分享报错\n 报错信息: 网络异常 `,
    attr: {
      placeholder: '请输入问题描述',
      autosize: { minRows: 6 },
      maxlength: 1500
    },
    rules: [
      { required: true, message: '问题描述必填！', trigger: 'change' }
    ]
  },
  {
    prop: 'imgUrl',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {
      type: 'text',
      text: '点击页面空白处，即可粘贴图片进行上传(暂不支持多文件同时上传)'
    },
    paste: true,
    attr: {
      limit: 5,
      action: 'picture-card',
      listType: 'picture-card'
    },
    mediaRules: {
      size: 20,
      media: 'img',
      type: 'GIF,PNG,JPG,JPEG'
    }
  },
  // {
  //   prop: 'videoUrl',
  //   label: '视频/音频',
  //   // type: 'input',
  //   // attr: {
  //   //   placeholder: '请输入'
  //   // },
  //   slot: 'videoUrl'
  //   // prop: 'inputName'
  // },

  {
    prop: 'videoUrl',
    label: '视频/音频',
    type: 'upload-media',
    many: true,
    drag: true,
    defaultVal: [{}],
    mediaRules: {
      time: 240,
      size: 200,
      media: 'video',
      type: 'MP4,m3u8,MP3'
    },
    attr: {
      limit: 5
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200M以下的视频，支持MP4、m3u8格式，或音频，支持MP3。'
    }
  },
  {
    prop: 'sync',
    label: '同步服务记录',
    type: 'switch',
    defaultVal: true
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
