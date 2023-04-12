const Promise = require('../promise')

const p = new Promise((resolve, reject) => {
  console.log('executor')
  // 正常情况
  resolve('resolve')
  reject('reject')
})

p.then(data => {
  console.log(data, 'success');
}, reason => {
  console.log(reason, 'fail');
})

p.then(data => {
  console.log(data, 'success1');
}, reason => {
  console.log(reason, 'fail1');
})