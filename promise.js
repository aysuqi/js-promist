const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

/* 为了所有 promise 可以互相调用，所有的promise都要遵循这个规则
  参考文档：https://promisesaplus.com/
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) return reject(new TypeError('出错了'))

  // 判断 x 是否是 promise
  let isObj = typeof x === 'object' && x !== null
  if (isObj || typeof x === 'function') {
    let called = false
    // 有可能是 promise
    try {
      let then = x.then
      if (typeof then === 'function') {
        // 是 promise
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        // 不是 promise，就是一个对象或者函数
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // 普通值，直接将结果传递到下面
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    // 默认是等待的状态
    this.status = PENDING
    // 成功的原因
    this.value = undefined
    // 失败的原因
    this.reason = undefined
    this.onResolvedCallBacks = []
    this.onRejectedCallBacks = []
    /* 
      调用then时候，可能状态依旧是pending，那么需要将回调函数存放起来
      等待一会调用resolve的时候触发onResolvedCallBacks执行
      等待一会调用reject的时候触发onRejectedCallBacks执行
    */
    const resolve = value => {
      if (value instanceof Promise) {
        // 递归解析流程
        return value.then(resolve, reject)
      }
      // 只有状态是pending的时候才可以改变状态和改变成功和失败的原因
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallBacks.forEach(cb => cb())
      }
    }
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallBacks.forEach(cb => cb())
      }
    }

    // 立即调用执行器，会自动传递成功的方法和失败的方法
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  catch(errCallback) {
    return this.then(null, errCallback)
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : e => {
            throw e
          }

    let promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 1000)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 1000)
      }

      /* 异步情况的处理逻辑 */
      if (this.status === PENDING) {
        this.onResolvedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 1000)
        })

        this.onRejectedCallBacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 1000)
        })
      }
    })

    return promise2
  }

  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(values) {
    return new Promise((resolve, reject) => {
      let arr = []
      let times = 0
      let processData = function (index, data) {
        arr[index] = data
        if (++times === values.length) {
          resolve(arr)
        }
      }

      for (let i = 0; i < values.length; i++) {
        let cur = values[i]
        Promise.resolve(cur).then(data => {
          processData(i, data)
        }, reject)
      }
    })
  }

  static race(values) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < values.length; i++) {
        let cur = values[i]
        Promise.resolve(cur).then(resolve, reject)
      }
    })
  }
}

module.exports = Promise

// 测试promise的是否符合规范的测试库：promises-aplus-tests
// 安装 promises-aplus-tests -g 使用：promises-aplus-tests promise.js
Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
