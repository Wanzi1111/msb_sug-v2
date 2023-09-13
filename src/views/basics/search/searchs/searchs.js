/**
 * @author: Liwei
 * @description: 搜索框配置
 * @date: 2020/1/4
 */
export default [
  // {
  // 	label: '单选',
  // 	type: 'radio', // 单选框,
  // },
  // {
  // 	label: '多选',
  // 	type: 'checkbox', // 多选框,
  // },
  {
    prop: 'name1',
    label: '输入框',
    type: 'input', // 输入框,
    defaultVal: 'AA'
  },
  {
    prop: 'name2',
    label: '输入框',
    type: 'input', // 输入框,
    defaultVal: 'BB'
  },
  // {
  //   prop: 'name3',
  //   label: '输入框',
  //   type: 'input' // 输入框,
  // },
  {
    prop: 'name4',
    label: '输入框',
    type: 'input', // 输入框,
    hide: true
  },

  // {
  // 	label: '计数器',
  // 	type: 'inputNumber', // 计数器,
  // },
  {
    prop: 'select',
    label: '选择器',
    type: 'select', // 选择器,
    defaultVal: 'a',
    options: [
      {
        label: 'A',
        value: 'a'
      }
    ]
  },
  // {
  // 	label: '级联选择器',
  // 	type: 'cascader', // 级联选择器,
  // },
  // {
  // 	label: '开关',
  // 	type: 'switch', // 开关,
  // },
  // {
  // 	label: '滑块',
  // 	type: 'slider', // 滑块,
  // },
  // {
  // 	label: '时间选择器',
  // 	type: 'timePicker', // 时间选择器,
  // },
  // {
  // 	label: '日期选择器',
  // 	type: 'datePicker', // 日期选择器,
  // },
  {
    prop: 'time',
    label: '日期时间',
    type: 'dateTimePicker', // 日期时间选择器,
    hide: true,
    layer: 'large',
    // defaultVal: [],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始日期A',
      endPlaceholder: '结束日期B',
      defaultTime: ['12:00:00'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  }
  // {
  // 	label: '评分',
  // 	type: 'rate', // 评分,
  // },
  // {
  // 	label: '颜色选择器',
  // 	type: 'colorPicker', // 颜色选择器,
  // },
]

