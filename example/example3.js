const Promise = require('../promise')

const p = new Promise((resolve, reject) => {
  resolve('ok')
})

let p2 = p.then().then().then()
p2.then(data => {
  console.log('data', data)
}).catch(err => {
  console.log(err)
})
