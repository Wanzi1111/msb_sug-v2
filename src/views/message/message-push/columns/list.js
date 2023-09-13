/**
 * @author: SS
 * @description:
 * @date: 2020/3/11
 */

export default [
  {
    prop: 'messageName',
    label: '消息推送名称',
    align: 'center',
    fixed: true
  },
  {
    prop: 'groupLabel',
    label: '消息分组',
    align: 'center'
  },
  {
    prop: 'pushTypeLabel',
    label: '推送类型',
    align: 'center'
  },
  {
    prop: 'pushTargetLabel',
    label: '推送对象',
    align: 'center'
  },
  {
    prop: 'sendCount',
    label: '已发送',
    align: 'center',
    render: (h, dat, row, index) => {
      if (dat) {
        return dat + '条'
      }
    }
  },
  {
    prop: 'successNumbers',
    label: '已成功触达',
    align: 'center',
    render: (h, dat, row, index) => {
      return dat ? `${dat}条` : '-'
    }
  },
  {
    action: true,
    name: 'failNumbers',
    prop: 'failNumbers',
    label: '已失败',
    align: 'center'
  },
  {
    prop: 'sendRate',
    label: '触达率',
    align: 'center',
    render: (h, dat, row, index) => {
      return dat ? `${dat}%` : '-'
    }
  },
  {
    prop: 'reachTypeLabel',
    label: '触达方式',
    align: 'center'
  },
  {
    prop: 'formatDate',
    label: '开始推送时间',
    align: 'center'
  }
]

export const actions = ({ failView }) => {
  return {
    failNumbers: (dat, row, index) => {
      return [
        {
          type: 'a',
          label: row.failNumbers || '-',
          click: failView,
          attr: {
            style: {
              color: '#46a6ff'
            }
          }
        }
      ]
    }
  }
}

