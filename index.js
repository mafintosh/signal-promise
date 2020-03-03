module.exports = class Signal {
  constructor () {
    this._resolve = null
    this._reject = null
    this._promise = null
    this._bind = bind.bind(this)
  }

  wait (max) {
    if (!this._promise) this._promise = new Promise(this._bind)
    if (max) return this._sleep(this._promise, max)
    return this._promise
  }

  _sleep (p, max) {
    let id
    const clear = () => clearTimeout(id)
    const s = new Promise(resolve => {
      id = setTimeout(resolve, max, true)
    })

    p.then(clear)
    p.catch(clear)

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

function bind (resolve, reject) {
  this._resolve = resolve
  this._reject = reject
}
