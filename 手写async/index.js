

const getData = () => new Promise(resolve => setTimeout(() => resolve("data333"), 1000))

// async function test() {
//   const data = await getData()
//   console.log('data', data)
//   const data2 = await getData()
//   console.log('data2', data2)
//   return 'success'
// }

function asyncToGenerator(generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult
        try {
          generatorResult = gen[key](arg)
        } catch (error) {
          return reject(error)
        }

        const { value, done } = generatorResult
        if (done) {
          return resolve(value)
        } else {
          // 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用
          return Promise.resolve(value).then(
            val => step('next', val),
            err => step('throw', err))
        }
      }
      step('next')
    })
  }
}


var test = asyncToGenerator(
  function* testG() {
    const data = yield getData()
    console.log('data', data);
    const data2 = yield getData()
    console.log('data2', data2)
    return 'success'
  }
)

test().then(res => console.log(res))