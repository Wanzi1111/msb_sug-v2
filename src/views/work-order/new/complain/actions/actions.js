// 投诉单除小班课老师其他业务线的二级操作按钮
export default ({ exportDocument, prioritySort, prioritySortFlag, tableAction, flagSign, flagSignSort }) => {
  return {
    // 全部
    '0': [
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
          type: ''
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
      }
    ],
    // 待处理
    '1': [
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
          type: ''
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
          type: ''
        }
      },
      {
        type: 'button', // 立即处理
        label: '立即处理',
        align: 'left',
        click: (dat, row, index) => tableAction(dat, row, index, 'doItNow', 'tabbtn'),
        attr: {
          size: 'small',
          type: ''
        }
      }
    ],
    // 处理中
    '2': [
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
          type: ''
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
          type: ''
        }
      },
      {
        type: 'button', // 立即处理
        label: '立即处理',
        align: 'left',
        click: (dat, row, index) => tableAction(dat, row, index, 'doItNow', 'tabbtn'),
        attr: {
          size: 'small',
          type: ''
        }
      }
    ],
    // 已关闭
    '3': [
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
          type: ''
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
          type: ''
        }
      },
      {
        type: 'button', // 立即处理
        label: '立即处理',
        align: 'left',
        click: (dat, row, index) => tableAction(dat, row, index, 'doItNow', 'tabbtn'),
        attr: {
          size: 'small',
          type: ''
        }
      },
    {
      type: 'button', // 回访登记
      label: '回访登记',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'doVisit', 'tabbtn'),
      attr: {
        size: 'small',
        type: ''
      }
    }
    ],
    // 已回访
    '7': [
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
      type: 'button', // 回访登记
      label: '回访登记',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'doVisit', 'tabbtn'),
      attr: {
        size: 'small',
        type: ''
      }
    }
    ],
    // 无效投诉
    '6': [
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
      type: 'button', // 设为待处理
      label: '设为待处理',
      align: 'left',
      click: (dat, row, index) => tableAction(dat, row, index, 'setAccecpt', 'tabbtn'),
      attr: {
        size: 'small',
        type: ''
      }
    }
    ]
  }
}
// 小班课老师二级操作按钮
export const classTeacherAct = ({ exportDocument, flagSign, flagSignSort }) => {
  return [
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
    }
  ]
}

// 新售后单的二级操作按钮
export const afterSaleAct = ({ exportDocument, prioritySort, prioritySortFlag, tableAction, flagSign, flagSignSort }) => {
  return {
    // 全部
    '0': [
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
          type: ''
        }
      }
    ],
    // 待处理
    '1': [
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
          type: ''
        }
      }
    ],
    // 处理中
    '2': [
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
          type: ''
        }
      }
    ],
    // 处理成功
    '203': [
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
          type: ''
        }
      }
    ],
    // 处理失败
    '204': [
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
          type: ''
        }
      }
    ],
    // 已取消
    '8': [
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
          type: ''
        }
      }
    ],
    // 已关闭
    '3': [
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
          type: ''
        }
      }
    ]
  }
}

// 工单二级操作按钮
export const workOrderAct = ({ exportDocument, prioritySortFlag, prioritySort }) => {
  return [
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
      label: prioritySortFlag ? '按普通排序' : '按优先级排序',
      align: 'left',
      click: prioritySort,
      attr: {
        size: 'small',
        type: prioritySortFlag ? 'primary' : '',
        icon: 'el-icon-sort'
      }
    }
  ]
}

