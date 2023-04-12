# 高级函数

> 一个函数返回一个函数，那么这个函数就是高级函数；一个函数的参数是一个函数也是高价函数

```js
function core(a,b,c) {
  console.log('核心代码', a,b,c)
}

core.before = function (cb) {
  return (...arg) => {
    cb()
    this(...arg)
  }
}

let newCore = core.before(function () {
  console.log('before')
})

newCore()
```

## 函数参数的预置 将函数的参数，进行一个保留（闭包）

- 闭包就是函数定义的作用域和执行的作用域不是同一个，此时就会产生闭包

```js
function a() {
  return function() {
    
  }
}

let c = a()
c()
```

## 函数的柯理化（基于高价函数来实现）

- isType 方法的范围比较大
- 函数柯理化将范围具体化，可以实现批量传递参数，通用的函数柯理化实现

- 作用

  - 可以扩展功能
  - 可以对函数的参数进行预测参数

```js
function isType(typing) {
  return function (val) {
    return (Object.prototype.toString.call(val)) === `[object ${typing}]`
  }
}

let utils = {};
['String', 'Number', 'Boolean'].forEach(type => {
  utils[`is${type}`] = isType(type)
})

console.log(utils.isNumber(0))
```

## 高价函数解决异步问题

- 异步方法在处理错误的情况时，必须通过回调的参数来处理
