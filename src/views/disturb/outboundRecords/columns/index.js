export default [
    {
      prop: 'complaintNo',
      slot: 'complaintNo',
      label: '投诉单号/呼叫时间',
      align: 'left',
      width: 260
    },
    {
      prop: 'userMobile',
      slot: 'userMobile',
      label: '用户ID/加密手机号',
      align: 'left',
      width: 260
    },
    {
      prop: 'callDuration',
      label: '呼叫/接通时长(单位:秒)',
      align: 'left',
      width: 200,
      render: (item, text, record) => {
        return !['0', '1'].includes(record.callStatus) ? `${record.callTime || '--'} / ${record.chatDuration || '--'}` : '--'
      }
    },
    {
      action: true,
      prop: 'intentLevel',
      label: '用户意向',
      name: 'useTag',
      align: 'center',
      width: 200
    },
    {
      action: true,
      prop: 'callStatus',
      label: '通话状态',
      name: 'tag',
      align: 'center',
      width: 200
    },
    {
      prop: 'time',
      slot: 'time',
      label: '开始/接通/结束时间',
      align: 'left',
      width: 260
    },
    {
      action: true,
      name: 'action',
      prop: 'action',
      label: '操作',
      align: 'center',
      width: 230,
      fixed: 'right'
      // disabled: true
    }
  ]

  export const actions = ({ tableAction }) => {
    return {
      useTag: (dat, row, index) => {
        return [
          {
            type: 'tag',
            label: row.intentLevel + row.intentLevelName || '暂无',
            attr: {
              type: 'warning'
            }
          }
        ]
      },
      tag: (dat, row, index) => {
        const type = ['warning', 'primary', 'success', 'danger', 'primary']
        return [
          {
            type: 'tag',
            label: row.callStatus + row.callStatusDesc || '暂无',
            attr: {
              type: type[+row.recordStatus]
            }
          }
        ]
      },
      action: (dat, row, index) => {
        return [
          {
            type: 'button',
            label: '通话详情',
            click: (dat, row, index) => tableAction(dat, row, index),
            attr: {
              disabled: !!['0', '1'].includes(row.recordStatus),
              size: 'mini',
              icon: 'el-icon-s-operation',
              type: 'default'
            }
          }
        ]
      }

    }
  }
