import moment from 'moment'

/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
export const actions = ({ view, edit, del }) => {
  return {
    action: (dat, row, index) => {
      if (moment().valueOf() <= moment(row.prizeMonth).endOf('month').valueOf()) {
        return [
          {
            type: 'button',
            label: '素材预览',
            click: () => view(row),
            attr: {
              size: 'mini',
              icon: 'el-icon-view'
            }
          },
          {
            type: 'button',
            label: '修改',
            click: () => edit(true, row),
            attr: {
              type: 'primary',
              size: 'mini',
              icon: 'el-icon-edit'
            }
          },
          {
            type: 'button',
            label: '删除',
            click: () => del(row),
            attr: {
              type: 'danger',
              size: 'mini',
              icon: 'el-icon-del'
            }
          }
        ]
      } else {
        return [
          {
            type: 'text',
            label: '—'
          }
        ]
      }
    }
  }
}
