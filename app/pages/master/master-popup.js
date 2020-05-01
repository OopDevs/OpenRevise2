const MASTER_POPUP = true

$(document).ready(function () {
  function displayFailed (err) {
    $('#master-popup-main-failed-buttons-close').click(() => {
      window.close()
    })
    $('#master-popup-main-failed-message').text(sprintf('We encountered an error displaying your requested Popup.\n\n(error: %1$s)', err))
    $('#master-popup-main-failed').removeClass('is-hidden')
    $('#master-main-popup-loading-bar').addClass('is-hidden')
  }
  try {
    SettingsManager.get('selectedTheme').then((selectedTheme) => {
      if (selectedTheme === null) {
        SettingsManager.set('selectedTheme', 'bulma')
        selectedTheme = 'bulma'
      }
      if ($.inArray(selectedTheme, THEMES) !== -1) {
        $('#master-popup-theme').attr('href', sprintf('master/bulma/bulmaswatch-%1$s.min.css', selectedTheme))
      } else {
        console.error(new TypeError('selectedTheme is not a value of: ' + THEMES))
        console.log('Resetting theme to bulma.')
        SettingsManager.set('selectedTheme', 'bulma').then(() => {
          console.log('Resetted theme to bulma!')
        })
      }
    })
    var selectedPage = window.location.hash.split('#')[1]
    console.log('Hash: ' + window.location.hash)
    if (PAGES.includes(selectedPage)) {
      $('#master-main-popup-loading-bar').removeClass('is-hidden')
      $('#master-popup-main').load(selectedPage + '.html', () => {
        document.title = 'OpenRevise Popup View - ' + selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)
        $('#master-main-popup-loading-bar').addClass('is-hidden')
      })
    } else {
      var newError = new TypeError('selectedPage not a value of: ' + PAGES) 
      displayFailed(newError)
      throw newError
    }
  } catch (err) {
    displayFailed(err)
  }
})

window.onerror = (err) => {
  console.error(err)
}