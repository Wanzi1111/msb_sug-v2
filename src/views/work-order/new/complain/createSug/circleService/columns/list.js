/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-04 14:19:58
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-12 19:11:05
 */
import moment from 'moment'
export default [
  {
    prop: 'batchId',
    label: '导入批次号',
    align: 'center'
    // width: 200
  },
  {
    prop: 'remark',
    label: '备注说明',
    align: 'center',
    showOverflowTooltip: true,
    render: (h, dat, row, index) => {
      return `${moment(row.ctime).format('MM')}月${moment(row.ctime).format('DD')}日${Number(row.successdata_num + row.errordata_num) > 1 ? ' 批量创建' : ' 创建投诉'}`
    }
    // width: 200
  },
  {
    prop: 'success',
    label: '成功/失败数',
    align: 'center',
    render: (h, dat, row, index) => {
      return `${row.successdata_num}/${row.errordata_num}`
    }
    // width: 200
  },
  {
    prop: 'roleName',
    label: '总创建数',
    align: 'center',
    render: (h, dat, row, index) => {
      return row.successdata_num + row.errordata_num
    },
    width: 140
  },
  {
    prop: 'creatUserName',
    label: '创建人',
    align: 'center',
    width: 120,
    render: (h, dat, row, index) => {
      return `${dat || '-'}`
    }
  },
  {
    prop: 'ctime',
    label: '创建时间',
    align: 'center',
    minWidth: 180,
    render: (h, dat, row, index) => {
      return moment(dat).format('YYYY-MM-DD HH:mm:ss')
    }
    // width: 200
  },
  {
    action: true,
    name: 'action',
    width: 200,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
    // disabled: false
  }
]

export const actions = ({ tableAction }) => {
  return {
    // tag: (dat, row, index) => {
    //   const type = ['warning', 'success']
    //   return [
    //     {
    //       type: 'tag',
    //       label: dat,
    //       attr: {
    //         type: type[row.status]
    //       }
    //     }
    //   ]
    // },
    action: (dat, row, index) => {
      let action = []
      action = [
        {
          label: '下载成功数据',
          attr: {
            command: 'downLoadSuccess',
            icon: 'el-icon-success'
          }
        },
        {
          label: '下载失败数据',
          attr: {
            command: 'downLoadError',
            icon: 'el-icon-error'
          }
        }
      ]
      return [
        {
          type: 'button',
          label: '查看进度',
          click: (dat, row, index) => tableAction(dat, row, index, 'progress'),
          attr: {
            // disabled: !![3, 4, 6].includes(row.cpStatus),
            size: 'mini',
            icon: 'el-icon-crop'
            // type: 'default'
          }
        },
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
