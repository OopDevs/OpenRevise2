var SettingsManager = {
  PREFIX: 'OpenRevise2' + '.'
}

SettingsManager.set = (key, value) => {
  localStorage.setItem(SettingsManager.PREFIX + key, value)
}

SettingsManager.get = (key) => {
  return localStorage.getItem(SettingsManager.PREFIX + key)
}

SettingsManager.clear = () => {
  localStorage.clear()
}