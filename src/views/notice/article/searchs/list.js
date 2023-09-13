/**
 * @author: Liwei
 * @description: 公告列表搜索栏配置
 * @date: 2020/1/6
 */
export default [
  {
    prop: 'id',
    label: '文章ID',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入文章ID'
    }
  },
  {
    prop: 'name',
    label: '文章名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入文章名称'
    }
  },
  {
    prop: 'time',
    label: '添加时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    // defaultVal: [],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  {
    prop: 'status',
    label: '文章状态',
    type: 'select', // 选择器,
    options: [
      {
        label: '显示',
        value: 0
      },
      {
        label: '隐藏',
        value: 1
      }
    ],
    attr: {
      placeholder: '请选择文章状态'
    }
  }
]

