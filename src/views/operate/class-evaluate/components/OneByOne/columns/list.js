/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/2
 */

export default [
  {
    prop: 'id',
    label: '序号',
    align: 'center',
    fixed: true
  },
  {
    prop: 'ctime',
    label: '评价时间',
    align: 'center',
    width: 100
  },
  {
    prop: 'uid',
    label: '用户ID',
    align: 'center'
  },
  {
    prop: 'susername',
    label: '姓名',
    align: 'center'
  },
  {
    prop: 'age',
    label: '年龄',
    align: 'center',
    width: 60
  },
  {
    prop: 'datetime',
    label: '上课时间',
    align: 'center',
    width: 100
  },
  {
    prop: 'lessonType',
    label: '课程类型',
    align: 'center',
    render: (h, dat, row, index) => {
      return ['试听课', '正式课'][dat]
    }
  },
  {
    prop: 'tusername',
    label: '上课老师',
    align: 'center'
  },
  {
    prop: 'teamname',
    label: '老师组别',
    align: 'center'
  },
  {
    prop: 'type',
    label: '老师类型',
    align: 'center',
    render: (h, dat, row, index) => {
      return ['全职', '兼职'][dat]
    }
  },
  {
    prop: 'salesname',
    label: '规划师/顾问',
    align: 'center'
  },
  {
    prop: 'stcommentStar',
    label: '评价分数',
    align: 'center',
    render: (h, dat, row, index) => {
      return `${dat}星`
    }
  },
  {
    prop: 'lessonNumbers',
    label: '完课次数',
    align: 'center'
  },
  {
    prop: 'stcomment',
    label: '评价内容',
    align: 'center',
    minWidth: 168,
    showOverflowTooltip: true,
    render: (h, dat, row, index) => {
      const txt = (dat || '').replace(/\s+/g, '')
      const clearBr = (str) => {
        str = str.replace(/<\/?.+?>/g, '')
        str = str.replace(/[\r\n]/g, '')
        return str
      }
      return clearBr(txt)
    }
  }
]

export const actions = () => {
  return {
    tag: (dat, row, index) => {
      const type = ['全职', '兼职']
      return [
        {
          type: 'tag',
          label: dat,
          attr: {
            type: type[row.operationStatus]
          }
        }
      ]
    }
  }
}
