/**
 * @author: liwei
 * @description:
 * @date: 2020/5/7
 */

import moment from 'moment'

export default [
  {
    fixed: true,
    prop: 'videoNo',
    label: '视频编号',
    minWidth: 160,
    align: 'center'
  },
  {
    prop: 'username',
    label: '视频作者',
    align: 'center'
  },
  {
    prop: 'authorId',
    label: '作者ID',
    align: 'center'
  },
  {
    prop: 'mobile',
    label: '作者手机号',
    minWidth: 130,
    align: 'center'
  },
  {
    prop: 'praiseNum',
    label: '获赞数',
    align: 'center'
  },
  {
    prop: 'isRecommend',
    label: '首页展示',
    align: 'center',
    render: (h, dat) => {
      return dat ? h('el-tag', { props: { type: 'success' }}, '已推荐') : h('el-tag', { props: { type: 'info' }}, '未推荐')
    }
  },
  {
    prop: 'ctime', // rtime 推荐时间
    label: '发布时间',
    minWidth: 160,
    align: 'center',
    render: (h, dat) => {
      return moment.unix(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'mtime',
    label: '最后操作时间',
    minWidth: 160,
    align: 'center',
    render: (h, dat) => {
      return moment.unix(dat).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  {
    prop: 'status',
    label: '视频状态',
    fixed: 'right',
    align: 'center',
    render: (h, dat) => {
      let tag
      switch (dat) {
        case 0:
          tag = h('el-tag', { props: { type: 'danger' }}, '已驳回')
          break
        case 1:
          tag = h('el-tag', '待审核')
          break
        case 2:
          tag = h('el-tag', { props: { type: 'success' }}, '已上线')
          break
        default:
          tag = h('el-tag', { props: { type: 'info' }}, '已下线')
          break
      }
      return tag
    }
  },
  {
    prop: 'opUserName',
    label: '操作人',
    align: 'center'
  },
  {
    fixed: 'right',
    action: true,
    name: 'action',
    prop: 'action',
    // width: 300,
    label: '操作',
    align: 'center'
  }
]

export const actions = ({ tableAction }) => {
  return {
    action: (dat, row, index) => {
      // 已驳回   审核、查看
      // 待审核   审核
      // 已上线   推荐至首页、下线、编辑、查看
      // 已下线   上线、编辑  查看
      let action = []
      switch (row.status) {
        case 0:
          action = [
            {
              label: '审核',
              attr: {
                command: 'examine',
                icon: 'el-icon-s-check'
              }
            },
            {
              label: '查看',
              attr: {
                command: 'view',
                icon: 'el-icon-view'
              }
            }
          ]
          break
        case 1:
          action = [
            {
              label: '审核',
              attr: {
                command: 'examine',
                icon: 'el-icon-s-check'
              }
            }
          ]
          break
        case 2:
          action = [
            {
              label: row.isRecommend ? '取消推荐' : '推荐至首页',
              attr: {
                command: 'recommend',
                icon: row.isRecommend ? 'el-icon-star-off' : 'el-icon-star-on'
              }
            },
            {
              label: '下线',
              attr: {
                command: 'onLine',
                icon: 'el-icon-download'
              }
            },
            {
              label: '编辑',
              attr: {
                command: 'edit',
                icon: 'el-icon-edit'
              }
            },
            {
              label: '查看',
              attr: {
                command: 'view',
                icon: 'el-icon-view'
              }
            }
          ]
          break
        default:
          action = [
            {
              label: '上线',
              attr: {
                command: 'onLine',
                icon: 'el-icon-upload2'
              }
            },
            {
              label: '编辑',
              attr: {
                command: 'edit',
                icon: 'el-icon-edit'
              }
            },
            {
              label: '查看',
              attr: {
                command: 'view',
                icon: 'el-icon-view'
              }
            }
          ]
          break
      }

      return [
        {
          type: 'button', // 按钮
          // label: '更多操作',
          attr: {
            icon: 'el-icon-more',
            size: 'mini'
            // type: 'primary'
            // iconLayout: 'right'
          },
          click: () => {},
          dropdown: true, // 设置了dropdown，组件本身的事件失效
          dropdownConfig: {
            attr: {
              trigger: 'click'
            },
            command: (e, dat, row, index) => tableAction(dat, row, index, e),
            item: action
          }
        }
      ]
    }
  }
}

