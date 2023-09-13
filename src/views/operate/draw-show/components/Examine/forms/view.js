/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/5/7
 */
export default [
  {
    prop: 'authorId',
    label: '视频作者',
    type: 'text'
  },
  {
    prop: 'videoUrl',
    label: '上传视频',
    type: 'upload-media',
    attr: {
      disabled: true
    },
    mediaRules: {
      media: 'video',
      type: 'MP4,m3u8'
    }
  },
  {
    prop: 'status',
    label: '审核结果',
    type: 'text'
  }
]

export const actions = ({ closeDl }) => {
  return {
    submit: {
      hide: true
    },
    back: {
      hide: true
    },
    quit: {
      click: () => closeDl(),
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
