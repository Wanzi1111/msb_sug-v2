import moment from 'moment'
import { updateShowAndHide } from '@/api/notice/article'
import { Message } from 'element-ui'

/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */
export default ({ getList }) => {
  return [
    {
      prop: 'id',
      label: 'ID',
      align: 'center',
      width: 60,
      fixed: true
    },
    {
      prop: 'sequence',
      label: '排序',
      width: 120,
      align: 'center',
      render: (h, dat, row) => {
        return h('el-input', {
          props: {
            value: dat
          },
          attrs: {
            placeholder: '请输入数字'
          },
          on: {
            input: (e) => {
              row.sequence = e
            },
            blur: () => {
              const { sequence, originSequence, id } = row
              if (sequence === originSequence || !sequence || !/^\d*$/.test(sequence)) {
                row.sequence = originSequence
                return
              }
              updateShowAndHide({
                id, sequence
              }).then(() => {
                Message.success('调整文章排序成功')
                getList()
              }).catch(() => {
                row.sequence = originSequence
              })
            }
          }
        })
      }
    },
    {
      prop: 'announcementName',
      label: '公告文章名称',
      align: 'center',
      minWidth: 110
    },
    {
      action: true,
      name: 'coverUrl',
      prop: 'coverUrl',
      label: '封面图',
      align: 'center'
    },
    {
      prop: 'createTime',
      label: '添加时间',
      align: 'center',
      width: 160,
      render: (h, dat) => {
        return moment(dat).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      prop: 'showType',
      label: '显示类型',
      align: 'center',
      render: (h, dat) => {
        return dat ? '显示正文' : '跳转'
      }
    },
    {
      prop: 'viewCount',
      label: '浏览量',
      align: 'center',
      render: (h, dat) => {
        return dat || '-'
      }
    },
    {
      action: true,
      name: 'abandon',
      prop: 'abandon',
      label: '状态',
      align: 'center'
    },
    {
      action: true,
      name: 'action',
      width: 230,
      prop: 'action',
      label: '操作',
      align: 'center',
      fixed: 'right'
    }
  ]
}
export const actions = ({ updateNotice, previewNotice, changeNotice }) => {
  return {
    coverUrl: [
      {
        type: 'img'
      }
    ],
    abandon: (dat, row, index) => {
      if (row.abandon) {
        return [
          {
            type: 'tag',
            label: '隐藏',
            attr: {
              type: 'info'
            }
          }
        ]
      } else {
        return [
          {
            type: 'tag',
            label: '显示',
            attr: {
              type: 'success'
            }
          }
        ]
      }
    },
    action: (dat, row, index) => {
      let showBtn = {}
      if (row.abandon) {
        showBtn = {
          label: '显示',
          attr: {
            size: 'mini',
            icon: 'el-icon-view',
            type: 'success'
          }
        }
      } else {
        showBtn = {
          label: '隐藏',
          attr: {
            size: 'mini',
            icon: 'el-icon-view',
            type: 'danger'
          }
        }
      }
      return [
        {
          type: 'button',
          label: '修改',
          click: updateNotice,
          attr: {
            size: 'mini',
            icon: 'el-icon-edit',
            type: 'primary'
          }
        },
        {
          type: 'button',
          label: '查看',
          click: previewNotice,
          attr: {
            size: 'mini',
            icon: 'el-icon-view',
            type: row.showType === 0 ? 'info' : '',
            disabled: row.showType === 0
          }
        },
        {
          type: 'button',
          click: changeNotice,
          ...showBtn
        }
      ]
    }
  }
}
