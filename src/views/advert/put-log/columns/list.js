import moment from 'moment'

/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
export default [
  {
    prop: 'id',
    label: '投放ID',
    align: 'center',
    width: 70,
    fixed: true
  },
  {
    prop: 'advertName',
    label: '广告位',
    align: 'center',
    minWidth: 260
  },
  {
    prop: 'resourceName',
    label: '物料名称',
    align: 'center'
  },
  {
    prop: 'sequence',
    label: '排序',
    align: 'center'
  },
  {
    prop: 'startTime',
    label: '投放开始时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'endTime',
    label: '投放结束时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      const endTime = dat ? moment(dat).format('YYYY-MM-DD HH:mm:ss') : '不限'
      return endTime
    }
  },
  {
    action: true,
    name: 'publishStatus',
    prop: 'publishStatus',
    label: '投放状态',
    width: 110,
    align: 'center'
  },
  {
    prop: 'clickCount',
    label: '点击量',
    align: 'center',
    render: (h, dat) => {
      return dat || 0
    }
  },
  {
    prop: 'uvCount',
    label: 'UV',
    align: 'center',
    render: (h, dat) => {
      return dat || 0
    }
  },
  {
    action: true,
    name: 'action',
    width: 120,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const actions = ({ dataDetails }) => {
  return {
    type: (dat, row, index) => {
      if (row.type) {
        return [
          {
            type: 'tag',
            label: '视频',
            attr: {
              type: 'success'
            }
          }
        ]
      } else {
        return [
          {
            type: 'tag',
            label: '图片',
            attr: {
              type: ''
            }
          }
        ]
      }
    },
    publishStatus: (dat, row, index) => {
      const userType = [
        {
          label: '投放中',
          attr: {
            type: 'success'
          }
        },
        {
          label: '等待投放'
        },
        {
          label: '投放结束',
          attr: {
            type: 'info'
          }
        },
        {
          label: '未投放'
        }
      ]
      return [{ type: 'tag', ...userType[dat] }]
    },
    action: [
      {
        type: 'button',
        label: '数据详情',
        click: dataDetails,
        attr: {
          size: 'mini',
          icon: 'el-icon-view'
        }
      }
    ]
  }
}
