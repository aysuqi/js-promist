const Promise = require('../promise')

const p = new Promise((resolve, reject) => {
  console.log('executor')
  // 异步的情况
  setTimeout(() => {
    resolve()
    reject()
  }, 1000);
})

p.then(data => {
  console.log(data, 'success1');
}, reason => {
  console.log(reason, 'fail1');
})

p.then(data => {
  console.log(data, 'success2');
}, reason => {
  console.log(reason, 'fail2');
})