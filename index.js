module.exports = class Signal {
  constructor () {
    this._resolve = null
    this._reject = null
    this._promise = null
    this._bind = bind.bind(this)
    this._clear = clear.bind(this)
    this._timers = new Set()
  }

  wait (max) {
    if (!this._promise) {
      this._promise = new Promise(this._bind)
      this._promise.then(this._clear).catch(this._clear)
    }
    if (max) return this._sleep(this._promise, max)
    return this._promise
  }

  _sleep (p, max) {
    const s = new Promise(resolve => {
      const done = () => {
        this._timers.delete(id)
        resolve(true)
      }
      const id = setTimeout(done, max)
      this._timers.add(id)
    })

    return Promise.race([s, p])
  }

  notify (err) {
    if (!this._promise) return
    const resolve = this._resolve
    const reject = this._reject
    this._promise = null
    if (err) reject(err)
    else resolve(true)
  }
}

function clear () {
  for (const id of this._timers) clearTimeout(id)
  this._timers.clear()
}

function bind (resolve, reject) {
  this._resolve = resolve
  this._reject = reject
}
