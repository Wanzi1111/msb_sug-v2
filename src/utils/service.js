/*
 * @Descripttion:
 * @version:
 * @Author: liweiyu
 * @Date: 2021-06-24 21:51:31
 */
// import io from 'socket.io-client'

// eslint-disable-next-line no-undef

const host = process.env.VUE_APP_WS_HOST
import { getToken } from '@/utils/auth'
const createUserId = getToken('userId')

const url = `${host}/${createUserId}`

export function socketConnect(_this) {
  const websocketUrl = url
  const ws = new WebSocket(websocketUrl)
  ws.onopen = function() {
    // Web Socket 已连接上，使用 send() 方法发送数据
    // console.log('ws', ws)
    console.log('数据发送中...')
  }
  ws.onmessage = function(data) {
    // const toFrom = ''
    // 数据接收
    // console.log('数据接收开始')
    // return data
    _this.messageData(data)
  }
  ws.onclose = function() {
    // 关闭 websocket
    // console.log('连接已关闭...')
    _this.socketConnect()
  }
  // 组件销毁时调用，中断websocket链接
  _this.socketOver = () => {
    ws.close()
  }
  _this.websocket = ws
}
