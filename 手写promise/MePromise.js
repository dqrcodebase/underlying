function MePromise(executor) {
  var self = this;
  self.status = 'pending'
  self.resolveValue = null
  self.rejectReason = null
  self.ResolveCallBackList = []
  self.RejectCallBackList = []
  function resolve(val) {
    if (self.status === 'pending') {
      self.status = 'Fulfilled'
      self.resolveValue = val
      self.ResolveCallBackList.forEach(function (ele) {
        ele()
      })
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'Rejected'
      self.rejectReason = reason
      self.RejectCallBackList.forEach(function (ele) {
        ele(self.rejectReason)
      })
    }
  }

  try {
    executor(resolve, reject)
  } catch (e) {
    reject
  }
}


MePromise.prototype.then = function (onFulfilled, onRejected) {
  var self = this
  var nextPromise = new MePromise(function () {
  console.log(self.status)

    if (self.status === 'Fulfilled') {
      onFulfilled(self.resolveValue)
    }
    if (self.status === 'Rejected') {
      onRejected(self.rejectReason)
    }

    if (self.status === 'pending') {
      self.ResolveCallBackList.push(function (res) {
        onFulfilled(self.resolveValue)
      })

      self.RejectCallBackList.push(function (reason) {
        onRejected(self.rejectReason)
      })
    }
  })
  return nextPromise
}