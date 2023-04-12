const Promise = require('../promise')

Promise.resolve(1)
  .then(data => {
    console.log(data)
  })
  .catch(err => console.log(err))

Promise.all([1, 2, 3])
  .then(data => {
    console.log(data)
  })
  .catch(err => console.log(err))
