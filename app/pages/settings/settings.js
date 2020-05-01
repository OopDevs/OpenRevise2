SettingsManager.get('selectedTheme').then(function (selectedTheme) {
  console.log('Current theme: ' + selectedTheme)
  $('#settings-select-theme').val(selectedTheme)
  $('#settings-select-theme').on('change', function () {
    swapAppTheme(this.value)
    SettingsManager.set('selectedTheme', this.value).then(function () {
      SettingsManager.get('selectedTheme').then(function (selectedTheme2) {
        if (selectedTheme2 === this.value) {
          console.log('Set theme: ' + selectedTheme2)
        }
      })
    })
  })
})