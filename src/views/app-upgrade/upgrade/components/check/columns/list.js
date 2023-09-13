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
    align: 'center'
  },
  {
    prop: 'reviewType',
    label: '审核类型',
    align: 'center',
    width: 110,
    action: true,
    name: 'reviewType'
  },
  {
    prop: 'version',
    label: '版本号',
    align: 'center',
    minWidth: 260,
    action: true,
    name: 'version'
  },
  {
    action: true,
    name: 'action',
    width: 96,
    prop: 'action',
    label: '操作',
    align: 'center',
    fixed: 'right'
  }
]
export const actions = ({ openCloseCheck }) => {
  return {
    action: (dat, row, index) => {
      let label = '启用'; let icon = 'el-icon-success'; let type = 'success'
      if (row.enableState === 1) {
        label = '禁用'
        icon = 'el-icon-warning'
        type = 'danger'
      }
      return [
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
          label: `版本号:${row.versionDesc} 包名:${row.bundleId} VersionCode:${row.versionCode}`,
          attr: {
            style: {
              color: '#333'
            }
          }
        }
      ]
    },
    reviewType: (dat, row, index) => {
      let label = '其他功能'
      if (dat === 1) {
        label = '分享功能'
      }
      return [
        {
          type: 'tag',
          label: label,
          attr: {
            type: ''
          }
        }
      ]
    }
  }
}
