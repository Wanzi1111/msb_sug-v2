import moment from 'moment'

/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */

export default [
  {
    prop: 'prizeMonth',
    label: '发布月份',
    type: 'datePicker', // 日期时间选择器,
    attr: {
      type: 'month',
      placeholder: '请选择发布月份',
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < moment().startOf('month').valueOf()
        }
      }
    },
    rules: [
      { required: true, message: '发布月份不能为空' }
    ]
  },
  {
    prop: 'name',
    label: '奖品名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入奖品名称',
      maxlength: 20
    },
    rules: [
      { required: true, message: '奖品名称不能为空' }
    ]
  },
  {
    prop: 'commodityCode',
    label: '中台商品码',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入中台商品码',
      maxlength: 50
    }
    // rules: [
    //   { required: true, message: '中台商品码不能为空' }
    // ]
  },
  {
    prop: 'imageUrl',
    label: '奖品图片',
    type: 'upload-media', // 上传,
    mediaRules: {
      // width: 100,
      // height: 200,
      // ratio: .5,
      time: 60,
      size: 0.1953125,
      media: 'img',
      type: 'PNG,JPG,JPEG'
    },
    note: true,
    noteConfig: {
      type: 'text',
      text: '请上传200KB以下的图片，支持PNG、JPG和JPEG格式'
    },
    rules: [
      { required: true, message: '奖品图片不能为空' }
    ]
  }
]
