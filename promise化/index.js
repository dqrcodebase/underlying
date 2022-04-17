let fs = require('fs')

// fs的读写等操作都是异步的
function promisify (func) {
  return function (...age) {
    return new Promise((res, rej) => {
      func(...age, (err, data) => {
        if (err) {
          rej()
        } else {
          res(data)
        }
      })
    })
  }
}

// promise化异步操作
// let readFile = promisify(fs.readFile)
// let writeFile = promisify(fs.writeFile)
// let readDir = promisify(fs.readDir)

readFile('./data/number.text/', 'utf-8').then((val) => {
  console.log(val);
})

// 给每一个fs方法都注册了一个异步方法
function promisiAll (obj) {
  for (let key in obj) {
    let fn = obj[key]
    if (typeof fn === 'function') {
      obj[key + 'Async'] = promisify(fn)
    }
  }
}

promisiAll(fs)

fs.readFileAsync('./data/number.text', 'utf-8').then(val => {

})