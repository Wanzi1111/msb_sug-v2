import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const url = config.url
    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: true
    })
    // do something before request is sent
    // 登录接口不需要传token
    if (!url.includes('/sso/api/v1/token/get') && store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken('token')
    }
    config.headers['sessionid'] = localStorage.getItem('sessionid')
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const url = response.config.url
    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: false
    })
    const res = response.data

    // console.log('response', response)
    // if the custom code is not 20000, it is judged as an error.
    // aliyuncs.com
    if (response.status === 200) {
      // 200: 正常状态码
      // const isLogin = response.config.url.indexOf('/api_cs/staff/login') >= 0
      const isSignature = response.config.url.indexOf('/oss/getSignature') >= 0
      const isAli = response.config.url.indexOf('aliyuncs.com') >= 0
      // 暂时去掉isLogin
      // if (isLogin) {
      //   localStorage.setItem('sessionid', response.headers.sessionid)
      // }
      // 判断是否为阿里请求或者获取上传地址请求,是的话，只用判断HTTP状态码200就是正常
      if (isSignature || isAli) {
        return res
      } else if (url === '/sso/api/v1/token/get' && res.result === 'success') {
        // sso登录
        return res
      } else if (res.status === 0 || res.code === 0 || res.code === 200 || response.request.responseType === 'blob' || res.data) {
      // 业务代码判断response.data.status === 0为正常
        return res
      } else {
        // 业务逻辑错误
        Message.closeAll()
        Message({
          message: res.msg || res.message || res.errors || res.payload || res.info || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return res
      }
    } else {
      // 500: 服务器错误
      Message.closeAll()
      Message({
        message: res.msg || res.message || res.errors || res.info || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(new Error(res.message || res.errors || res.info || 'Error'))
  },
  error => {
    const url = error.config ? error.config.url : ''
    store.dispatch('loading/setLoad', {
      key: url.replace(/\//g, '_'),
      status: false
    })
    if (error.response && error.response.status === 401) {
      // 401: 用户信息失效
      MessageBox.confirm('您的账户已失效，您可以取消以停留在此页，或重新登录', '账户失效', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      // 500: 服务器错误
      Message.closeAll()
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
