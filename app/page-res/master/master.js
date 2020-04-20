'use strict'

var SettingsManager = {
  PREFIX: 'OpenRevise' + '.'
}

SettingsManager.set = (key, value) => {
  localStorage.setItem(SettingsManager.PREFIX + key, value)
}

SettingsManager.get = (key) => {
  return localStorage.getItem(key)
}

SettingsManager.clear = () => {
  localStorage.clear()
}

function swapAppTheme (selectedTheme) {
  function invertMasterLogo (selectedIcon) {
    var MASTER_LOGO_INVERTED_CLASS = 'master-logo-light'
    var logo = document.getElementById('master-navbar-logo')
    switch (selectedIcon) {
      case true:
        logo.classList.add(MASTER_LOGO_INVERTED_CLASS)
        break
      case false:
        logo.classList.remove(MASTER_LOGO_INVERTED_CLASS)
    }
  }
  const THEMES = ['bulma', 'cyborg', 'slate', 'superhero', 'litera', 'spacelab']
  var THEME_PATH = 'page-res/global/bulma/bulmaswatch-%1$s.min.css'
  if (THEMES.includes(selectedTheme)) {
    document.getElementById('master-theme').setAttribute('href', sprintf(THEME_PATH, selectedTheme))
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
    localStorage.setItem('OpenRevise2.selectedTheme', selectedTheme)
  } else {
    console.error(new TypeError('selectedTheme is not a value of: ' + THEMES))
    console.log('Resetting theme to bulma.')
    SettingsManager.set('selectedTheme', )
  }
}

(function () {
  const RUNTIME_THEME = SettingsManager.get('selectedTheme')
  if (RUNTIME_THEME === null) {
    SettingsManager.set('selectedTheme', 'bulma')
  } else {
    swapAppTheme(RUNTIME_THEME)
  }

  const TAB_ID_PREFIX = 'master-navbar-item-'
  var currentPage = ''

  function switchPage (selectedPage) {
    if (selectedPage != currentPage) {
      var pages = ['home', 'revision', 'settings', 'calculator', 'player']
      if (pages.includes(selectedPage)) {
        document.getElementById(TAB_ID_PREFIX + selectedPage).classList.add('is-active')
        pages.splice(pages.indexOf(selectedPage), 1)
        pages.forEach((page) => {
          document.getElementById(TAB_ID_PREFIX + page).classList.remove('is-active')
        })
        document.getElementById('master-navbar-burger').classList.remove('is-active')
        document.getElementById('master-navbar-menu').classList.remove('is-active')
        document.getElementById('master-main-loading-bar').style.display = 'block'
        // fetch(selectedPage + '.html').then((response) => {
        //   return response.text()
        // }).then((html) => {
        //   document.getElementById('master-main').innerHTML = html
        //   document.getElementById('master-main-loading-bar').style.display = 'none'
        //   currentPage = selectedPage
        // })
        $('#master-main').load(selectedPage + '.html', () => {
          document.getElementById('master-main-loading-bar').style.display = 'none'
          currentPage = selectedPage
        })
      } else {
        throw new TypeError('selectedPage not a value of: ' + pages)
      }
    } else {
      console.warn('selectedPage "' + +selectedPage + '" is already selected!')
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    switchPage('home')
    document.getElementById('master-navbar-burger').onclick = () => {
      document.getElementById('master-navbar-burger').classList.toggle('is-active')
      document.getElementById('master-navbar-menu').classList.toggle('is-active')
    }
    document.getElementById(TAB_ID_PREFIX + 'home').onclick = () => switchPage('home')
    document.getElementById(TAB_ID_PREFIX + 'revision').onclick = () => switchPage('revision')
    document.getElementById(TAB_ID_PREFIX + 'settings').onclick = () => switchPage('settings')
    document.getElementById(TAB_ID_PREFIX + 'calculator').onclick = () => switchPage('calculator')
    // document.getElementById(TAB_ID_PREFIX + 'player') = () => switchPage('player')
  })
})()
