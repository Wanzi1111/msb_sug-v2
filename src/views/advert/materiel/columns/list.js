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
    prop: 'resourceName',
    label: '物料名称',
    align: 'center'
  },
  {
    prop: 'resourceSize',
    label: '物料尺寸',
    align: 'center'
  },
  {
    action: true,
    name: 'type',
    prop: 'type',
    label: '物料类型',
    align: 'center'
  },
  {
    prop: 'updateTime',
    label: '上传时间',
    align: 'center',
    minWidth: 160,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    action: true,
    name: 'action',
    width: 230,
    prop: 'action',
    label: '操作',
    align: 'center'
  }
]
export const actions = ({ updateMateruel, previewMateruel, fastPut }) => {
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
    action: [
      {
        type: 'button',
        label: '更换',
        click: updateMateruel,
        attr: {
          size: 'mini',
          icon: 'el-icon-edit-outline',
          type: 'primary'
        }
      },
      {
        type: 'button',
        label: '预览',
        click: previewMateruel,
        attr: {
          size: 'mini',
          icon: 'el-icon-view'
        }
      },
      {
        type: 'button',
        label: '投放',
        click: fastPut,
        attr: {
          size: 'mini',
          icon: 'el-icon-upload',
          type: 'primary'
        }
      }
    ]
  }
}
