/**
 * @author: huzhifu
 * @description:
 * @date: 2020/5/11
 */

const typeMap = {
  1: '菜单目录'
}

export default [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
    width: 60,
    type: 'test',
    name: 'id'
  },
  {
    prop: 'name',
    label: '菜单名称',
    minWidth: 100,
    align: 'left',
    columnKey: 'id'
  },
  {
    prop: 'type',
    label: '类型',
    align: 'center',
    action: true,
    name: 'type'
  },
  {
    prop: 'url',
    label: '请求地址',
    minWidth: 220,
    align: 'center'
  },
  {
    prop: 'actions',
    label: '操作',
    align: 'center',
    action: true,
    name: 'actions'
  }
]
export const actions = ({ handleMenuEdit }) => {
  return {
    id: (dat, row, index) => {
      return [{
        type: 'span',
        label: row.id
      }]
    },
    type: (dat, row, index) => {
      return [{
        type: 'span',
        label: typeMap[row.type]
      }]
    },
    actions: (dat, row, index) => {
      return [
        {
          type: 'button',
          label: '编辑',
          click: handleMenuEdit,
          attr: {
            size: 'mini',
            icon: 'el-icon-edit',
            type: 'success'
          }
        }
      ]
    }
  }
}
