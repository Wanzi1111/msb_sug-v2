// 下标即为所映射的value
const OPERATE_TYPE = ['', '介入处理', '处理记录', '关闭投诉', '设为无效', '修改操作人', '设为待处理', '回访登记', '修改优先级', '转教务', '转销售', '转教辅', '转业务']

const USER_TYPE = {
  1: '体验用户',
  2: '付费用户',
  3: '在职老师',
  4: '停职老师',
  5: '新注册用户',
  6: '体验课用户',
  7: '系统课用户',
  8: '注销用户'
}
const AS_TYPE_MAP = {
  'REFUND_RETURN': 1,
  'REFUND': 2,
  'EXCHANGE_GOODS': 3,
  'REPLENISHMENT': 4
}
export {
  OPERATE_TYPE,
  USER_TYPE,
  AS_TYPE_MAP
}
// 获取小熊boss的用户信息
export function getStaffInfo() {
  let staff = {}
  const bossinfo = JSON.parse(sessionStorage.getItem('bossinfo'))
    if (bossinfo) staff = getStaff(bossinfo)
    return staff
}
function getStaff(staffInfo) {
  const staff = staffInfo
  return Object.assign(
    {},
    {
      staffId: staff.id,
      staffName: staff.realName,
      applyDepartment: staff.department,
      applyDepartmentId: staff.departmentId,
      isStaffId: staff.positionId === '1'
    }
  )
}
