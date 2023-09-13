/**
 * @author: Liwei
 * @description:
 * @date: 2020/4/10
 */

export default [
  {
    prop: 'id',
    label: '序号',
    align: 'center',
    fixed: true
  },
  {
    prop: 'stuId',
    label: '用户ID',
    align: 'center'
  },
  {
    prop: 'stuName',
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
    prop: 'startTime',
    label: '上课时间',
    align: 'center',
    width: 100
  },
  {
    prop: 'lessonTypeName',
    label: '课程类型',
    align: 'center'
  },
  {
    prop: 'tecName',
    label: '上课老师',
    align: 'center'
  },
  {
    prop: 'tecLevel',
    label: '老师级别',
    align: 'center'
  },
  {
    prop: 'classCode',
    label: '班级编号',
    align: 'center'
  },
  {
    prop: 'commentScore',
    label: '评价分数',
    align: 'center',
    render: (h, dat, row, index) => {
      return `${dat}星`
    }
  },
  {
    prop: 'attendTimesStr',
    label: '完课次数',
    align: 'center'
  },
  {
    prop: 'commentContent',
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
