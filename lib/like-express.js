const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [],
      // all: [
      //   {
      //     path: '/',
      //     stack: [fn1, fn2, fn3]
      //   },
      //   {
      //     path: '/',
      //     stack: [fn]
      //   }
      // ]
      get: [],
      post: []
      // put: [],
      // delete: [],
      // patch: []
    }
  }

  // 通用的注册中间件的方法
  register(path) {
    const info = {}

    // 第一个参数传入了路由, 不传入则默认根路由
    if (typeof path === 'string') {
      info.path = path

      // 将第二个参数开始, 将所有的参数转换成数组, 放到 stack 中
      info.stack = slice.call(arguments, 1)
    } else {
      // 默认是根路由, 比如 use
      info.path = '/'

      // 将第一个参数开始, 将所有的参数转换成数组, 放到 stack 中
      info.stack = slice.call(arguments, 0)
    }

    return info
  }

  use() {
    const info = this.register.apply(this, arguments)
    this.routes.all.push(info)
  }

  get() {
    const info = this.register.apply(this, arguments)
    this.routes.get.push(info)
  }

  post() {
    const info = this.register.apply(this, arguments)
    this.routes.post.push(info)
  }

  match(method, url) {
    let stack = []
    if (url === '/favicon.ico') {
      return stack
    }

    // 获取 routes
    let curRoutes = []
    curRoutes = curRoutes.concat(this.routes.all)
    curRoutes = curRoutes.concat(this.routes[method])

    console.log(curRoutes)

    curRoutes.forEach(routeInfo => {
      if (url.indexOf(routeInfo.path) === 0) {
        // 如果访问的路由 url, 包含了当前中间件的路由 routeInfo.path
        stack = stack.concat(routeInfo.stack)
      }
    })

    return stack
  }

  // 核心的 next 机制
  handle(req, res, stack) {
    const next = () => {
      // 拿到第一个匹配的中间件
      const middleware = stack.shift()
      if (middleware) {
        // 执行中间件函数
        middleware(req, res, next)
      }
    }

    next()
  }

  callBack() {
    return (req, res) => {
      res.json = data => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }

      const url = req.url
      const method = req.method.toLowerCase()

      const resultList = this.match(method, url)
      this.handle(req, res, resultList)
    }
  }

  listen(...args) {
    const server = http.createServer(this.callBack())

    // node.js 原生直接使用传入的参数
    server.listen(...args)
  }
}

// 工厂函数
module.exports = () => {
  return new LikeExpress()
}
