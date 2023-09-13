/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'resourceName',
    label: '物料名称',
    type: 'input', // 输入框,
    defaultVal: '',
    attr: {
      placeholder: '请输入物料名称'
    },
    rules: [
      { required: true, message: '物料名称不能为空' },
      { min: 1, max: 20, message: '长度不超过20个字符' }
    ]
  },
  {
    prop: 'resourceSize',
    label: '物料尺寸',
    type: 'radio', // 单选框,
    options: [],
    rules: [
      { required: true, message: '物料尺寸不能为空' }
    ]
  },
  {
    prop: 'type',
    label: '物料类型',
    type: 'radio', // 单选框,
    defaultVal: '0',
    options: [
      {
        label: '图片',
        value: '0'
      },
      {
        label: '视频',
        value: '1'
      }
    ],
    rules: [
      { required: true, message: '物料尺寸不能为空' }
    ]
  },
  {
    prop: 'resourceUrl',
    label: '上传图片',
    type: 'upload-media', // 上传,
    mediaRules: {
      // width: 100,
      // height: 200,
      // ratio: .5,
      time: 60,
      size: 3,
      media: 'img',
      type: 'GIF,PNG,JPG,JPEG'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传3M以下的图片，支持GIF、PNG、JPG和JPEG格式'
    },
    rules: [
      { required: true, message: '图片不能为空' }
    ]
  },
  {
    prop: 'coverUrl',
    label: '封面图',
    type: 'upload-media', // 上传,
    mediaRules: {
      time: 60,
      width: 100,
      height: 200,
      size: 3,
      media: 'img',
      type: 'GIF,PNG,JPG,JPEG'
    },
    note: true,
    visible: false,
    noteConfig: {
      type: 'text',
      text: '请上传3M以下的图片，支持GIF、PNG、JPG和JPEG格式'
    },
    rules: [
      { required: true, message: '封面图不能为空' }
    ]
  },
  {
    prop: 'resourceVideoUrl',
    label: '上传视频',
    type: 'upload-media',
    mediaRules: {
      time: 240,
      size: 200,
      media: 'video',
      type: 'MP4'
    },
    visible: false,
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200M以下的视频，支持MP4格式'
    },
    rules: [
      { required: true, message: '视频不能为空' }
    ]
  },
  {
    prop: 'otherUrl',
    label: '外链地址',
    type: 'input', // 输入框,
    defaultVal: '',
    attr: {
      placeholder: '请输入外链地址'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '支持小程序 、网页外链'
    }
  }
]

export const actions = {
  submit: {
    label: '上传'
  },
  back: {
    label: '取消'
  }
}
