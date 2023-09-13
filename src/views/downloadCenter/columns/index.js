import moment from 'moment'
import Clock from '../components/clock.vue'
export default [
  {
    prop: 'fileName',
    label: '文件名称',
    minWidth: 200,
    align: 'center'
  },
  {
    action: true,
    prop: 'status',
    label: '状态',
    name: 'tag',
    width: 120,
    align: 'center'
  },
  {
    prop: 'ctime',
    label: '操作时间',
    minWidth: 140,
    align: 'center',
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'utime',
    label: '失效时间',
    minWidth: 140,
    align: 'center',
    render: (h, item, data) => {
      return (
        <div>
         <Clock key={item} columns={data} />
        </div>
      )
    }
  },
  {
    prop: 'staffName',
    label: '操作人',
    minWidth: 80,
    align: 'center'
  },
  {
    slot: 'action',
    width: 100,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
}
]
export const actions = () => {
  return {
    tag: (dat, row, index) => {
      const type = ['warning', 'primary', 'success']
      const typeStatus = ['处理中', '已完成', '处理失败']
      return [
        {
          type: 'tag',
          label: typeStatus[+row.status] || '-',
          attr: {
            type: type[+row.status]
          }
        }
      ]
    }
  }
}

