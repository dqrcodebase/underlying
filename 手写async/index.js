

const getData = () => new Promise(resolve => setTimeout(() => resolve("data333"),1000))

async function test() {
  const data = await getData()
  console.log('data',data)
  const data2 = await  getData()
  console.log('data2',data2)
  return 'success'
}

// var test = asyncToGenerator(
//   function* testG() {
//     const data = yield getData()
//     console.log('data',data);
//     const data2 = yield getData()
//     console.log('data2',data2)
//     return 'success'
//   }
// )

test().then(res => console.log(res))