
function MyPromise(executor) {
  var self = this
  self.status = 'pending'
  self.resolveValue = null
  self.rejectReason = null
  self.ResolveCallBackList = []
  self.RejectCallBackList = []
  function resolve(value) {
    if (self.status == 'pending') {
      self.status = 'Fulfilled'
      self.resolveValue = value
      self.ResolveCallBackList.forEach(function (ele, i) {
        ele(self.resolveValue)
      })
    }
  }
  function reject(reason) {
    if (self.status == 'pending') {
      self.status = 'Rejected'
      self.rejectReason = reason
      self.RejectCallBackList.forEach(function (ele, i) {
        ele(self.rejectReason)
      })
    }
  }
  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}


MyPromise.prototype.then = function (onFulfilled, onRejected) {
  var self = this
  // 如果是一个空then的话那么就原封不动的返回给下一个then
  if (!onFulfilled) {
    onFulfilled = function (val) {
      return val;
    }
  }
  if (!onRejected) {
    onRejected = function (reason) {
      throw new Error(reason)
    }
  }

  function ResolutionRetrunPromise(nextPromise, nextReturnValue, res, rej) {
    // 因为nextReturnValue有返回值所以不可能会报错，所有不用try catch
    if (nextReturnValue instanceof MyPromise) {
      nextReturnValue.then(function (value) {
        res(value)
      }, function (reason) {
        rej(reason)
      })
    } else {
      // 如果nextReturnValue只是一个普通值就直接进行res方法
      res(nextReturnValue)
    }
  }

  var nextPromise = new MyPromise(function (res, rej) {
    // 在then里面只要回调函数的返回值不报错就是执行res
    if (self.status === 'Fulfilled') {
      // 用setTimeout模拟微任务
      setTimeout(function () {
        try {
          var nextResolveValue = onFulfilled(self.resolveValue)
          // 因为setTimeout是个异步方法所有可以取到nextPromise的值
          ResolutionRetrunPromise(nextPromise, nextResolveValue, res, rej)
        } catch (e) {
          rej(e)
        }

      })

    }
    if (self.status === 'Rejected') {
      setTimeout(function () {
        try {
          var nextRejectValue = onRejected(self.rejectReason)
          ResolutionRetrunPromise(nextPromise, nextRejectValue, res, rej)
        } catch (e) {
          rej(e)
        }

      })

    }

    // 当异步执行的时候就可能是pedding状态
    // 等异步函数执行resolve或reject时执行数组里的方法
    if (self.status === 'pending') {
      self.ResolveCallBackList.push(function () {
        setTimeout(function () {
          try {
            var nextResolveValue = onFulfilled(self.resolveValue)
            ResolutionRetrunPromise(nextPromise, nextResolveValue, res, rej)
          } catch (e) {
            rej(e)
          }

        })
      })
      self.RejectCallBackList.push(function () {

        setTimeout(function () {
          try {
            var nextRejectValue = onRejected(self.rejectReason)
            ResolutionRetrunPromise(nextPromise, nextRejectValue, res, rej)
          } catch (e) {
            rej(e)
          }

        })
      })

    }
  })
  return nextPromise
}

MyPromise.race = function (promiseArr) {
  return new MyPromise(function (resolve, reject) {
    promiseArr.forEach(function (promise, index) {
      console.log(resolve)
      promise.then(resolve, reject)
    })
  })
}

MyPromise.all = function (promiseArr) {
  return new MyPromise(function (resolve, reject) {
    var length = promiseArr.length
    var rejList = []
    var resList = []
    promiseArr.forEach(function (promise, index) {
      promise.then(function (val) {
        resList.push(val)
        console.log(index);
        if (index === (length - 1)) {
          rejList.length > 0 ? reject(rejList[0]) : resolve(resList)
        }
        // res(val)
      }, function (reason) {
        reject(reason) 
      })
    })
  })
}