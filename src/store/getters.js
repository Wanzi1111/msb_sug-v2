/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-09 16:52:57
 */
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  operationRoles: state => state.user.operationRoles,
  adConfig: state => state.app.adConfig,
  loadings: state => state.loading.loadings,
  staffEnum: state => state.staffEnum.staffEnum,
  baseData: state => state.global.baseData,
  baseDataMap: state => state.global.baseDataMap,
  BusinessListData: state => state.global.BusinessListData,
  operationEum: state => state.app.operationEum,
  claimsType: state => state.claimsType.claimsType

}
export default getters
