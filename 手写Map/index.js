// Map
// 1、不重复
// 2、string object NaN null function array number
// 3、set get delete has clear


function myMap() {
  // 规定桶的长度为8
  this.bucketLength = 8
  this.init()
}
myMap.prototype.init = function () {
  // 初始化 桶
  this.bucket = new Array(this.bucketLength)
  for (var i = 0; i < this.bucket.length; i++) {
    this.bucket[i] = {
      type: 'bucket_' + i,
      next: null
    }
  }
}

myMap.prototype.makeHash = function (key) {
  let hash = 0;
  if (typeof key !== 'string') {
    if (typeof key === 'number') {
      // number NaN
      hash = Object.is(key, NaN) ? 0 : key
    } else if (typeof key === 'object') {
      // null {} []
      hash = 1
    } else if (typeof key === 'boolean') {
      hash = Number(key)
    } else {
      hash = 2
    }
  } else {
    // string
    // 自己定义一个规则
    // 长度大于等于前三个字符ascii累计

    for (var i = 0; i < 3; i++) {
      hash += key[i] ? key[i].charCodeAt(0) : 0
    }
  }
  return hash % 8

}
myMap.prototype.set = function (key, value) {
  let hash = this.makeHash(key)
  let oTempBucket = this.bucket[hash]
  while (oTempBucket.next) {
    if (oTempBucket.key === key) {
      oTempBucket.next.value = value
      return
    } else {
      oTempBucket = oTempBucket.next
    }
  }
  oTempBucket.next = {
    key: key,
    value: value
  }
}
myMap.prototype.get = function (key) {

  let hash = this.makeHash(key)
  let oTempBucket = this.bucket[hash]
  while (oTempBucket) {
    if (oTempBucket.key === key) {
      return oTempBucket.value
    } else {
      oTempBucket = oTempBucket.next
    }
  }

}
myMap.prototype.delete = function (key) {
  let hash = this.makeHash(key)
  let oTempBucket = this.bucket[hash]
  while (oTempBucket.next) {
    if (oTempBucket.next.key === key) {
      oTempBucket.next = oTempBucket.next.next
      return true
    } else {
      oTempBucket = oTempBucket.next
    }
  }
  return false

}
myMap.prototype.has = function (key) {
  let hash = this.makeHash(key)
  let oTempBucket = this.bucket[hash]
  while (oTempBucket) {
    if (oTempBucket.next && oTempBucket.next.key === key) {
      return true
    } else {
      oTempBucket = oTempBucket.next
    }
  }
  return false
}


let oMp = new myMap()