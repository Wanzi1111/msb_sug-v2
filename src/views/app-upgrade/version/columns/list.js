/**
 * @author: Liwei
 * @description:
 * @date: 2020/3/9
 */
export default [
  {
    prop: 'id',
    label: 'ID',
    align: 'center',
    width: 60
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
    prop: 'version',
    label: '版本号',
    align: 'center',
    minWidth: 260,
    action: true,
    name: 'version'
  },
  {
    prop: 'createTime',
    label: '添加时间',
    align: 'center',
    width: 170
  }
]
export const actions = () => {
  return {
    version: (dat, row, index) => {
      let label = `版本号:${row.versionDesc} 包名:${row.bundleId} VersionCode:${row.versionCode}`
      if (row.fileSize) {
        label += ` 包大小:${row.fileSize}`
      }
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
