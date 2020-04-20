(function () {
  const SETTING_KEYS_PREFIX = 'OpenRevise2.'
  const SETTING_KEYS = {
    theme: SETTING_KEYS_PREFIX + "selectedTheme"
  }
  console.log('Current theme: ' + SettingsManager.get(SETTING_KEYS.theme))
  document.getElementById('settings-select-theme').value = SettingsManager.get(SETTING_KEYS.theme)
  document.getElementById('settings-select-theme').onchange = (e) => {
    swapAppTheme(e.target.value)
    SettingsManager.set(SETTING_KEYS.theme, e.target.value)
  }
})()