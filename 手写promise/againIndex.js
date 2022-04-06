Promise.prototype.then = function(onResolved,onRejected) {
  var self = this
  var promise2
  onResolved = typeof onResolved === 'function' ? onResolved : function(value){return value}
  onRejected = typeof onRejected === 'function' ? onRejected : function(reason) {throw reason}

  if(self.status === 'resolved') {
    return promise2 = new Promise(function(resolve,reject) {
      try {
        var x = onResolved(self.data)
        if(x instanceof Promise) {
          x.then(resolve,reject)
        }
        resolve(x)
      } catch(e) {
        reject(e)
      }
    })
  }

  if(self.status === 'rejected') {
    return promise2 = new Promise(function(resolve,reject) {
      try {
        var x = onRejected(self.data) 
        if(x instanceof Promise) {
          x.then(resolve,reject)
        }
      } catch(e) {
        reject(e)
      }
    })
  }

  if(self.status === 'padding') {
    return promise2 = new Promise(function(resolve,reject) {
      self.onReslovedCallback.push(function(value) {
        try {
          var x = onRejected(self.data)
          if(x instanceof Promise) {
            x.then(resolve,reject)
          }
        } catch(e) {
          reject(e)
        }
      })

      self.onRejectedCallback.push(function(reason) {
        try {
          var x = onRejected(self.data)
          if(x instanceof Promise) {
            x.then(resolve,reject)
          }
        } catch(e) {
          reject(e)
        }
      })
    })
  }

}


Promise.prototype.catch = function(onRejected) {
  return this.then(null,onRejected)
}

function Promise(executor) {
  var self = this
  self.status = 'pending'
  self.onReslovedCallback = []
  self.onRejectedCallback = []

  function resolve(value) {
    if(self.status === 'padding') {
      self.status = 'resolved'
      self.data = value
      for(var i = 0; i < self.onReslovedCallback.length; i++) {
        self.onReslovedCallback[i](value)
      }
    }
  }

  function reject(reason) {
    if(self.status === 'pedding') {
      self.status === 'rejected'
      self.data = reason
      for(var i = 0; i < self.onRejectedCallback.length; i++) {
        self.onRejectedCallback[i](reason)
      }
    }
  }

  try {
    executor(resolve,reject)
  } catch(e) {
    reject(e)
  }
}