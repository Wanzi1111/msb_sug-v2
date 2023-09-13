/**
 * @author: Liwei
 * @description: 表单配置
 * @date: 2020/1/4
 */
export const actions = ({ closeDl, isEdit }) => {
  return {
    submit: {
      label: isEdit ? '修改奖品信息' : '上传奖品信息',
      attr: {
        icon: isEdit ? 'el-icon-edit' : 'el-icon-check'
      }
    },
    back: {
      hide: true
    },
    quit: {
      click: () => closeDl(),
      type: 'button',
      label: '退出',
      attr: {
        icon: 'el-icon-close'
      }
    }
  }
}
