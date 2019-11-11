# nodejs-middleware
nodejs 中间件的原理

### 总结

 - **注册中间件:** 先将所有的 use, get, post 等函数传递过来的参数进行分类存储在数组中, 得到类似下面的数组

```js
this.routes = {
  all: [],
  get: [],
  post: []
  // ...
}

// all 示例
all: [
  {
    path: '/',
    stack: [[Function: start], ...]
  },
  {
    path: '/',
    stack: [[Function: setCookie], ...]
  },
  {
    path: '/',
    stack: [[Function: setBody], ...]
  },
  {
    path: '/api',
    stack: [[Function: handleApi, ...]]
  }
]
// ...
```