/**
 * @author: Liwei
 * @description: 商品列表搜索条配置
 * @date:
 */
export default [
  {
    prop: 'code',
    label: '商品编号',
    type: 'input',
    attr: {
      placeholder: '全部'
    }
  },
  {
    prop: 'name',
    label: '商品名称',
    type: 'input',
    attr: {
      placeholder: '全部'
    }
  },
  {
    prop: 'type',
    label: '商品类别',
    type: 'select',
    attr: {
      placeholder: '全部'
    },
    options: [
      {
        label: '商品',
        value: 'sp'
      },
      {
        label: '非卖品',
        value: 'fmp'
      },
      {
        label: '赠品',
        value: 'zp'
      }
    ]
  },
  {
    prop: 'category',
    label: '商品分类',
    type: 'cascader',
    hide: true,
    attr: {
      placeholder: '全部',
      options: [
        {
          label: '画具',
          value: 'hj',
          children: [
            {
              label: '马克笔',
              value: 'mkb'
            },
            {
              label: '水彩笔',
              value: 'scb'
            }
          ]
        },
        {
          label: '其他',
          value: 'qt',
          children: [
            {
              label: '海报',
              value: 'hb'
            },
            {
              label: '书签',
              value: 'sq'
            }
          ]
        }
      ]
    }
  },
  {
    prop: 'state',
    label: '商品状态',
    type: 'select',
    hide: true,
    attr: {
      placeholder: '全部'
    },
    options: [
      {
        label: '上架中',
        value: 1
      },
      {
        label: '已下架',
        value: 0
      }
    ]
  },
  {
    prop: 'time',
    label: '上架日期',
    type: 'dateTimePicker', // 日期时间选择器,
    hide: true,
    layer: 'large',
    // defaultVal: [],
    attr: {
      type: 'datetimerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      defaultTime: ['00:00:00', '23:59:59'],
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }
  }
]

