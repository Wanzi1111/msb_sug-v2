/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */

export default [
  {
    prop: 'prizeMonth',
    label: '下发月份',
    align: 'center'
  },
  {
    prop: 'name',
    label: '奖品信息',
    align: 'center',
    render: (h, dat, row) => {
      return `${dat}  ${row.commodityCode || ''}`
    }
  },
  {
    prop: 'action',
    label: '操作',
    action: true,
    align: 'center',
    name: 'action',
    width: 225
  }
]
