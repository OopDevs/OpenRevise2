function swapAppTheme (selectedTheme)  {
  function invertMasterLogo (selectedIcon) {
    var MASTER_LOGO_INVERTED_CLASS = 'master-logo-light'
    var logo = $('#master-navbar-logo')
    switch (selectedIcon) {
      case true:
        logo.addClass(MASTER_LOGO_INVERTED_CLASS)
        break
      case false:
        logo.removeClass(MASTER_LOGO_INVERTED_CLASS)
    }
  }
  const THEME_PATH = 'master/bulma/bulmaswatch-%1$s.min.css'
  if (THEMES.includes(selectedTheme)) {
    $('#master-theme').attr('href', sprintf(THEME_PATH, selectedTheme))
    switch (selectedTheme) {
      case 'bulma':
        invertMasterLogo(true)
        break
      case 'cyborg':
        invertMasterLogo(false)
        break
      case 'slate':
        invertMasterLogo(false)
        break
      case 'superhero':
        invertMasterLogo(false)
        break
      case 'litera':
        invertMasterLogo(true)
        break
      case 'spacelab':
        invertMasterLogo(true)
        break
    }
  } else {
    console.error(new TypeError('selectedTheme is not a value of: ' + THEMES))
    console.log('Resetting theme to bulma.')
    SettingsManager.set('selectedTheme', 'bulma')
  }
}

function openPopupPage (selectedPage) {
  var newPopup = window.open('master-popup.html#'+selectedPage, "_blank", 'menubar=yes')
  newPopup.focus()
}

$(document).ready(function () {
  if (SettingsManager.get('selectedTheme') === null) {
    SettingsManager.set('selectedTheme', 'bulma')
  } else {
    swapAppTheme(SettingsManager.get('selectedTheme'))
  }

  const TAB_ID_PREFIX = '#master-navbar-item-'
  var currentPage = ''

  function switchPage (selectedPage) {
    if (selectedPage != currentPage) {
      var pages = Array.from(PAGES)
      if (pages.includes(selectedPage)) {
        $(TAB_ID_PREFIX + selectedPage).addClass('is-active')
        pages.splice(pages.indexOf(selectedPage), 1)
        $(pages).each((index, page) => {
          $(TAB_ID_PREFIX + page).removeClass('is-active')
        })
        $('#master-navbar-burger').removeClass('is-active')
        $('#master-navbar-menu').removeClass('is-active')
        $('#master-main-loading-bar').css('display', 'block')
        $('#master-main').load(selectedPage + '.html', () => {
          $('#master-main-loading-bar').css('display', 'none')
          currentPage = selectedPage
        })
      } else {
        throw new TypeError('selectedPage "' + selectedPage +'" not a value of: ' + PAGES)
      }
    } else {
      console.warn('selectedPage "' + selectedPage + '" is already selected!')
    }
  }

  switchPage('home')
  $('#master-navbar-burger').click(() => {
    $('#master-navbar-burger').toggleClass('is-active')
    $('#master-navbar-menu').toggleClass('is-active')
  })
  $(TAB_ID_PREFIX + 'home').click(() => switchPage('home'))
  $(TAB_ID_PREFIX + 'revision').click(() => switchPage('revision'))
  $(TAB_ID_PREFIX + 'settings').click(() => switchPage('settings'))
  $(TAB_ID_PREFIX + 'calculator').click(() => switchPage('calculator'))
  // document.getElementById(TAB_ID_PREFIX + 'player') = () => switchPage('player')
})