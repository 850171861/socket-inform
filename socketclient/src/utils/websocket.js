import store from '@/store'
import router from '../router'
class WebSocketClient {
  constructor (options = {}) {
    this.port = options.port || '4001'
    this.url = options.url || '127.0.0.1'
    this.timeInterval = 5 * 1000
    this.protocol = 'ws'
    this.handle = null
  }

  init () {
    this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`) // 初始化socket
    this.ws.onopen = () => this.onOpen() // 连接
    this.ws.onmessage = (msg) => this.onMessage(msg) // 接收消息
    this.ws.onclose = () => this.onClose() // 关闭
    this.ws.onerror = () => this.onError() // 错误
  }

  send (msg) { // 发送消息
    this.ws.send(msg)
  }

  onOpen () { // onpen连接成功，立马发送token给后端，做鉴权
    this.send(JSON.stringify({
      event: 'auth',
      message: 'Bearer ' + store.state.token
    }))
  }

  onMessage (event) {
    // 1、接收服务端发送过来的消息----event.data
    // 2、obj.event如果是 ‘noauth’ 鉴权失败，连接的时候发送的token可能已过期
    // 3、obj.event如果是 ‘heartbeat’ 测是心跳消息
    const obj = JSON.parse(event.data)
    switch (obj.event) {
      case 'noauth':
        router.push({ name: 'Login' })
        break
      case 'heartbeat':
        this.checkServer() 
        this.ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'pong'
        }))
        break
      default:
        store.dispatch(obj.event, obj)
    }
  }

  onClose () {
    this.ws.close() // 当连接断开的时候触发close事件
  }

  onError () {
    // 当连接失败时，触发error事件
    // 连接失败之后，1s进行断线重连！
    setTimeout(() => {
      this.init()
    }, 1000)
  }

  checkServer () {
    clearTimeout(this.handle) 
    // 这里的定时器设置服务端的心跳检测时间延迟一秒，避免的调用时服务端未及时响应时
    this.handle = setTimeout(() => {
      this.onClose()   
      this.onError()
    }, this.timeInterval + 1000)
  }
}

export default WebSocketClient
