(function () {
  console.log('Current theme: ' + SettingsManager.get('selectedTheme'))
  document.getElementById('settings-select-theme').value = SettingsManager.get('selectedTheme')
  document.getElementById('settings-select-theme').onchange = (e) => {
    swapAppTheme(e.target.value)
    SettingsManager.set('selectedTheme', e.target.value)
    console.log('Set theme: ' + SettingsManager.get('selectedTheme'))
  }
})()