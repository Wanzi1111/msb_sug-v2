import moment from 'moment'

/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
const valiPass = (rule, value, callback) => {
  const val = value.filter(e => e || e.length)
  const integer = value.filter(e => {
    const n = parseFloat(e)
    return /(^[1-9]\d*$)/.test(n)
  })
  if (val.length < 2) {
    callback(new Error('请输入排名区间'))
  } else if (integer.length < 2) {
    callback(new Error('请输入正整数'))
  } else if (parseInt(integer[0]) > parseInt(integer[1])) {
    callback(new Error('开始排名不能大于结束排名'))
  } else {
    callback()
  }
}
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
    prop: 'rank',
    label: '获奖排名',
    type: 'inputBox', // 输入框,
    rules: [
      { required: true, message: ' ' },
      { validator: valiPass, trigger: 'blur' }
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
