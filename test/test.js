// 测试中间件
const express = require('../lib/like-express')

// 本次 http 请求的实例
const app = express()

app.use((req, res, next) => {
  console.log('请求开始...', req.method, req.url)
  next()
})

app.use((req, res, next) => {
  // 假设在处理 cookie
  req.cookie = {
    userid: '75893275893285'
  }
  next()
})

app.use((req, res, next) => {
  // 假设处理 post data
  // 异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    }
    next()
  })
})

app.use('/api', (req, res, next) => {
  console.log('处理 api 路由')
  next()
})

app.get('/api', (req, res, next) => {
  console.log('get /api')
  next()
})

app.post('/api', (req, res, next) => {
  console.log('post /api')
  next()
})

// 登录状态校验
function loginCheckout(req, res, next) {
  // if (req.cookies) {
  if (req.cookie) {
    console.log('已登录')
    next()
  } else {
    res.json({
      errno: -1,
      data: '您未登录'
    })
  }
}

app.get('/api/get-cookie', loginCheckout, (req, res, next) => {
  console.log('get /api/get-cookie')
  res.json({
    errno: 0,
    data: req.cookie
  })
})

app.post('/api/post-data', (req, res, next) => {
  console.log('post /api/post-data')
  res.json({
    errno: 0,
    data: req.body
  })
})

app.use((req, res, next) => {
  console.log('处理 404')
  res.json({
    errno: -1,
    data: '404 Not Found'
  })
})

app.listen(9000, () => {
  console.log('server is running on port 9000')
})
