class SettingsManagerInstance {
  constructor () {
    this.STORE = localforage.createInstance({
      name: 'OpenRevise2-Settings'
    })
  }

  set (key, value) {
    return this.STORE.setItem(key, value)
  }

  get (key) {
    return this.STORE.getItem(key)
  }

  clear () {
    return this.STORE.clear()
  }
}

var SettingsManager = new SettingsManagerInstance()
