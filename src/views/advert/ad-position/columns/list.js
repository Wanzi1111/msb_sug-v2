import moment from 'moment'
/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
export default [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
    width: 60,
    fixed: true
  },
  {
    prop: 'advertName',
    label: '广告位',
    align: 'center',
    minWidth: 260
  },
  {
    prop: 'bussinessName',
    label: '业务类型',
    align: 'center'
  },
  {
    prop: 'clientType',
    label: '客户端',
    align: 'center'
  },
  {
    prop: 'advertType',
    label: '广告类型',
    align: 'center'
  },
  {
    prop: 'totalCount',
    label: '广告数量',
    align: 'center'
  },
  {
    prop: 'updateTime',
    label: '操作时间',
    align: 'center',
    width: 160,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    name: 'action',
    width: 100,
    prop: 'action',
    label: '操作',
    align: 'center',
    action: true
  }
]
export const actions = ({ startUsing }) => {
  return {
    action: (dat, row, index) => {
      let putBtn = {}
      if (row.enabled) {
        putBtn = {
          label: '启用',
          attr: {
            size: 'mini',
            icon: 'el-icon-success',
            type: 'success'
          }
        }
      } else {
        putBtn = {
          label: '禁用',
          attr: {
            size: 'mini',
            icon: 'el-icon-warning',
            type: 'danger'
          }
        }
      }
      return [
        {
          type: 'button',
          click: startUsing,
          ...putBtn
        }
      ]
    }
  }
}
