const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const fs = require('fs')

class WebSocketServer {
  constructor (options = {}) {
    this.port = options.port || 4001
    this.timeInterval = 5 * 1000
    this.isAuth = true
    this.wss = {}
  }

   // 初始化webscoekt服务
  init () {   
    this.wss = new WebSocket.Server({ port: this.port }) // 创建scoekt服务 并指定scoekt端口

    // 监听连接，当服务器和客户端握手成功后触发该事件,而第一个参数就是一个client对象
    this.wss.on('connection', (ws) => {
      console.log('socket连接成功')
      // 心跳检测默认值
      ws.isAlive = true
      // 连接成功之后立马发送一次心跳检测
      ws.send(JSON.stringify({
        event: 'heartbeat',
        message: 'ping'
      }))

      ws.on('message', (msg) => { this.onMessage(ws, msg) })   // 调用 onMessage()  第一个参数是client对象， 第二参数是接收client消息
      ws.on('close', () => this.onClose(ws))   // 调用 onClose()
    }) 

    // 心跳检测
    this.heartbeat()
  }

  onMessage (ws, msg) {
    // 接收客户端消息
    const msgObj = JSON.parse(msg)   
        // 1、如果客户端发送msgObj.event === auth  先做用户鉴权
        // 2、如果是msgObj.event === heartbeat 心跳检测
    const events = {  
      auth: async () => {   
        try {
          const obj = await jwt.verify(msgObj.message.split(' ')[1], 'qwe12344444')
          if (obj) {
            ws.isAuth = true

            ws.id = obj.id
            let data = fs.readFileSync(process.cwd() + '/db/orders.json')
            data = JSON.parse(data)
            const num = data.orders.filter(item => {
              return item.isRead == 0
            })

            ws.send(JSON.stringify({
              event: 'message',
              message: num.length
            }))
          }
        } catch (error) {
          ws.send(JSON.stringify({
            event: 'noauth',
            message: 'please auth again'
          }))
        }
      },
      heartbeat: () => {  
        if (msgObj.message === 'pong') {  // 接收客户端消息为pong证明客户端还保持者连接 设置状态为true
          ws.isAlive = true
        }
      },
    }
    events[msgObj.event]()
    
  }

  // 给uid用户发送消息
  send (uid, msg) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.id === uid) {
        client.send(msg)
      }
    })
  }

  // 关闭连接
  onClose () { }

  // 心跳检测
  heartbeat () {
    clearInterval(this.interval)   
    this.interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {   // 如果心跳检测失败就关闭socket连接
          return ws.terminate()  
        }
        // 主动发送心跳检测请求
        ws.isAlive = false
        ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'ping'
        }))
      })
    }, this.timeInterval)
  }
}

module.exports = WebSocketServer

