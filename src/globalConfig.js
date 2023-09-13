/*
 * @Descripttion:
 * @version:
 * @Author: gaoleifang
 * @Date: 2020-09-01 17:30:31
 * @LastEditors: gaoleifang
 * @LastEditTime: 2020-09-10 16:08:52
 */
import router from './router'
import store from './store'

router.beforeEach(async(to, from, next) => {
  const adConfigPath = ['/advert/put', '/advert/put/create', '/advert/ad-position', '/advert/put-log', '/advert/materiel']
  const operationPath = ['/statistics/operationLog']
  if (adConfigPath.includes(to.path)) {
    await store.dispatch('app/getAdConfig')
  }
  if (operationPath.includes(to.path)) {
    await store.dispatch('app/getOperation')
  }
  // next()
  // const adConfigPath1 = '/operate/'
  // if (to.path.includes(adConfigPath1)) {
  //   await store.dispatch('staffEnum/getEnumConfig')
  // }
  next()
})
