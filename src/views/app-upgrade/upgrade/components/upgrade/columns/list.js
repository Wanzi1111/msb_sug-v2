/**
 * @author: Liwei
 * @description:
 * @date: 2020/3/9
 */
export default [
  {
    prop: 'id',
    label: '序号',
    align: 'center',
    width: 70,
    fixed: true
  },
  {
    prop: 'clientTypeName',
    label: '客户端',
    align: 'center'
  },
  {
    prop: 'upgradeTypeName',
    label: '升级类型',
    align: 'center',
    width: 100
  },
  {
    prop: 'version',
    label: '版本号',
    align: 'center',
    action: true,
    name: 'version',
    minWidth: 220
  },
  {
    prop: 'pushType',
    label: '升级策略',
    align: 'center',
    action: true,
    name: 'pushType'
  },
  {
    prop: 'updateDesc',
    label: '更新文案',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    action: true,
    name: 'action',
    width: 160,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const actions = ({ edit, openCloseCheck }) => {
  return {
    action: (dat, row, index) => {
      let label = '启用'; let icon = 'el-icon-success'; let type = 'success'
      if (row.state === 1) {
        label = '禁用'
        icon = 'el-icon-warning'
        type = 'danger'
      }
      return [
        {
          type: 'button',
          label: '修改',
          click: edit,
          attr: {
            size: 'mini',
            icon: 'el-icon-edit-outline',
            type: 'primary'
          }
        },
        {
          type: 'button',
          label: label,
          click: openCloseCheck,
          attr: {
            size: 'mini',
            icon: icon,
            type: type
          }
        }
      ]
    },
    version: (dat, row, index) => {
      return [
        {
          type: 'span',
          label: `版本号:${row.versionDesc} VersionCode:${row.versionCode}`,
          attr: {
            style: {
              color: '#333'
            }
          }
        }
      ]
    },
    pushType: (dat, row, index) => {
      const pushTxt = row.pushType === 1 ? '无消息通知' : '消息通知'
      const updateLevelTxt = row.updateLevel === 1 ? '非强制升级' : '强制升级'
      const label = `${updateLevelTxt}/${pushTxt}`
      return [
        {
          type: 'span',
          label: label,
          attr: {
            style: {
              color: '#333'
            }
          }
        }
      ]
    }
  }
}
