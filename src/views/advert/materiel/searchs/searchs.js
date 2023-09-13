/**
 * @author: Liwei
 * @description: 物料列表的搜索配置
 * @date: 2020/1/4
 */
export default [
  {
    prop: 'id',
    label: '物料ID',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入物料ID',
      type: 'number'
    }
  },
  {
    prop: 'resourceName',
    label: '物料名称',
    type: 'input', // 输入框,
    attr: {
      placeholder: '请输入物料名称'
    }
  },
  {
    prop: 'resourceSize',
    label: '物料尺寸',
    type: 'select', // 选择器,
    recovery: true,
    options: [

    ],
    attr: {
      placeholder: '请选择物料尺寸'
    }
  },
  {
    prop: 'type',
    label: '物料类型',
    type: 'select', // 选择器,
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
    attr: {
      placeholder: '全部'
    }
  },
  {
    prop: 'time',
    label: '上传时间',
    type: 'dateTimePicker', // 日期时间选择器,
    layer: 'large',
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  }
]

