/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'announcementName',
    label: '标题',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入标题'
    },
    rules: [
      { required: true, message: '标题不能为空' }
    ]
  },
  {
    prop: 'remark',
    label: '概要',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入概要'
    },
    rules: [
      { required: true, message: '概要不能为空' }
    ]
  },
  {
    prop: 'sequence',
    label: '排序',
    type: 'inputNumber', // 输入框,
    attr: {
      placeholder: '请输入排序',
      min: 1
    },
    rules: [
      { required: true, message: '排序不能为空' }
    ]
  },
  {
    prop: 'fromUrl',
    label: '文章来源',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入文章来源'
    },
    rules: [
      { required: true, message: '文章来源不能为空' }
    ]
  },
  {
    prop: 'coverUrl',
    label: '公告封面',
    type: 'upload-media', // 上传,
    mediaRules: {
      size: 3,
      media: 'img',
      type: 'GIF,PNG,JPG,JPEG'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传3M以下的图片，支持GIF,PNG,JPG格式'
    },
    rules: [
      { required: true, message: '封面图不能为空' }
    ]
  },
  {
    prop: 'showType',
    label: '显示类型',
    type: 'radio', // 单选框,
    defaultVal: '1',
    options: [
      {
        label: '显示正文',
        value: '1'
      },
      {
        label: '跳转',
        value: '0'
      }
    ]
  },
  {
    prop: 'content',
    label: ' ',
    type: 'tinymce', // 富文本,
    attr: {
      width: '600px',
      toolbar: ['code undo redo | formatselect fontselect fontsizeselect', 'bold italic underline strikethrough | alignleft aligncenter alignright outdent indent | bullist numlist indent2em lineheight | formatpainter fullscreen', 'blockquote hr image'],
      menubar: ''
    },
    rules: [
      { required: true, message: '内容不能为空' }
    ]
  },
  {
    prop: 'addr',
    label: '外链地址',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入外链地址'
    },
    hide: true,
    note: true,
    noteConfig: {
      type: 'text',
      text: '支持网页外链'
    },
    rules: [
      { required: true, message: '外链地址不能为空' }
    ]
  }
]

export const actions = ({ preview, back }) => {
  return {
    back: {
      hide: true
    },
    preview: {
      label: '预览',
      click: preview,
      type: 'button',
      attr: {
        icon: 'el-icon-view',
        type: 'primary',
        plain: true
      }
    },
    uback: {
      label: '返回',
      click: back,
      type: 'button',
      attr: {
        icon: 'el-icon-back'
      }
    }
  }
}
