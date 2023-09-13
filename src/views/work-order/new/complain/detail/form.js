/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-03 18:58:42
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-09 14:37:14
 */
const { baseData: { work_order_priority }} = window

export default [
  {
    prop: 'problemOneLevel',
    label: '工单类型',
    type: 'radio', // 多文本
    defaultVal: '',
    options: [],
    rules: [ // 校验
      { required: true, message: '工单类型必选！' }
    ]
  },
  {
    prop: 'problemTwoLevel',
    label: '二级分类',
    type: 'radio', // 多文本
    defaultVal: '',
    visible: true,
    options: [],
    rules: [ // 校验
      { required: true, message: '二级分类必选！' }
    ]
  },
  {
    prop: 'problemThreeLevel',
    label: '三级分类',
    type: 'radio', // 多文本
    defaultVal: '',
    visible: true,
    options: [],
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
    prop: 'priority',
    label: '处理优先级',
    type: 'radio',
    defaultVal: null,
    options: work_order_priority,
    rules: [
      { required: true, message: '处理优先级必选！' }
    ]
  },
  {
    prop: 'cpComent',
    label: '问题描述',
    type: 'textarea', // 多文本
    defaultVal: '',
    attr: {
      placeholder: '请输入问题描述',
      autosize: { minRows: 6 },
      maxlength: 1500
    },
    rules: [
      { required: true, message: '问题描述必填！' }
    ]
  },
  {
    prop: 'workUrl',
    label: '上传图片',
    type: 'upload', // 上传,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传3M以下的图片，支持GIF、PNG和JPG格式'
    },
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
  }
]
export const actions = {
  submit: {
    label: '确定',
    attr: {
      type: 'primary'
    }
  }
}

export const formActions = (cancel) => {
  return {
    submit: {
      hide: false // 是否显示 默认false
    },
    reset: {
      hide: true
    },
    back: {
      hide: true
    },
    cancel: {
      click: () => cancel(),
      type: 'button',
      label: '取消'
    }
  }
}
