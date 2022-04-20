let fs = require('fs')
function readFile (path) {
  return new Promise((res, rej) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        rej()
      } else {
        res(data)
      }
    })
  })
}

// readFile('./data/name.txt').then(val => {
//   return readFile(val)
// }).then(val => {
//   return readFile(val)
// }).then(val => {
//   console.log(val);
// })

// 用generator改写上面函数

function* read () {
  let val1 = yield readFile('./data/name.txt')
  let val2 = yield readFile(val1)
  let val3 = yield readFile(val2)
  return val3
}

// let oG = read()

// let { value, done } = oG.next()
// value.then((val) => {
//   let { value, done } = oG.next(val)
//   value.then((val) => {
//     let { value, done } = oG.next(val)
//     value.then(val => {
//       console.log(val);
//     })
//   })
// })

//  递归优化

function Co (oIt) {
  return new Promise((res, rej) => {
    let next = (data) => {
      let { value, done } = oIt.next(data)
      if (done) {
        res(value)
      } else {
        value.then((val) => {
          next(val)
        })
      }
    }
    next()
  })
}

Co(read()).then(val => {
  console.log(val);
})