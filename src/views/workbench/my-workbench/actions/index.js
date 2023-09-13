/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-11-26 15:26:20
 */
/**
 * @author: shasen
 * @description:
 * @date: 2020/2/3
 */
export default ({ exportDocument, prioritySort, prioritySortFlag, taskStatusValue, tableAction, flagSign, flagSignSort }) => {
  // showbtn false为显示 true为不显示
  return [
    // {
    //   type: 'alert', // 文本
    //   label: `总投诉数量: ${complaintsNumbers.totalNumbers}  上周投诉总数量: ${complaintsNumbers.lastWeekNumbers}  本周当前投诉数量: ${complaintsNumbers.weekNumbers}  当日投诉总数量: ${complaintsNumbers.todayNumbers}  当前筛选投诉数量: ${total}`,
    //   attr: {
    //     type: 'primary',
    //     // type: 'info',
    //     closable: false,
    //     showIcon: true
    //   }
    // },
    {
      type: 'button', // 按钮
      label: '导出数据',
      align: 'left',
      click: exportDocument,
      attr: {
        size: 'small',
        type: 'primary',
        icon: 'el-icon-download'
      }
    },
    {
      type: 'button', // 按钮
      label: flagSign ? '按普通排序' : '按标签排序',
      align: 'left',
      click: flagSignSort,
      attr: {
        size: 'small',
        type: flagSign ? 'primary' : '',
        icon: 'el-icon-sort'
      }
    },
    {
      type: 'button', // 按钮
      label: prioritySortFlag ? '按普通排序' : '按优先级排序',
      align: 'left',
      click: prioritySort,
      attr: {
        size: 'small',
        type: prioritySortFlag ? 'primary' : '',
        icon: 'el-icon-sort'
      }
    },
    {
      type: 'button', // 修改操作人
      label: '修改操作人',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'editStaffUser', 'tabbtn'),
      attr: {
        size: 'small',
        type: '',
        showbtn: !!(taskStatusValue === '7' || taskStatusValue === '6')
      }
    },
    {
      type: 'button', // 修改类型
      label: '修改类型',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'editType', 'tabbtn'),
      attr: {
        size: 'small',
        type: ''
      }
    },
    {
      type: 'button', // 设为无效
      label: '设为无效',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'setInvalid', 'tabbtn'),
      attr: {
        size: 'small',
        type: '',
        showbtn: !!(taskStatusValue === '7' || taskStatusValue === '6' || taskStatusValue === '4')
      }
    },
    {
      type: 'button', // 立即处理
      label: '立即处理',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'doItNow', 'tabbtn'),
      attr: {
        size: 'small',
        type: '',
        showbtn: !!(taskStatusValue === '7' || taskStatusValue === '6' || taskStatusValue === '4')
      }
    },
    {
      type: 'button', // 回访登记
      label: '回访登记',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'doVisit', 'tabbtn'),
      attr: {
        size: 'small',
        type: '',
        showbtn: !(taskStatusValue === '7' || taskStatusValue === '3')
      }
    },
    {
      type: 'button', // 设为待处理
      label: '设为待处理',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'setAccecpt', 'tabbtn'),
      attr: {
        size: 'small',
        type: '',
        showbtn: taskStatusValue !== '6'
      }
    }
    // {
    //   type: 'button', // 按钮
    //   label: '创建投诉单',
    //   align: 'left',
    //   click: toCreateLink,
    //   attr: {
    //     size: 'small',
    //     type: 'primary',
    //     icon: 'el-icon-link'
    //   }
    // }
  ]
}
