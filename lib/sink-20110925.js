/*!
  * Sink - Browser & Headless JavaScript Unit Tester
  * copyright Dustin Diaz & Jacob Thornton
  * https://github.com/ded/sink-test
  * License MIT
  */
!function(context) {
  var total = 0
    , logKey = ''
    , fail = false
    , modules = []
    , tests = []
    , item
    , setPasses = true
    , allPass = true
    , beforeMethods = []
    , afterMethods = []
    , currentSetName
    , isHeadless = (typeof module !== 'undefined' && module.exports)

  isHeadless ? (require('colors')) : String.prototype.__defineGetter__ && !function () {
      each(['red', 'green', 'magenta', 'rainbow', 'yellow'], function (color) {
        String.prototype.__defineGetter__(color, function () {
          return this.replace(/( )/, '$1') // stupid workaround to not log an object
        })
        String.prototype.__defineSetter__(color, function (v) {})
      })
    }()

  !isHeadless && window && !('console' in window) && !function () {
    context.console = {log: function () {}}
  }()

  function reset() {
    total = 0
    fail = false
    init()
  }

  function failure(li, check) {
    setPasses = false
    allPass = false
    if (!isHeadless) {
      check.innerHTML = '✗'
      li.className = 'fail'
    }
    reset()
  }

  function each(items, fn) {
    for (var i = 0; i < items.length; i++) fn(items[i])
  }

  function pass(li, check) {
    if (!isHeadless) {
      check.innerHTML = '✓'
      li.className = 'pass'
    }
    reset()
  }

  function before(fn) {
    fn ? beforeMethods.push(fn) : each(beforeMethods, function (f) {
      f()
    })
  }

  function after(fn) {
    fn ? afterMethods.push(fn) : each(afterMethods, function (f) {
      f()
    })
  }

  function bind(li) {
    li.onclick = function() {
      var ul = this.getElementsByTagName('ul')[0]
      ul.className = (ul.className) ? '' : 'show'
    }
  }

  function _test(name, expect, fn) {
    before()
    total = expect
    var li, check, start = +new Date
    if (!isHeadless) {
      li = document.createElement('li')
      li.innerHTML = name + ' ... <span>o</span><ul></ul>'
      item = li.getElementsByTagName('ul')[0]
      bind(li)
      check = li.getElementsByTagName('span')[0]
      document.getElementById('tests').appendChild(li)
    } else {
      console.log(logKey + (name + '...').yellow)
    }

    fn()
    setTimeout(function() {
      if (sink.timeout && (+new Date - start > sink.timeout)) {
        failure(li, check)
        after()
      } else {
        if (fail) {
          failure(li, check)
          after()
        } else if (!total) {
          after()
          pass(li, check)
        } else {
          setTimeout(arguments.callee, 10)
        }
      }
    }, 10)
  }

  function test(name, expect, fn) {
    tests.push({
      name: name,
      expect: expect,
      fn: fn
    })
  }

  function init() {
    if (tests.length) {
      var o = tests.shift()
      _test(o.name, o.expect, o.fn)
    } else {
      setPasses = true
      start()
    }
  }

  function assert(actual, expected, msg) {
    var b = actual === expected
      , message = b ? '' : '<b>actual: ' + actual.toString() + '</b><b>expected: ' + expected.toString() + '</b>'
    if (isHeadless) {
      message = b ? '' : '\n\tactual: ' + actual.toString() + '\n\texpected: ' + expected.toString()
      if (b) console.log(logKey + msg + (message + ' ✓').green)
      else console.log(logKey + msg + (message + ' ✗').red)
    } else {
      var li = document.createElement('li')
      li.className = b ? 'pass' : 'fail'
      li.innerHTML = msg + ' ' + message + ' ' + '<em class="marker">' + (b ? '✓' : '✗') + '</em>'
      item.appendChild(li)
    }

    if (b) total--
    else fail = true
  }

  function ok(b, message) {
    if (isHeadless) {
      if (b) console.log(logKey + (message + ' ✓').green)
      else console.log(logKey + (message + ' ✗').red)
    } else {
      var li = document.createElement('li')
      li.className = b ? 'pass' : 'fail'
      li.innerHTML = message + ' ' + (b ? '✓' : '✗')
      item.appendChild(li)
    }

    if (b) total--
    else fail = true
  }

  function sink(name, fn) {
    modules.push({
      name: name,
      fn: fn
    })
  }

  function nextGroup(name, fn) {
    beforeMethods = []
    afterMethods = []
    var mod = ('MODULE: ' + name)
    if (isHeadless) {
      console.log(logKey + mod.magenta)
    } else {
      var li = document.createElement('li')
      li.innerHTML = mod
      document.getElementById('tests').appendChild(li)
      li.className = 'mod'
    }
    fn(test, ok, before, after, assert)
    currentSetName = name
    init()
  }

  function start() {
    var current = modules.shift()
    current ? nextGroup(current.name, current.fn) : !function () {
      var message = [
            'Congratulations! All tests have passed!'
          , 'There were some errors! The suite has failed.'
        ]
        , color = allPass ? 'rainbow' : 'red'
        , status = allPass ? 'sink-pass' : 'sink-failure'
      message = message[allPass ? 0 : 1].toUpperCase()
      isHeadless ?
        console.log(logKey + message[color]) :
        (document.getElementById('tests').className = status)
    }()
  }

  function setLogKey (key) {
    var log = console.log
    logKey = key || '$__sinkTest::'
    console.log = function (msg) {
      if (~(''+msg).indexOf(logKey)) {
        log(msg.replace(logKey, ''))
      }
    }
  }

  if (isHeadless) {
    exports.sink = sink
    exports.start = start
    exports.sink.timeout = 10000
    exports.setLogKey = setLogKey
  } else {
    context.sink = sink
    context.start = start
    context.sink.timeout = 10000
  }

}(this)
