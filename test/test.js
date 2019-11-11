// 测试中间件
const express = require('../lib/like-express')

// 本次 http 请求的实例
const app = express()

// 中间件函数命名为了方便控制台输出调试
// 比如
// [
//   [Function: start],
//   [Function: setCookie],
//   [Function: setBody],
//   [Function: handleApi],
//   [Function: getApi],
//   [Function: loginCheckout],
//   [Function: getCookieApi]
// ]
app.use(
  (start = (req, res, next) => {
    console.log('请求开始...', req.method, req.url)
    next()
  })
)

app.use(
  (setCookie = (req, res, next) => {
    // 假设在处理 cookie
    console.log('处理 cookie')
    req.cookie = {
      userid: '75893275893285'
    }
    next()
  })
)

app.use(
  (setBody = (req, res, next) => {
    // 假设处理 post data
    // 异步
    console.log('处理 post data')
    setTimeout(() => {
      req.body = {
        a: 100,
        b: 200
      }
      next()
    })
  })
)

app.use(
  '/api',
  (handleApi = (req, res, next) => {
    console.log('处理 api 路由')
    next()
  })
)

app.get(
  '/api',
  (getApi = (req, res, next) => {
    console.log('get /api')
    next()
  })
)

app.post(
  '/api',
  (postApi = (req, res, next) => {
    console.log('post /api')
    next()
  })
)

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

app.get(
  '/api/get-cookie',
  loginCheckout,
  (getCookieApi = (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
      errno: 0,
      data: req.cookie
    })
  })
)

app.post(
  '/api/post-data',
  (postData = (req, res, next) => {
    console.log('post /api/post-data')
    res.json({
      errno: 0,
      data: req.body
    })
  })
)

// 未对 404 的情况做处理
// app.use(
//   (notFound = (req, res, next) => {
//     console.log('处理 404')
//     res.json({
//       errno: -1,
//       data: '404 Not Found'
//     })
//   })
// )

app.listen(9000, () => {
  console.log('server is running on port 9000')
})
