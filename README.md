# nodejs express 中间件的'简版'原理理解

## 安装

```bash
# 克隆
git clone https://github.com/liguoyou/nodejs-middleware.git

# 安装运行依赖
npm install

# 执行
node test/test.js
```

## 总结

- 值得注意的是: 注册中间件时, 第一个参数是 path, 不传递的则默认为: '/'

- **注册中间件:** 先将所有的 use, get, post 等函数传递过来的参数进行分类存储在数组中, 得到类似下面的数组

```js
this.routes = {
  all: [],
  get: [],
  post: []
  // ...
}

// 执行 node test/test.js
all [
  { path: '/', stack: [ [Function: start] ] },
  { path: '/', stack: [ [Function: setCookie] ] },
  { path: '/', stack: [ [Function: setBody] ] },
  { path: '/api', stack: [ [Function: handleApi] ] }
]

get [
  { path: '/api', stack: [ [Function: getApi] ] },
  { path: '/api/get-cookie',
    stack: [
      [Function: loginCheckout],
      [Function: getCookieApi]
    ]
  }
]

post [
  { path: '/api', stack: [ [Function: postApi] ] },
  { path: '/api/post-data', stack: [ [Function: postData] ] }
]
```

- **找到要执行的中间件:** 根据请求的 method 和 url 来找到所有符合条件的函数集合: stackList

```js
// 浏览器访问 http://localhost:9000/api/get-cookie
// 此时 method: get, url: /api/get-cookie

stackList [
  [Function: start],
  [Function: setCookie],
  [Function: setBody],
  [Function: handleApi],
  [Function: getApi],
  [Function: loginCheckout],
  [Function: getCookieApi]
]
```

- **执行中间件:** 将 stackList 传入 handle 的 next 中, 递归执行

示例:

```js
// 核心的 next 机制 - origin: lib/express.js
handle(req, res, stackList) {
  const next = () => {
    // 拿到 stackList 第一个匹配的中间件执行,
    // shift() 移除并返回第一个元素
    const middleware = stackList.shift()
    if (middleware) {
      // 执行中间件函数
      middleware(req, res, next)
    }
  }

  next()
}

// 传入上方2中的 stackList
handle(req, res, stackList)

// 拿到 stackList 第一个匹配的中间件([Function: start])执行, 并移除

// 执行并传入 next
// middleware(req, res, next)

// test.sj 中的 [Function: start] 中执行了 next()

// 所以 拿到 stackList 第一个匹配的中间件执行...

// ...
```

end
