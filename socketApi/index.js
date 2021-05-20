const Koa = require('koa')
const router = require('koa-router')()
const fs = require('fs')
const jwt = require('jsonwebtoken')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const WebSocketServer = require('./config/WebSocket')
const app = new Koa()
const ws = new WebSocketServer()

ws.init()
global.ws = ws

// 管理员登录
router.post('/login', async (ctx) => {
  const { body } = ctx.request

  const data = fs.readFileSync('./db/users.json', 'utf-8')

  const user = JSON.parse(data).users.find(item => {
    return item.username === body.username && item.password === body.password
  })

  if (user !== null) {
    const token = jwt.sign({ id: user.id }, 'qwe12344444', {
      expiresIn: '1d'
    })
    ctx.body = {
      code: 200,
      token: token
    }
  } else {
    ctx.body = {
      code: 500
    }
  }
})

//  下单
router.post('/order', async (ctx) => {
  const { body } = ctx.request
  let data = []
  await new Promise((resolve, reject) => {
    fs.readFile('./db/orders.json', 'utf-8', function (err, res) {
      if (err) {

      } else {
        data = res
        resolve()
      }
    })
  })
  data = JSON.parse(data)
  data.orders.push(body)

  const result = JSON.stringify(data)
  fs.writeFile('./db/orders.json', result, function (err) {
    if (err) {

    }
  })

  const num = data.orders.filter(item => {
    return item.isRead == 0
  })

  const user = fs.readFileSync('./db/users.json', 'utf-8')
  const admin = JSON.parse(user).users.find(item => {
    return item.username === 'admin'
  })

  global.ws.send(admin.id, JSON.stringify({
    event: 'message',
    message: num.length
  }))
  ctx.body = {
    code: 200,
    msg: '下单成功'
  }
})

// 接口跨域
app.use(cors()),
// 数据解析
app.use(koaBody())
// 路由挂载
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(4000)
