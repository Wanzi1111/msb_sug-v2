/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import ChrCate from '../components/ChrCate'

export default [
  {
    align: 'center',
    type: 'expand',
    render: (h, dat, row) => {
      return h(ChrCate, {
        props: { row }
      })
    }
  },
  {
    prop: 'code',
    label: '序号',
    align: 'center',
    sortable: 'custom'
  },
  {
    prop: 'typeName',
    label: '类型名称',
    align: 'center'
  },
  {
    prop: 'typeDesc',
    label: '类型描述',
    align: 'center'
  },
  {
    action: true,
    name: 'action',
    prop: 'action',
    width: 280,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ switchState, edit }) => {
  return {
    action: (dat, row, index) => {
      if (row.status) {
        return [
          {
            type: 'button',
            label: '停用',
            click: () => switchState(0, row.id),
            attr: {
              size: 'mini',
              icon: 'el-icon-warning',
              type: 'danger',
              loading: '_product_type_isEnable'
            }
          }
        ]
      } else {
        return [
          {
            type: 'button',
            label: '启用',
            click: () => switchState(1, row.id),
            attr: {
              size: 'mini',
              icon: 'el-icon-check',
              type: 'success',
              loading: '_product_type_isEnable'
            }
          },
          {
            type: 'button',
            label: '编辑',
            click: () => edit(row),
            attr: {
              size: 'mini',
              icon: 'el-icon-edit',
              type: 'primary'
            }
          }
        ]
      }
    }
  }
}

