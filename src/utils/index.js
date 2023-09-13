/* eslint-disable no-extend-native */
/**
 * Created by PanJiaChen on 16/11/18.
 */

import moment from 'moment'
import _ from 'lodash'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export function query(obj) {
  // 首先判断obj是否为真，为真则进行处理，不然直接return
  if (obj) {
    // 定义变量接收query字符串
    let query = ''
    // 循环遍历对象
    for (const i in obj) {
      // 定义变量接收对象的value值
      let value = obj[i]
      // 若对象的value值为数组，则进行join打断
      if (Array.isArray(value)) {
        value = value.join(',')
      }
      // 进行字符串拼接
      query += `&${i}=${value}`
    }
    // replace返回一个新的字符串，要用query重新接受一下，并把第一个&替换为?
    query = query.replace('&', '?')
    // 返回生成的query字符串
    return query
  }
  return ''
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function createBlob(name, data) {
  const blob = new Blob([data])
  const linkNode = document.createElement('a')
  linkNode.download = name // a标签的download属性规定下载文件的名称
  linkNode.style.display = 'none'
  linkNode.href = URL.createObjectURL(blob) // 生成一个Blob URL
  document.body.appendChild(linkNode)
  linkNode.click() // 模拟在按钮上的一次鼠标单击
  URL.revokeObjectURL(linkNode.href) // 释放URL 对象
  document.body.removeChild(linkNode)
}

/**
 * 判断是否是mp4
 * @param {Array<File>} files
 * @returns {String} 秒
 */
export function videoType(files) {
  if (files[0].name.toLocaleLowerCase().includes('.mp4')) {
    return 'mp4'
  } else {
    return 'm3u8'
  }
}

/**
 * 获取m3u8视频的时长
 * @param {Array<File>} files
 * @returns {Promise<Number>} 秒
 */
export function m3u8Duration(files) {
  let m3u8
  for (let i = 0; i < files.length; i++) {
    if (files[i].name.includes('.m3u8')) {
      m3u8 = files[i]
    }
  }
  const reader = new FileReader()
  reader.readAsText(m3u8)
  return new Promise((reslove, reject) => {
    reader.onload = function(evt) { // 读取完文件之后会回来这里
      var fileString = evt.target.result // 读取文件内容
      const splitStr = fileString.split('#EXTINF:')
      let duration = 0
      splitStr.map(item => {
        const itemDuration = isNaN(parseFloat(item.split(','))) ? 0 : parseFloat(item.split(','))
        duration += itemDuration
      })
      reslove(duration)
    }
    reader.onerror = function(err) {
      reject(err)
    }
  })
}

/**
 * 获取m3u8视频的大小
 * @param {Array<File>} files
 * @returns {Number} KB
 */
export function m3u8Size(files) {
  let size = 0
  for (let i = 0; i < files.length; i++) {
    size += files[i].size
  }
  return parseInt(size / 1024)
}

/**
 * 动态添加css
 * @param {String} url
 */
export function dynamicLoadCss(url) {
  const head = document.getElementsByTagName('head')[0]
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  head.appendChild(link)
}

// 转化下拉框数据
export function tranFormSelectData(value) {
  return value.map(item => {
    return {
      label: item.name,
      value: item.id,
      pid: item.pid
    }
  })
}

export function calcDays() {
  // eslint-disabled-next-line
  Date.prototype.addDays = function(d) {
    this.setDate(this.getDate() + d)
    return this
  }
}

// base64转file文件
export function tranferDataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length; var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename || `${moment().format('YYYYMMDDHHmmss')}.${mime.split('/')[1]}`, { type: mime })
}

// a 下载

