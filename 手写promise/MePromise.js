function MePromise (executor) {
  var self = this;
  self.status = 'pending'
  self.resolveValue = null
  self.rejectReason = null
  self.ResolveCallBackList = []
  self.RejectCallBackList = []
  function resolve (val) {
    if (self.status === 'pending') {
      self.status = 'Fulfilled'
      self.resolveValue = val
      self.ResolveCallBackList.forEach(function (ele) {
        ele(self.resolveValue)
      })
    }
  }

  function reject (reason) {
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


function ResolutionRetrunPromise (nextPromise, nextResolveValue, res, rej) {
  if (nextResolveValue instanceof MePromise) {
    console.log(nextResolveValue);
    if (nextResolveValue.status === 'Fulfilled') {
      res(nextResolveValue.resolveValue)
    }
    if (nextResolveValue.status === 'Rejected') {
      rej(nextResolveValue.rejectReason)
    }
  } else {
    res(nextResolveValue)
  }
}

MePromise.prototype.then = function (onFulfilled, onRejected) {
  var self = this
  var nextPromise = new MePromise(function (res, rej) {
    console.log(self.status)
    if (!onFulfilled) onFulfilled = function (res) { return res }
    if (!onRejected) onRejected = function (reason) { return reason }

    if (self.status === 'Fulfilled') {
      setTimeout(function () {
        try {
          const nextResolveValue = onFulfilled(self.resolveValue)
          ResolutionRetrunPromise(nextPromise, nextResolveValue, res, rej)
          // res(nextResolveValue)
        } catch (e) {
          rej(e)
        }
      })
    }
    if (self.status === 'Rejected') {
      setTimeout(function () {
        try {
          const nextRejectReason = onRejected(self.rejectReason)
          ResolutionRetrunPromise(nextPromise, nextRejectReason, res, rej)

        } catch (e) {
          rej(e)
        }
      })


    }

    if (self.status === 'pending') {
      self.ResolveCallBackList.push(function () {
        setTimeout(function () {
          try {
            const nextResolveValue = onFulfilled(self.resolveValue)
            ResolutionRetrunPromise(nextPromise, nextResolveValue, res, rej)

          } catch (e) {
            rej(e)
          }
        })
      })
      self.RejectCallBackList.push(function () {
        setTimeout(function () {
          try {
            const nextRejectReason = onRejected(self.rejectReason)
            ResolutionRetrunPromise(nextPromise, nextRejectReason, res, rej)

          } catch (e) {
            rej(e)
          }
        })
      })

    }
  })
  return nextPromise
}