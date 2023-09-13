/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */
import moment from 'moment'

export default [
  {
    prop: 'batchId',
    label: '批次',
    align: 'center'
  },
  {
    prop: 'createTime',
    label: '导入时间',
    align: 'center',
    render: (h, dat) => {
      return dat ? moment(dat).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  },
  {
    prop: 'successDataNum',
    label: '异常数据/全部数据',
    align: 'center',
    render: (h, dat, row) => {
      return h('span', [
        h('span', { style: { color: row.errorDataNum ? '#ff4949' : '' }}, row.errorDataNum),
        h('span', `/${row.totalDataNum}`)
      ])
    }
  },
  {
    prop: 'totalDataNum',
    label: '导入数据',
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    width: 360,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ look, download }) => {
  return {
    action: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '查看物流单',
          click: () => look(row),
          attr: {
            size: 'mini',
            icon: 'el-icon-truck'
          }
        },
        {
          type: 'button',
          label: '下载成功数据',
          click: () => download(1, row),
          attr: {
            size: 'mini',
            icon: 'el-icon-download',
            type: 'success',
            loading: '_logistics_manage_exportRecord',
            plain: true
          }
        },
        {
          type: 'button',
          label: '下载失败数据',
          click: () => download(0, row),
          attr: {
            size: 'mini',
            icon: 'el-icon-download',
            type: 'danger',
            loading: '_logistics_manage_exportRecord',
            plain: true
          }
        }
      ]
    }
  }
}

