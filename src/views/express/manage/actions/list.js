/**
 * @author: Liwei
 * @description:
 * @date: 2020/1/5
 */
export default ({ jump, importNum, exportNum, operation, state = '0' }) => {
  const defAction = []
  let action = []
  // 1:待审核
  // 2:
  // 3:待发货
  // 4:已发货
  // 5:已签收
  // 6:已取消
  // 7:出库失败
  switch (state) {
    case '0':
      break
    case '1':
      action = [
        // {
        //   type: 'button', // 按钮
        //   label: '批量撤回',
        //   click: () => operation('allBack'),
        //   align: 'right',
        //   attr: {
        //     type: 'primary',
        //     plain: true,
        //     icon: 'el-icon-refresh-left'
        //   }
        // }
        {
          type: 'button', // 按钮
          label: '批量审批',
          click: () => operation('allExamine'),
          // align: 'right',
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-s-check'
          }
        }
      ]
      break
    case '2':
      action = [
        // {
        //   type: 'button', // 按钮
        //   label: '批量撤回',
        //   click: () => operation('allBack'),
        //   align: 'right',
        //   attr: {
        //     type: 'primary',
        //     plain: true,
        //     icon: 'el-icon-refresh-left'
        //   }
        // }
      ]
      break
    case '3':
      action = [
        {
          type: 'button', // 按钮
          label: '导出当前待回填数据',
          click: exportNum,
          // align: 'right',
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-download'
          }
        },
        {
          type: 'button', // 按钮
          label: '批量导入回填单号',
          click: importNum,
          // align: 'right',
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-upload2'
          }
        },
        {
          type: 'button', // 按钮
          label: '批量撤回',
          click: () => operation('allBack'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-refresh-left'
          }
        },
        {
          type: 'button', // 按钮
          label: '批量取消',
          click: () => operation('allCancel'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-close'
          }
        }
      ]
      break
    case '4':
      action = [
        // {
        //   type: 'button', // 按钮
        //   label: '批量退货',
        //   click: () => operation('allBackGoods'),
        //   align: 'right',
        //   attr: {
        //     disabled: true,
        //     type: 'primary',
        //     plain: true,
        //     icon: 'el-icon-sell'
        //   }
        // }
        {
          type: 'button', // 按钮
          label: '批量撤回',
          click: () => operation('allBack'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-refresh-left'
          }
        },
        {
          type: 'button', // 按钮
          label: '批量取消',
          click: () => operation('allCancel'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-close'
          }
        }
      ]
      break
    case '5':
      action = [
        {
          type: 'button', // 按钮
          label: '批量取消',
          click: () => operation('allCancel'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-close'
          }
        }
      ]
      break
    case '6':
      action = [
        {
          type: 'button', // 按钮
          label: '批量重审',
          click: () => operation('allAgainExamine'),
          // align: 'right',
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-s-check'
          }
        },
        {
          type: 'button', // 按钮
          label: '批量撤回',
          click: () => operation('allBack'),
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-refresh-left'
          }
        }
      ]
      break
    case '7':
      action = [
        {
          type: 'button', // 按钮
          label: '批量重审',
          click: () => operation('allAgainExamine'),
          // align: 'right',
          attr: {
            type: 'primary',
            plain: true,
            icon: 'el-icon-s-check'
          }
        }
      ]
      break
  }
  return [...defAction, ...action]
}