export const downloadFileWithPath = (path) => {
  if (path) {
    const a = document.createElement('a')
    a.setAttribute('download', '')
    a.setAttribute('href', path)
    a.click()
  }
}
export const SUP_LEVEL_UPPER = formatSup('S')
export const SUP_LEVEL = {
  4: 'S1-基础',
  1: 'S1-进阶',
  2: 'S2-基础',
  5: 'S2-进阶',
  3: 'S3',
  6: 'S3专项技能课'
}
function formatSup(flag = 'S') {
  const obj = {}
  for (const key in SUP_LEVEL) {
    if (Object.keys(SUP_LEVEL).includes(key)) {
      const item = SUP_LEVEL[key]
      obj[`${flag}${key}`] = item
    }
  }
  return obj
}
// 我的审批摘要
export function formatTeamNameSup(teamName) {
  if (!teamName) return
  const upperName = teamName.toLocaleUpperCase()
  let idx = -1
  if (upperName.indexOf('S1') > -1) {
    idx = upperName.indexOf('S1')
  }
  if (upperName.indexOf('S2') > -1) {
    idx = upperName.indexOf('S2')
  }
  if (upperName.indexOf('S4') > -1) {
    idx = upperName.indexOf('S4')
  }
  if (upperName.indexOf('S5') > -1) {
    idx = upperName.indexOf('S5')
  }
  if (upperName.indexOf('S6') > -1) {
    idx = upperName.indexOf('S6')
  }

  if (
    idx >= 0 &&
    !upperName.includes('基础') &&
    !upperName.includes('进阶') &&
    !upperName.includes('专项技能课')
  ) {
    const s = upperName.substr(idx, 2)
    teamName = teamName.replace(s, SUP_LEVEL_UPPER[s])
  }
  return teamName
}

// 时间戳转年月日
export function timestamp(stamp, type) {
  // type = 1: 月-日 时-分   type = 2: 年-月-日 时-分-秒 type = 3: 20 08 type=4 : 2019年12月12日
  const now = new Date(Number(stamp))
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const second = now.getSeconds()

  const _mouth = month > 9 ? month : '0' + month
  const _day = day > 9 ? day : '0' + day
  const _hour = hour > 9 ? hour : '0' + hour
  const _minute = minute > 9 ? minute : '0' + minute
  if (type === 1) {
    return _mouth + '-' + _day + ' ' + _hour + ':' + _minute
  } else if (type === 2) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    const hours = hour <= 9 ? '0' + hour : hour
    const minutes = minute <= 9 ? '0' + minute : minute
    const seconds = second <= 9 ? '0' + second : second
    return (
      year +
      '-' +
      months +
      '-' +
      days +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else if (type === 3) {
    return _mouth + '.' + _day
  } else if (type === 4) {
    return year + '年' + _mouth + '月' + _day + '日'
  } else if (type === 5) {
    return year + '-' + _mouth + '-' + _day
  } else if (type === 6) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    const hours = hour <= 9 ? '0' + hour : hour
    const minutes = minute <= 9 ? '0' + minute : minute
    return months + '-' + days + ' ' + hours + ':' + minutes
  } else if (type === 7) {
    const months = month <= 9 ? '0' + month : month
    const days = day <= 9 ? '0' + day : day
    return months + '-' + days
  } else if (type === 8) {
    return year + '-' + _mouth + '-' + _day + ' ' + _hour + ':' + _minute
  }
}
export function getAppSubject(upper = true) {
  const subjects = {
    art_app: '美术科目',
    write_app: '书法科目',
    music_app: '音乐科目',
    dance_app: '舞蹈科目'
  }
  const { pathname } = location
  const env = ['dev', 'test']
  const envFlag = env.some((item) => pathname.includes(item))
  // 测试或开发环境
  const key = envFlag ? pathname.split('/')[2] : pathname.split('/')[1]
  const subject = Object.keys(subjects).includes(key) ? key : 'art_app'
  return upper ? subject.toUpperCase() : subject
}

//  数组对象按指定key排序
export function sortByKey(arr = [], key) {
  return arr.map((item) => {
    if (item.children) {
      item.children = _.sortBy(item.children, key)
      if (item.children.children) sortByKey(item.children, key)
    }
    return item
  })
}
