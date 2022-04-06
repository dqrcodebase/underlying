
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


MyPromise.prototype.then = function (onFullfilled, onRejected) {
  var self = this
  var nextPromise = new MyPromise(function (res, rej) {

    // 在then里面只要回调函数的返回值不报错就是执行res
    if (self.status === 'Fulfilled') {
      var nextResolveValue = onFullfilled(self.resolveValue)
      res(nextResolveValue)
    }
    if (self.status === 'Rejected') {
      var nextRejectValue = onRejected(self.rejectReason)
      res(nextRejectValue)
    }

    // 当异步执行的时候就可能是pedding状态
    // 等异步函数执行resolve或reject时执行数组里的方法
    if (self.status === 'pending') {
      self.ResolveCallBackList.push(function () {
        var nextResolveValue = onFullfilled(self.resolveValue)
        res(nextResolveValue)
      })
      self.RejectCallBackList.push(function () {
        var nextRejectValue = onRejected(self.rejectReason)
        res(nextRejectValue)
      })
    }
  })
  return nextPromise
}